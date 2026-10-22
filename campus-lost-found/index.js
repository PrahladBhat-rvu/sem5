require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const Student = require('./models/Student');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Claim = require('./models/Claim');

const app = express();
const PORT = process.env.PORT || 3000;
const CATEGORIES = ['Electronics', 'ID / Cards', 'Books & Stationery', 'Clothing', 'Keys', 'Bags', 'Water Bottles', 'Accessories', 'Other'];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentStudentId = req.session.studentId || '';
  res.locals.currentStudentName = req.session.studentName || '';
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  res.locals.categories = CATEGORIES;
  next();
});

function validId(id) { return mongoose.isValidObjectId(id); }
function requireStudent(req, res, next) {
  if (!req.session.studentId || !validId(req.session.studentId)) {
    req.flash('error', 'Please select or create your student profile before continuing.');
    return res.redirect('/students/new');
  }
  next();
}
function clean(value) { return typeof value === 'string' ? value.trim() : ''; }
function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
function notFound(res, message = 'The requested record could not be found.') {
  return res.status(404).render('404', { title: 'Not found', message });
}

app.get('/', asyncRoute(async (req, res) => {
  const [lostCount, foundCount, studentCount, recentFound] = await Promise.all([
    LostItem.countDocuments({ status: 'Lost' }),
    FoundItem.countDocuments({ status: 'Available' }),
    Student.countDocuments(),
    FoundItem.find({ status: 'Available' }).populate('reportedBy', 'fullName department').sort({ createdAt: -1 }).limit(4)
  ]);
  res.render('home', { title: 'Campus Lost & Found', lostCount, foundCount, studentCount, recentFound });
}));

// Student profiles
app.get('/students/new', (req, res) => res.render('student-form', { title: 'Create profile' }));
app.post('/students', asyncRoute(async (req, res) => {
  const fullName = clean(req.body.fullName);
  const email = clean(req.body.email).toLowerCase();
  const department = clean(req.body.department);
  const contactNumber = clean(req.body.contactNumber);
  if (!fullName || !email || !department || !contactNumber) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/students/new');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    req.flash('error', 'Enter a valid college email address.');
    return res.redirect('/students/new');
  }
  if (!/^[0-9+\-\s()]{7,20}$/.test(contactNumber)) {
    req.flash('error', 'Enter a valid contact number.');
    return res.redirect('/students/new');
  }
  const student = await Student.create({ fullName, email, department, contactNumber });
  req.session.studentId = String(student._id);
  req.session.studentName = student.fullName;
  req.flash('success', 'Your student profile has been created and selected.');
  res.redirect(`/students/${student._id}`);
}));
app.get('/students/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return notFound(res, 'That student ID is not valid.');
  const student = await Student.findById(req.params.id);
  if (!student) return notFound(res, 'Student profile not found.');
  const [lostItems, foundItems] = await Promise.all([
    LostItem.find({ reportedBy: student._id }).sort({ createdAt: -1 }),
    FoundItem.find({ reportedBy: student._id }).sort({ createdAt: -1 })
  ]);
  res.render('student-details', { title: student.fullName, student, lostItems, foundItems });
}));
app.post('/session/student', asyncRoute(async (req, res) => {
  const id = clean(req.body.studentId);
  if (!validId(id)) {
    req.flash('error', 'Choose a valid student profile.');
    return res.redirect('/students/new');
  }
  const student = await Student.findById(id);
  if (!student) return notFound(res, 'Student profile not found.');
  req.session.studentId = String(student._id);
  req.session.studentName = student.fullName;
  req.flash('success', `You are now acting as ${student.fullName}.`);
  res.redirect('/');
}));
app.post('/session/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});
app.get('/students', asyncRoute(async (req, res) => {
  const students = await Student.find().sort({ fullName: 1 });
  res.render('students', { title: 'Student directory', students });
}));

// Lost item reports
app.get('/lost-items', asyncRoute(async (req, res) => {
  const filter = {};
  const q = clean(req.query.q);
  const category = clean(req.query.category);
  if (q) filter.$or = [
    { itemName: { $regex: escapeRegex(q), $options: 'i' } },
    { lastSeenLocation: { $regex: escapeRegex(q), $options: 'i' } },
    { description: { $regex: escapeRegex(q), $options: 'i' } }
  ];
  if (category && CATEGORIES.includes(category)) filter.category = category;
  const items = await LostItem.find(filter).populate('reportedBy', 'fullName department').sort({ createdAt: -1 });
  res.render('lost-items', { title: 'Lost items', items, q, selectedCategory: category });
}));
app.get('/lost-items/new', requireStudent, (req, res) => res.render('lost-item-form', { title: 'Report lost item' }));
app.post('/lost-items', requireStudent, asyncRoute(async (req, res) => {
  const { itemName, category, description, lastSeenLocation, dateLost } = req.body;
  if (![itemName, category, description, lastSeenLocation, dateLost].every(v => clean(v))) {
    req.flash('error', 'Please complete every field.');
    return res.redirect('/lost-items/new');
  }
  if (!CATEGORIES.includes(category) || new Date(dateLost) > new Date()) {
    req.flash('error', 'Choose a valid category and date.');
    return res.redirect('/lost-items/new');
  }
  const item = await LostItem.create({
    itemName: clean(itemName), category, description: clean(description),
    lastSeenLocation: clean(lastSeenLocation), dateLost, reportedBy: req.session.studentId
  });
  req.flash('success', 'Lost item report submitted.');
  res.redirect(`/lost-items/${item._id}`);
}));
app.get('/lost-items/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return notFound(res, 'That lost-item ID is not valid.');
  const item = await LostItem.findById(req.params.id).populate('reportedBy', 'fullName department email contactNumber');
  if (!item) return notFound(res, 'Lost-item report not found.');
  res.render('lost-item-details', { title: item.itemName, item });
}));

// Found item reports and claims
app.get('/found-items', asyncRoute(async (req, res) => {
  const filter = {};
  const q = clean(req.query.q);
  const category = clean(req.query.category);
  const status = clean(req.query.status);
  if (q) filter.$or = [
    { itemName: { $regex: escapeRegex(q), $options: 'i' } },
    { foundLocation: { $regex: escapeRegex(q), $options: 'i' } },
    { description: { $regex: escapeRegex(q), $options: 'i' } }
  ];
  if (category && CATEGORIES.includes(category)) filter.category = category;
  if (['Available', 'Returned'].includes(status)) filter.status = status;
  const items = await FoundItem.find(filter).populate('reportedBy', 'fullName department').sort({ createdAt: -1 });
  res.render('found-items', { title: 'Found items', items, q, selectedCategory: category, selectedStatus: status });
}));
app.get('/found-items/new', requireStudent, (req, res) => res.render('found-item-form', { title: 'Report found item' }));
app.post('/found-items', requireStudent, asyncRoute(async (req, res) => {
  const { itemName, category, description, foundLocation, dateFound } = req.body;
  if (![itemName, category, description, foundLocation, dateFound].every(v => clean(v))) {
    req.flash('error', 'Please complete every field.');
    return res.redirect('/found-items/new');
  }
  if (!CATEGORIES.includes(category) || new Date(dateFound) > new Date()) {
    req.flash('error', 'Choose a valid category and date.');
    return res.redirect('/found-items/new');
  }
  const item = await FoundItem.create({
    itemName: clean(itemName), category, description: clean(description),
    foundLocation: clean(foundLocation), dateFound, reportedBy: req.session.studentId
  });
  req.flash('success', 'Found item report submitted.');
  res.redirect(`/found-items/${item._id}`);
}));
app.get('/found-items/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return notFound(res, 'That found-item ID is not valid.');
  const item = await FoundItem.findById(req.params.id).populate('reportedBy', 'fullName department');
  if (!item) return notFound(res, 'Found-item report not found.');
  const claims = await Claim.find({ foundItemId: item._id }).populate('claimedBy', 'fullName department email').sort({ createdAt: -1 });
  res.render('found-item-details', { title: item.itemName, item, claims, isReporter: String(item.reportedBy._id) === String(req.session.studentId) });
}));
app.post('/found-items/:id/claims', requireStudent, asyncRoute(async (req, res) => {
  const id = req.params.id;
  if (!validId(id)) return notFound(res, 'That found-item ID is not valid.');
  const item = await FoundItem.findById(id);
  if (!item) return notFound(res, 'Found item not found.');
  if (item.status === 'Returned') {
    req.flash('error', 'This item has already been returned and cannot be claimed.');
    return res.redirect(`/found-items/${id}`);
  }
  if (String(item.reportedBy) === String(req.session.studentId)) {
    req.flash('error', 'You cannot claim an item you reported finding.');
    return res.redirect(`/found-items/${id}`);
  }
  const reason = clean(req.body.reason);
  if (reason.length < 10) {
    req.flash('error', 'Please provide a claim reason of at least 10 characters.');
    return res.redirect(`/found-items/${id}`);
  }
  try {
    await Claim.create({ foundItemId: item._id, claimedBy: req.session.studentId, reason, status: 'Pending' });
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'You have already submitted a claim for this item.');
      return res.redirect(`/found-items/${id}`);
    }
    throw err;
  }
  req.flash('success', 'Claim submitted. Its status is now Pending.');
  res.redirect(`/found-items/${id}`);
}));
app.patch('/claims/:id/status', requireStudent, asyncRoute(async (req, res) => {
  const claimId = req.params.id;
  if (!validId(claimId)) return notFound(res, 'That claim ID is not valid.');
  const nextStatus = clean(req.body.status);
  if (!['Approved', 'Rejected'].includes(nextStatus)) {
    req.flash('error', 'Status must be Approved or Rejected.');
    return res.redirect('back');
  }
  const claim = await Claim.findById(claimId);
  if (!claim) return notFound(res, 'Claim not found.');
  const item = await FoundItem.findById(claim.foundItemId);
  if (!item) return notFound(res, 'The found item linked to this claim no longer exists.');
  if (String(item.reportedBy) !== String(req.session.studentId)) {
    return res.status(403).render('error', { title: 'Forbidden', message: 'Only the student who reported finding this item can review its claims.' });
  }
  if (item.status === 'Returned') {
    req.flash('error', 'This item has already been returned.');
    return res.redirect(`/found-items/${item._id}`);
  }
  if (claim.status !== 'Pending') {
    req.flash('error', 'Only pending claims can be reviewed.');
    return res.redirect(`/found-items/${item._id}`);
  }
  if (nextStatus === 'Approved') {
    // Conditional update protects against approving a claim after another request returned the item.
    const updatedItem = await FoundItem.findOneAndUpdate(
      { _id: item._id, status: 'Available' },
      { $set: { status: 'Returned' } },
      { new: true }
    );
    if (!updatedItem) {
      req.flash('error', 'This item has already been returned.');
      return res.redirect(`/found-items/${item._id}`);
    }
    claim.status = 'Approved';
    await claim.save();
    await Claim.updateMany(
      { foundItemId: item._id, _id: { $ne: claim._id }, status: 'Pending' },
      { $set: { status: 'Rejected' } }
    );
    req.flash('success', 'Claim approved and item marked as Returned. Other pending claims were rejected.');
  } else {
    claim.status = 'Rejected';
    await claim.save();
    req.flash('success', 'Claim rejected.');
  }
  res.redirect(`/found-items/${item._id}`);
}));
app.patch('/found-items/:id/status', requireStudent, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return notFound(res, 'That found-item ID is not valid.');
  const item = await FoundItem.findById(req.params.id);
  if (!item) return notFound(res, 'Found item not found.');
  if (String(item.reportedBy) !== String(req.session.studentId)) {
    return res.status(403).render('error', { title: 'Forbidden', message: 'Only the reporter can change this item status.' });
  }
  const status = clean(req.body.status);
  if (status !== 'Available') {
    req.flash('error', 'The item can only be marked Returned by approving a claim.');
    return res.redirect(`/found-items/${item._id}`);
  }
  item.status = 'Available';
  await item.save();
  req.flash('success', 'Item marked Available.');
  res.redirect(`/found-items/${item._id}`);
}));

app.get('/health', (req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use((req, res) => notFound(res, 'The page you requested does not exist.'));
app.use((err, req, res, next) => {
  console.error(err);
  if (err && err.code === 11000) {
    req.flash('error', 'That email or claim already exists.');
    return res.redirect('back');
  }
  if (err && err.name === 'ValidationError') {
    req.flash('error', Object.values(err.errors).map(e => e.message).join(' '));
    return res.redirect('back');
  }
  if (err && err.name === 'CastError') return notFound(res, 'The requested ID is invalid.');
  res.status(500).render('error', {
    title: 'Something went wrong',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred. Please try again.' : (err.message || 'Unexpected server error.')
  });
});

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_lost_found')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Campus Lost & Found running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

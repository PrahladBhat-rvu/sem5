const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin:admin@cluster0.sksj0dl.mongodb.net/?appName=Cluster0')
    .then(() => {
        console.log('Connect to MongoDB');
    }).catch((err) => {
            console.log(err);
    })

    app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 at http://localhost:3000');
});
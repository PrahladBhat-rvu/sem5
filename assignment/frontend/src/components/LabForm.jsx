import { useState } from "react";

export default function LabForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "BCA"
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="demo-card">
      <h3>Controlled React Form</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Course
          <select name="course" value={form.course} onChange={handleChange}>
            <option>BCA</option>
            <option>BSc</option>
            <option>BTech</option>
          </select>
        </label>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <p className="success">
          Form submitted for {form.name}, {form.course}.
        </p>
      )}
    </div>
  );
}

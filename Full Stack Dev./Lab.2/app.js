function App() {
  const showMsg = () => {
    alert("Thanks for visiting my resume!");
  };

  return (
    <main className="resume">
      <section className="resume-header">
        <h1>Your Name</h1>
        <p className="role">Frontend Developer</p>
        <p className="contact">
          your.email@example.com | +91 98765 43210 | Bengaluru, India
        </p>
      </section>

      <section>
        <h2>Profile</h2>
        <p>
          Motivated web developer with a strong foundation in HTML, CSS,
          JavaScript, and React. Passionate about building clean, responsive,
          and user-friendly web applications.
        </p>
      </section>

      <section>
        <h2>Skills</h2>
        <ul className="skills">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
          <li>Git</li>
        </ul>
      </section>

      <section>
        <h2>Projects</h2>
        <article>
          <h3>Portfolio Website</h3>
          <p>
            Built a responsive personal portfolio to showcase projects,
            technical skills, and contact information.
          </p>
        </article>
        <article>
          <h3>Resume Web Page</h3>
          <p>
            Created a structured resume page using React components and custom
            CSS styling.
          </p>
        </article>
      </section>

      <section>
        <h2>Education</h2>
        <p>
          <strong>Bachelor of Computer Applications</strong>
          <br />
          Your College Name, 2024 - 2027
        </p>
      </section>

      <button type="button" onClick={showMsg}>
        Contact Me
      </button>
    </main>
  );
}

export default App;

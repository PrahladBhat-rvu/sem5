import { useEffect, useState } from "react";
import Section from "./components/Section";
import UserCard from "./components/UserCard";
import Counter from "./components/Counter";
import LabForm from "./components/LabForm";

const API = "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          mode === "all" ? API : `${API}/${mode}`
        );

        if (!response.ok) {
          throw new Error("Could not load users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [mode]);

  function handleNameSubmit(event) {
    event.preventDefault();

    if (name.trim()) {
      setMessage(`Hello, ${name.trim()}!`);
      setName("");
    }
  }

  const total = users.length;
  const ids = users.map((user) => user.id);
  const idSum = ids.reduce((sum, id) => sum + id, 0);

  return (
    <>
      <section id="home" className="hero">
        <div>
          <p className="eyebrow">FULL STACK DEVELOPMENT</p>
          <h1>Frontend Lab Collection</h1>
          <p className="hero-text">
            HTML, CSS, JavaScript and React work combined into one runnable
            application.
          </p>
        </div>
      </section>

      <div className="container">
        <Section id="html" title="HTML Structure & Semantic HTML">
          <div className="content-grid">
            <article className="demo-card">
              <h3>Semantic Structure</h3>
              <p>
                This application uses header, nav, main, section, article and
                footer elements.
              </p>
              <ul>
                <li>Semantic HTML</li>
                <li>Accessible labels</li>
                <li>Lists and tables</li>
              </ul>
            </article>

            <article className="demo-card">
              <h3>Lists & Tables</h3>
              <table>
                <thead>
                  <tr>
                    <th>Concept</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>HTML</td><td>Complete</td></tr>
                  <tr><td>CSS</td><td>Complete</td></tr>
                  <tr><td>JavaScript</td><td>Complete</td></tr>
                  <tr><td>React</td><td>Complete</td></tr>
                </tbody>
              </table>
            </article>
          </div>
        </Section>

        <Section id="css" title="CSS Fundamentals, Box Model, Flexbox & Grid">
          <div className="flex-demo">
            <div className="box">Flex item 1</div>
            <div className="box">Flex item 2</div>
            <div className="box">Flex item 3</div>
          </div>

          <div className="grid-demo">
            <div>Grid 1</div>
            <div>Grid 2</div>
            <div>Grid 3</div>
            <div>Grid 4</div>
          </div>
        </Section>

        <Section id="javascript" title="JavaScript Variables, Operators, Functions & DOM">
          <div className="content-grid">
            <div className="demo-card">
              <h3>Variables & Operators</h3>
              <p>Total users: {total}</p>
              <p>Sum of visible IDs: {idSum}</p>
              <p>Users × 2: {total * 2}</p>
            </div>

            <div className="demo-card">
              <h3>DOM/Event Interaction</h3>
              <form onSubmit={handleNameSubmit} className="inline-form">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                />
                <button type="submit">Say hello</button>
              </form>

              {message && <p className="success">{message}</p>}
            </div>
          </div>
        </Section>

        <Section id="react" title="React Components, Props, State, Events & Hooks">
          <div className="content-grid">
            <Counter />
            <LabForm />
          </div>

          <div className="demo-card">
            <div className="section-heading compact">
              <span className="section-number">API</span>
              <h3>User Data Routes</h3>
            </div>

            <div className="button-row">
              <button onClick={() => setMode("all")}>All Users</button>
              <button onClick={() => setMode("even")}>Even IDs</button>
              <button onClick={() => setMode("odd")}>Odd IDs</button>
            </div>

            {loading && <p>Loading users...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
              <>
                {users.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  <div className="user-grid">
                    {users.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="demo-card conditional-card">
            <h3>Conditional Rendering</h3>
            {users.length > 0 ? (
              <p>
                Showing <strong>{mode}</strong> users.
              </p>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </Section>
      </div>
    </>
  );
}

export default App;

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usernameRegex.test(username)) {
      toast.error(
        "Username must be 3-15 characters and contain only letters and numbers."
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and contain a letter and a number."
      );
      return;
    }

    setSubmittedUsername(username);
    toast.success("Login successful!");
  };

  return (
    <div className="container">
      <h2>Login Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      {submittedUsername && (
        <h3>Your username is: {submittedUsername}</h3>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';

function Header({ setPage }) {
  return (
    <header className="header">
      <div className="header-logo">
        TaskList
      </div>

      <nav>
        <button onClick={() => setPage('tasks')}>
          Task List
        </button>

        <button onClick={() => setPage('learned')}>
          What I Learnt
        </button>
      </nav>
    </header>
  );
}

function TaskList({ setPage }) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  function addTask() {
    if (task.trim() === '') {
      setError('Please enter a task.');
      return;
    }

    const newTask = {
      text: task.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  function handleInputChange(e) {
    setTask(e.target.value);

    if (e.target.value.trim() !== '') {
      setError('');
    }
  }

  function toggleTask(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed =
      !updatedTasks[index].completed;

    setTasks(updatedTasks);
  }

  function removeTask(index) {
    const updatedTasks = tasks.filter(
      (_, taskIndex) => taskIndex !== index
    );

    setTasks(updatedTasks);
  }

  return (
    <div className="page">
      <Header setPage={setPage} />

      <main className="task-container">
        <h1>Task List</h1>

        <div className="task-input">
          <input
            type="text"
            placeholder="Add a task"
            value={task}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <button onClick={addTask}>
            Add
          </button>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="task-list">
          {tasks.map((item, index) => (
            <div
              className={`task-item ${
                item.completed ? 'completed' : ''
              }`}
              key={index}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTask(index)}
              />

              <span>{item.text}</span>

              <button
                className="remove-button"
                onClick={() => removeTask(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function WhatILearnt({ setPage }) {
  return (
    <div className="page">
      <Header setPage={setPage} />

      <main className="learning-container">
        <h1>What I Learnt</h1>

        <p className="intro">
          Key things I learned from the IBM Web Development
          Fundamentals course.
        </p>

        <section className="learning-section">
          <h2>1. Web Development Basics</h2>

          <ul>
            <li>Learned what web development is and how websites work.</li>
            <li>Learned the difference between frontend and backend development.</li>
            <li>Learned about web browsers, servers, and websites.</li>
            <li>Learned the basic technologies used to build websites.</li>
            <li>Learned how HTML, CSS, and JavaScript work together.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>2. Developing Sites for the Web</h2>

          <ul>
            <li>Learned how websites are planned before development.</li>
            <li>Learned how wireframes help plan a webpage layout.</li>
            <li>Learned about different types of websites.</li>
            <li>Learned about responsive web design.</li>
            <li>Learned why websites should work on different screen sizes.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>3. Introduction to HTML and CSS</h2>

          <ul>
            <li>Learned how HTML provides structure to a webpage.</li>
            <li>Learned how to use HTML elements and attributes.</li>
            <li>Learned how CSS is used to style webpages.</li>
            <li>Learned about colors, fonts, spacing, borders, and layouts.</li>
            <li>Learned how CSS media queries help with responsive design.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>4. Bringing Websites to Life with JavaScript</h2>

          <ul>
            <li>Learned how JavaScript adds interactivity to webpages.</li>
            <li>Learned about variables and different types of values.</li>
            <li>Learned how functions are used to perform actions.</li>
            <li>Learned about conditions and comparison operators.</li>
            <li>Learned how JavaScript can respond to user actions.</li>
            <li>Learned how JavaScript can change webpage content.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>5. Website Testing and Deployment</h2>

          <ul>
            <li>Learned why websites need to be tested before release.</li>
            <li>Learned how to check websites for errors.</li>
            <li>Learned about testing websites on different devices.</li>
            <li>Learned why websites should work correctly on different browsers.</li>
            <li>Learned the basic idea of deploying a website online.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>6. Develop an Interactive Task List Web Page</h2>

          <ul>
            <li>Learned how to create a task list interface.</li>
            <li>Learned how users can enter and add tasks.</li>
            <li>Learned how to use the Enter key for adding tasks.</li>
            <li>Learned how users can mark tasks as complete.</li>
            <li>Learned how completed tasks can have visual confirmation.</li>
            <li>Learned how to display an error when no task is entered.</li>
            <li>Learned how to make a webpage work on desktop and mobile.</li>
          </ul>
        </section>

        <section className="learning-section">
          <h2>7. Your Future in Web Development</h2>

          <ul>
            <li>Learned about different career options in web development.</li>
            <li>Learned about the skills needed for web development jobs.</li>
            <li>Learned why practical projects are important for a portfolio.</li>
            <li>Learned about the importance of continuously improving technical skills.</li>
            <li>Learned how web development skills can be used in different industries.</li>
          </ul>
        </section>

        <button
          className="back-button"
          onClick={() => setPage('tasks')}
        >
          Back to Task List
        </button>
      </main>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('tasks');

  return (
    <>
      {page === 'tasks' ? (
        <TaskList setPage={setPage} />
      ) : (
        <WhatILearnt setPage={setPage} />
      )}
    </>
  );
}

export default App;
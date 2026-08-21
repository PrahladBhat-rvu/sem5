import React, { useState } from "react";

function Signup({ onSignup }) {
  const [formdata, setFormdata] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
  });

  const [sharedata, setSharedata] = useState(false);

  const handlechange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    onSignup();
  };

  return (
    <div className="signup-page">
      <div className="signup-image">
        <img src="/images/signup.jpg" alt="dj performing" />

        <div className="signup-image-overlay">
          <h1>
            Discover new things on
            <br />
            Superapp
          </h1>
        </div>
      </div>

      <div className="signup-panel">
        <div className="signup-content">
          <h1>Super app</h1>

          <p className="signup-subtitle">Create your new account</p>

          <form onSubmit={handlesubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formdata.name}
              onChange={handlechange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="UserName"
              value={formdata.username}
              onChange={handlechange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formdata.email}
              onChange={handlechange}
              required
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formdata.mobile}
              onChange={handlechange}
              required
            />

            <label className="signup-checkbox">
              <input
                type="checkbox"
                checked={sharedata}
                onChange={(e) => setSharedata(e.target.checked)}
              />

              <span>Share my registration data with Superapp</span>
            </label>

            <button type="submit" className="signup-button">
              SIGN UP
            </button>
          </form>

          <p className="signup-terms">
            By clicking on Sign up, you agree to Superapp{" "}
            <span>Terms and Conditions of Use</span>
          </p>

          <p className="signup-privacy">
            To learn more about how Superapp collects, uses, shares and
            protects your personal data please head Superapp{" "}
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
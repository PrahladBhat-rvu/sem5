import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");

  const [submittedName, setSubmittedName] = useState("JANE APPLESEED");
  const [submittedNumber, setSubmittedNumber] = useState("0000 0000 0000 0000");
  const [submittedMonth, setSubmittedMonth] = useState("00");
  const [submittedYear, setSubmittedYear] = useState("00");

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Maximum 16 digits
    value = value.substring(0, 16);

    // Add a space after every 4 digits
    value = value.replace(/(.{4})/g, "$1 ").trim();

    setNumber(value);
  };

  const handleMonth = (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 2);

    // Prevent months above 12
    if (value.length === 2) {
      const monthNumber = parseInt(value, 10);

      if (monthNumber > 12) {
        value = "12";
      }

      if (monthNumber === 0) {
        value = "01";
      }
    }

    setMonth(value);
  };

  const handleYear = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 2);
    setYear(value);
  };

  const handleCvc = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvc(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmittedName(name || "JANE APPLESEED");
    setSubmittedNumber(number || "0000 0000 0000 0000");
    setSubmittedMonth(month || "00");
    setSubmittedYear(year || "00");
  };

  return (
    <div className="app">
      <div className="container">

        {/* CARD */}
        <div className="card-section">
          <div className="card">

            <div className="card-top">
              <div className="chip"></div>
              <div className="contactless">◦</div>
            </div>

            <div className="card-number">
              {submittedNumber}
            </div>

            <div className="card-bottom">

              <div>
                <span>CARDHOLDER NAME</span>
                <p>{submittedName}</p>
              </div>

              <div>
                <span>EXPIRES</span>
                <p>
                  {submittedMonth}/{submittedYear}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* FORM */}
        <form className="form" onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="input-group">
            <label>Cardholder Name</label>

            <input
              type="text"
              placeholder="e.g. Jane Appleseed"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* CARD NUMBER */}
          <div className="input-group">
            <label>Card Number</label>

            <input
              type="text"
              placeholder="e.g. 1234 5678 9123 0000"
              value={number}
              maxLength={19}
              inputMode="numeric"
              onChange={handleCardNumber}
            />
          </div>

          {/* EXPIRY + CVC */}
          <div className="row">

            <div className="input-group">
              <label>Exp. Date (MM/YY)</label>

              <div className="expiry">

                <input
                  type="text"
                  placeholder="MM"
                  value={month}
                  maxLength={2}
                  inputMode="numeric"
                  onChange={handleMonth}
                />

                <input
                  type="text"
                  placeholder="YY"
                  value={year}
                  maxLength={2}
                  inputMode="numeric"
                  onChange={handleYear}
                />

              </div>
            </div>

            <div className="input-group">
              <label>CVC</label>

              <input
                type="text"
                placeholder="e.g. 123"
                value={cvc}
                maxLength={3}
                inputMode="numeric"
                onChange={handleCvc}
              />
            </div>

          </div>

          {/* SUBMIT */}
          <button type="submit">
            Confirm
          </button>

        </form>

      </div>
    </div>
  );
}

export default App;
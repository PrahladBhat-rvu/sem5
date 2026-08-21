import React, { useState } from "react";
import Signup from "./pages/signup";
import Categories from "./pages/categories";
import "./app.css";

function App() {
  const [page, setPage] = useState("signup");
  const [selectedcategories, setSelectedcategories] = useState([]);

  const handlesignup = () => {
    setPage("categories");
  };

  const handlecategories = (categories) => {
    setSelectedcategories(categories);
    setPage("profile");
  };

  return (
    <>
      {page === "signup" && <Signup onSignup={handlesignup} />}

      {page === "categories" && (
        <Categories
          selectedcategories={selectedcategories}
          onNext={handlecategories}
          onBack={() => setPage("signup")}
        />
      )}

      {page === "profile" && (
        <div style={{ color: "white", padding: "40px" }}>
          Page 3 coming next...
        </div>
      )}
    </>
  );
}

export default App;
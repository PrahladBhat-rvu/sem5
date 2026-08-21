import React, { useState } from "react";
import categories from "../data/categories";

function Categories({ selectedcategories, onNext, onBack }) {
  const [selected, setSelected] = useState(selectedcategories);

  const togglecategory = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  const handlenext = () => {
    if (selected.length >= 3) {
      onNext(selected);
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-left">
        <h2>Super app</h2>

        <h1>
          Choose your
          <br />
          entertainment
          <br />
          category
        </h1>

        <div className="selected-list">
          {selected.map((category) => (
            <div className="selected-tag" key={category}>
              <span>{category}</span>

              <button
                type="button"
                onClick={() => togglecategory(category)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {selected.length < 3 && (
          <div className="category-error">
            <span>⚠</span>
            <span>Minimum 3 category required</span>
          </div>
        )}
      </div>

      <div className="categories-right">
        <button
          type="button"
          className="category-back"
          onClick={onBack}
        >
          Go Back
        </button>

        <div className="category-grid">
          {categories.map((category) => {
            const isselected = selected.includes(category.name);

            return (
              <button
                type="button"
                className={`category-card ${
                  isselected ? "category-selected" : ""
                }`}
                key={category.name}
                style={{ backgroundColor: category.color }}
                onClick={() => togglecategory(category.name)}
              >
                <span className="category-name">
                  {category.name}
                </span>

                <img
                  src={category.image}
                  alt={category.name}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`category-next ${
            selected.length < 3
              ? "category-next-disabled"
              : ""
          }`}
          onClick={handlenext}
          disabled={selected.length < 3}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default Categories;
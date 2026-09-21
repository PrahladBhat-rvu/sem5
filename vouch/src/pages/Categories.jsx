import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const categories = [
  {
    title: "Movies",
    description: "Find out what people think before you watch.",
    items: [
      ["Action", "/category/movies/action"],
      ["Adventure", "/category/movies/adventure"],
      ["Comedy", "/category/movies/comedy"],
      ["Drama", "/category/movies/drama"],
      ["Horror", "/category/movies/horror"],
      ["Sci-Fi", "/category/movies/sci-fi"],
      ["Thriller", "/category/movies/thriller"],
      ["Romance", "/category/movies/romance"],
    ],
  },

  {
    title: "Products",
    description: "Reviews for things you're thinking about buying.",
    items: [
      ["Technology", "/category/products/technology"],
      ["Fashion", "/category/products/fashion"],
      ["Beauty", "/category/products/beauty"],
      ["Home", "/category/products/home"],
      ["Fitness", "/category/products/fitness"],
    ],
  },

  {
    title: "Games",
    description: "See what gamers have to say.",
    items: [
      ["PC", "/category/games/pc"],
      ["PlayStation", "/category/games/playstation"],
      ["Xbox", "/category/games/xbox"],
      ["Nintendo", "/category/games/nintendo"],
      ["Mobile", "/category/games/mobile"],
    ],
  },

  {
    title: "Books",
    description: "Discover your next read through real opinions.",
    items: [
      ["Fiction", "/category/books/fiction"],
      ["Non-fiction", "/category/books/non-fiction"],
      ["Mystery", "/category/books/mystery"],
      ["Fantasy", "/category/books/fantasy"],
      ["Sci-Fi", "/category/books/sci-fi"],
    ],
  },
];

function Categories() {
  return (
    <div className="site">
      <Navbar />

      <main className="categories-page">

        <section className="categories-hero">
          <p className="eyebrow">EXPLORE VOUCH</p>

          <h1>
            Find your
            <br />
            <em>category.</em>
          </h1>

          <p className="categories-description">
            Explore reviews across movies, products, games,
            books, and everything else worth having an opinion about.
          </p>
        </section>

        <section className="categories-list">

          {categories.map((category, index) => (
            <div
              className="category-section"
              key={category.title}
            >

              <div className="category-number">
                0{index + 1}
              </div>

              <div className="category-content">

                <div className="category-heading">
                  <h2>{category.title}</h2>

                  <p>
                    {category.description}
                  </p>
                </div>

                <div className="subcategory-grid">

                  {category.items.map(([name, path]) => (
                    <Link
                      key={name}
                      to={path}
                      className="subcategory"
                    >
                      <span>{name}</span>

                      <span className="subcategory-arrow">
                        ↗
                      </span>
                    </Link>
                  ))}

                </div>

              </div>
            </div>
          ))}

        </section>
      </main>
    </div>
  );
}

export default Categories;
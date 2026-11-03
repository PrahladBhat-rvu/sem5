import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import "./mobile.css";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import NewReleases from "./pages/NewReleases";
import About from "./pages/About";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import WriteReview from "./pages/WriteReview";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AuthModal from "./components/AuthModal";
import KongBackground from "./components/KongBackground";
import MobileBottomNav from "./components/MobileBottomNav";
import { AuthModalProvider } from "./context/AuthModalContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthModalProvider>
          <ScrollToTop />
          <KongBackground />
          <AuthModal />
          <MobileBottomNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/new-releases" element={<NewReleases />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:idOrSlug" element={<Product />} />
            <Route path="/tvshow/:idOrSlug" element={<Product />} />
            <Route path="/tv/:idOrSlug" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
            <Route path="/signup" element={<Navigate to="/?auth=signup" replace />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:category/:subcategory" element={<Category />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthModalProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

import {
  ShoppingBasket,
  ShoppingCart,
  Menu,
  X,
  Search as SearchIcon,
  User as UserIconSvg,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";
import logo from "/images/logo.svg";
import { useGetCategoriesTreeQuery, useGetProductsQuery } from "../redux/queries/productApi";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

function Header({ onSearch }) {
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noProductFound, setNoProductFound] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  const { data: products = [] } = useGetProductsQuery();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();

  const menuRef = useRef();
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleClick = () => setClicked(!clicked);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClicked(false);
        setExpandedCategoryId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (clicked) document.body.classList.add("no-scroll");
    else {
      document.body.classList.remove("no-scroll");
      setNoProductFound(false);
      setExpandedCategoryId(null);
    }
  }, [clicked]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setNoProductFound(false);
    if (onSearch) onSearch(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const matchedProduct = products.find(
        (product) => product.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (matchedProduct) {
        navigate(`/products/${matchedProduct._id}`);
        setClicked(false);
        setNoProductFound(false);
      } else setNoProductFound(true);
    }
  };

  return (
    <>
      {storeStatus?.[0]?.banner?.trim() && (
        <div className="bg-black text-white text-center py-2 px-4 text-sm lg:text-base font-semibold break-words">
          {storeStatus[0].banner}
        </div>
      )}

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center w-[20%]">
              <Link to="/">
                <img src={logo} alt="logo" className="h-10" />
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-6 w-[40%] justify-center relative">
              <Link to="/" className="text-sm font-medium hover:text-rose-600">
                Home
              </Link>

              {/* Category mega menu */}
              <div className="relative">
                <button
                  onClick={() => setExpandedCategoryId((prev) => (prev === "all" ? null : "all"))}
                  className="text-sm font-medium cursor-pointer hover:text-rose-600 flex items-center space-x-1">
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      expandedCategoryId === "all" ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedCategoryId === "all" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-3 left-0 w-[700px] bg-white shadow-2xl rounded-lg border border-gray-200 p-6 grid grid-cols-3 gap-6 z-20">
                      {categoryTree?.map((cat) => (
                        <div key={cat._id}>
                          <Link
                            to={`/category/${cat.name}`}
                            onClick={() => setExpandedCategoryId(null)}
                            className="block font-semibold text-gray-800 hover:text-rose-600">
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </Link>

                          {cat.children?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {cat.children.map((subcat) => (
                                <li key={subcat._id}>
                                  <Link
                                    to={`/category/${subcat.name}`}
                                    onClick={() => setExpandedCategoryId(null)}
                                    className="text-sm text-gray-600 hover:text-rose-500">
                                    {subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={clsx(
                  "text-sm font-medium hover:text-rose-600",
                  pathname === "/about" && "text-rose-600"
                )}>
                About
              </Link>
              <Link
                to="/contact"
                className={clsx(
                  "text-sm font-medium hover:text-rose-600",
                  pathname === "/contact" && "text-rose-600"
                )}>
                Contact
              </Link>
            </nav>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 mx-4 flex-col relative">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchSubmit}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
                {noProductFound && (
                  <div className="absolute left-0 top-full mt-1 flex items-center space-x-2 p-2 bg-rose-100 border border-rose-300 rounded-md shadow-sm w-full z-10">
                    <AlertCircle className="text-rose-600 w-5 h-5" />
                    <span className="text-rose-700 font-semibold text-sm">No product found</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop user & cart */}
            <div className="hidden md:flex items-center space-x-6 justify-end">
              {userInfo ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600">
                  <UserIconSvg className="h-5 w-5" />
                  {userInfo?.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-zinc-900 px-3 py-2 hover:opacity-80 text-white rounded-lg">
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                className="relative flex items-center text-black hover:text-rose-500">
                <ShoppingCart strokeWidth={2} size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-base rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile user & cart (next to hamburger) */}
            <div className="flex items-center space-x-3 md:hidden">
              {userInfo ? (
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-rose-600 flex items-center gap-1">
                  <UserIconSvg className="h-5 w-5" />
                  {userInfo.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-zinc-900 px-3 py-1.5 hover:opacity-80 text-white rounded-lg text-sm">
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                className="relative flex items-center text-black hover:text-rose-500">
                <ShoppingCart strokeWidth={2} size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-base rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile toggle (hamburger) */}
              <button
                onClick={handleClick}
                className="text-gray-700 hover:text-rose-600 p-2 rounded-md z-50 bg-white">
                {clicked ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile menu drawer */}
          <AnimatePresence>
            {clicked && (
              <motion.nav
                ref={menuRef}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gradient-to-tr from-zinc-900 to-zinc-700 fixed inset-0 z-40 text-zinc-50 py-24 px-6 text-lg flex flex-col gap-6">
                <Link
                  to="/"
                  onClick={() => setClicked(false)}
                  className={clsx(
                    "py-2 border-b border-rose-600",
                    pathname === "/" && "text-rose-400"
                  )}>
                  Home
                </Link>

                {/* Mobile Category accordion */}
                <div>
                  <button
                    onClick={() => setExpandedMobileCat((prev) => (prev === "all" ? null : "all"))}
                    className="flex items-center hover:text-rose-500 gap-2">
                    Categories
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMobileCat === "all" ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedMobileCat === "all" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 flex flex-col gap-2">
                        {categoryTree?.map((cat) => (
                          <div key={cat._id}>
                            <Link
                              to={`/category/${cat.name}`}
                              onClick={() => setClicked(false)}
                              className="block py-1 hover:text-rose-400">
                              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                            </Link>
                            {cat.children?.length > 0 && (
                              <ul className="pl-4 text-sm space-y-1">
                                {cat.children.map((subcat) => (
                                  <li key={subcat._id}>
                                    <Link
                                      to={`/category/${subcat.name}`}
                                      onClick={() => setClicked(false)}
                                      className="hover:text-rose-400">
                                      {subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/about"
                  onClick={() => setClicked(false)}
                  className="py-2 hover:text-rose-400">
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setClicked(false)}
                  className="py-2 hover:text-rose-400">
                  Contact
                </Link>

                {/* Search (mobile) */}
                <div className="relative mt-6 flex flex-col">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-zinc-900"
                  />
                </div>

                {/* Footer inside mobile menu */}
                <div className="mt-auto text-xs text-zinc-400 text-center">
                  <p>
                    Designed by <span className="font-bold">Webschema</span>
                  </p>
                  <p>&copy; {new Date().getFullYear()} IPSUM Store. All rights reserved.</p>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

export default Header;

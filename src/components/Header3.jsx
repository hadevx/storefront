import {
  ShoppingBasket,
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

  const { data: products = [] } = useGetProductsQuery();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();

  const menuRef = useRef();

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleClick = () => {
    setClicked(!clicked);
  };

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
    if (clicked) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
      setNoProductFound(false);
      setExpandedCategoryId(null);
    }
  }, [clicked]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setNoProductFound(false);
    if (onSearch) {
      onSearch(value);
    }
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
      } else {
        setNoProductFound(true);
      }
    }
  };

  const onCategorySelect = () => {
    setClicked(false);
    setExpandedCategoryId(null);
  };

  const toggleCategory = (id) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {storeStatus?.[0]?.banner?.trim() && (
        <div className="bg-black text-white text-center py-2 px-4 text-sm lg:text-base font-semibold">
          {storeStatus[0].banner}
        </div>
      )}

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center w-[20%]">
              <Link to="/">
                <img src={logo} alt="logo" className="h-10" />
              </Link>
            </div>

            {/* Desktop categories with clickable arrow to toggle submenu */}
            <nav className="hidden md:flex space-x-6 w-[40%] justify-center">
              {/* <button
                onClick={onCategorySelect}
                className={clsx("text-sm font-medium cursor-pointer hover:text-rose-600")}>
                All
              </button> */}
              {categoryTree?.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedCategoryId === cat._id;
                return (
                  <div key={cat._id} className="relative">
                    <button
                      onClick={() => toggleCategory(cat._id)}
                      className={clsx(
                        "text-sm font-medium cursor-pointer hover:text-rose-600 flex items-center space-x-1 bg-transparent border-none",
                        "focus:outline-none"
                      )}
                      type="button">
                      <Link
                        to={`/category/${cat.name}`}
                        className="whitespace-nowrap"
                        onClick={() => setClicked(false)}>
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                      </Link>
                      {hasChildren && (
                        <ChevronDown
                          size={14}
                          className={clsx(
                            "transition-transform duration-200",
                            isExpanded ? "rotate-180" : "rotate-0"
                          )}
                        />
                      )}
                    </button>

                    {hasChildren && isExpanded && (
                      <div className="absolute top-full mt-1 left-0 bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px] z-20">
                        {cat.children.map((subcat) => (
                          <Link
                            key={subcat._id}
                            to={`/category/${subcat.name}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 whitespace-nowrap"
                            onClick={() => {
                              setClicked(false);
                              setExpandedCategoryId(null);
                            }}>
                            {subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="hidden md:flex flex-1  mx-4 flex-col relative ">
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
                  <div className="absolute left-0 top-full mt-1 flex items-center space-x-2 p-2 bg-rose-100 border border-rose-300 rounded-md shadow-sm select-none w-full z-10">
                    <AlertCircle className="text-rose-600 w-5 h-5" />
                    <span className="text-rose-700 font-semibold text-sm">No product found</span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 w-[20%] justify-end">
              {userInfo ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors">
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
                className="relative flex items-center text-gray-700 hover:text-rose-600 transition-colors p-1 rounded-md"
                aria-label="Open cart">
                <ShoppingBasket strokeWidth={1} size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <button
              onClick={handleClick}
              className="md:hidden text-gray-700 hover:text-rose-600 p-2 rounded-md"
              aria-label={clicked ? "Close menu" : "Open menu"}>
              {clicked ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <AnimatePresence>
            {clicked && (
              <motion.nav
                ref={menuRef}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gradient-to-tr overflow-y-auto from-zinc-900 to-zinc-700 shadow-2xl inset-0 fixed z-40 text-zinc-50 font-semibold py-24 px-6 text-lg flex flex-col gap-6">
                <Link
                  to="/"
                  onClick={() => setClicked(false)}
                  className={clsx(
                    "py-2 border-b border-rose-600",
                    pathname === "/" && "text-rose-400"
                  )}>
                  Home
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setClicked(false)}
                  className={clsx(
                    "py-2 border-b border-transparent",
                    pathname === "/cart" && "text-rose-400 border-rose-600"
                  )}>
                  Cart ({cartCount})
                </Link>

                {categoryTree.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setClicked(false)}
                    className="text-left w-full py-2 hover:text-rose-400">
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </button>
                ))}

                <div className="relative mt-6 flex flex-col">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-zinc-900"
                  />
                  {noProductFound && (
                    <div className="absolute left-0 top-full mt-1 flex items-center space-x-2 p-2 bg-rose-100 border border-rose-300 rounded-md shadow-sm select-none w-full z-10">
                      <AlertCircle className="text-rose-600 w-5 h-5" />
                      <span className="text-rose-700 font-semibold text-sm">No product found</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 py-2 border-t border-zinc-600 hover:text-rose-400">
                  <UserIconSvg className="h-5 w-5" />
                  <span>{userInfo ? userInfo.name : "Account"}</span>
                </Link>

                <div className="mt-auto text-xs text-zinc-400 select-none text-center">
                  <p>
                    Designed by <Link className="font-bold font-mono">Webschema</Link>
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

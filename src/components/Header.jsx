import { ShoppingBasket, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import UserIcon from "./UserIcon";
import { setClicked } from "../redux/slices/clickSlice";
import { useGetProductsQuery } from "../redux/queries/productApi";
import clsx from "clsx";
import Footer from "./Footer";
import logo from "/images/logo.svg";

function Header() {
  const [clicked, setClicked] = useState(false);
  const { pathname } = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: products } = useGetProductsQuery();

  const handleClick = () => {
    setClicked(!clicked);
  };
  useEffect(() => {
    if (clicked) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [clicked]);

  const containerVariants = {
    hidden: {
      x: -10,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child's animation
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const categories = [...new Set(products?.map((p) => p.category))];

  return (
    <>
      <div className="flex justify-around  py-5 px-2 ">
        <div className="w-[60%] ">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-end ">
          <UserIcon userInfo={userInfo} />
          <div className="relative  w-[50px] cursor-pointer hover:bg-zinc-100 p-1 rounded-lg drop-shadow-lg transition-all delay-75 ">
            <Link to="/cart">
              <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
                <ShoppingBasket strokeWidth={1} size={40} />
              </motion.div>
              <motion.span
                animate={{ scale: [0.6, 1.1, 1] }}
                key={cartItems.reduce((a, c) => a + c.qty, 0)}
                className="absolute drop-shadow-lg top-0 right-0 text-md bg-gradient-to-r from-rose-500/80 to-rose-600  font-bold text-white px-2  rounded-[50%]">
                {Number(cartItems.reduce((a, c) => a + c.qty, 0))}
              </motion.span>
            </Link>
          </div>
          {!clicked ? (
            <motion.p
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer  z-20 hover:bg-zinc-100 p-1 rounded-lg drop-shadow-lg ">
              <Menu size={30} onClick={handleClick} />
            </motion.p>
          ) : (
            <motion.p className="cursor-pointer  z-50 bg-zinc-100 p-1 rounded-lg drop-shadow-lg ">
              <X size={30} onClick={handleClick} />
            </motion.p>
          )}

          <AnimatePresence>
            {clicked && (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -100 }}
                  variants={containerVariants}
                  className="bg-gradient-to-tr   from-zinc-900 to-zinc-700 shadow-2xl inset-0   lg:top-0 lg:left-auto lg:bottom-0 lg:right-0 text-zinc-50  font-semibold  py-32 text-3xl items-center lg:w-[500px] fixed   z-40 gap-10  flex flex-col">
                  <motion.div
                    variants={itemVariants}
                    className={clsx(
                      pathname === "/" &&
                        "border-b-2 py-1 hover:text-zinc-50/70 transition-all delay-75 ease-out border-rose-500 "
                    )}>
                    <Link to="/">Home</Link>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className={clsx(
                      "hover:text-zinc-50/70 transition-all delay-75 ease-out",
                      pathname === "/cart" && "border-b-2 py-1  border-rose-500 "
                    )}>
                    <Link to="/cart">
                      Cart{" "}
                      <span className="text-sm">({cartItems.reduce((a, c) => a + c.qty, 0)})</span>
                    </Link>
                  </motion.div>

                  {categories.map((category) => {
                    const encodedCategory = encodeURIComponent(category);
                    const categoryPath = `/category/${encodedCategory}`;
                    return (
                      <motion.div
                        variants={itemVariants}
                        className={clsx(
                          pathname === categoryPath && "border-b-2 py-1 border-rose-500 "
                        )}>
                        <Link to={categoryPath}>{category}</Link>
                      </motion.div>
                    );
                  })}
                  <div className="flex z-50 text-xs justify-center items-center   ">
                    <div className="flex text-gray-200 flex-col items-center">
                      <h1>IPSUM</h1>
                      <div className="text-gray-200 flex gap-2 items-center">
                        Designed by <Link className="font-bold font-mono">hkosaimi</Link>
                      </div>
                      <div className="text-gray-200 ">
                        &copy; {new Date().getFullYear()} IPSUM Store. All rights reserved.
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Header;

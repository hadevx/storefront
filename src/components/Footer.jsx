import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/tw.png";
import logo2 from "../assets/images/newlogo.png";
import { motion } from "framer-motion";
import { Tooltip } from "@medusajs/ui";

function Footer() {
  const containerVariant = {
    hidden: {
      opacity: 1,
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariant = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
  };
  return (
    <>
      <div
        initial="hidden"
        whileInView="animate"
        variants={containerVariant}
        className="flex  justify-center items-center pt-10 pb-10 bg-gradient-to-tr  from-zinc-900 to-zinc-700 border-t-2 p-2">
        <div className="flex text-gray-200 flex-col items-center">
          <motion.h1 variants={childVariant}>IPSUM</motion.h1>
          <motion.div variants={childVariant} className="text-gray-200 flex gap-2 items-center">
            Designed by{" "}
            <Link to="https://ws-opal-alpha.vercel.app/" className="font-bold flex gap-2 font-mono">
              <Tooltip content="@WebSchema" className="bg-white px-2 py-1 text-sm">
                <img src={logo2} alt="" className="w-5 " />
              </Tooltip>
            </Link>
          </motion.div>
          <motion.div variants={childVariant} className="text-gray-200 ">
            &copy; {new Date().getFullYear()} IPSUM Store. All rights reserved.
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Footer;

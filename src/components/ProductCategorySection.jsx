import React from "react";
import elec from "../assets/images/hero3.jpg";
import { ChevronRight } from "lucide-react";
import { useGetProductsQuery } from "../redux/queries/productApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCategorySection() {
  //API get products
  const { data: products, isLoading, error } = useGetProductsQuery();
  const categories = [
    ...new Set(
      products?.map(
        (product) => product?.category.charAt(0).toUpperCase() + product.category.slice(1)
      )
    ),
  ];
  const getImageForCategory = (category) => {
    const images = {
      Electronics: "/images/devices.jpg",
      Watches: "/images/watches.png",
      "Bags and Luggage": "/images/bags.jpg",
      Chairs: "/images/chairs.jpg",
      // Add more categories and their images as needed
    };

    return images[category] || "/images/default.png"; // Fallback image
  };

  // Create the `cat` array with `label` and `image`
  const cat = categories.map((category) => ({
    label: category,
    image: getImageForCategory(category),
  }));

  const containerVariants = {
    visible: {
      transition: {
        duration: 10,
        staggerChildren: 0.3, // Delay between each child's animation
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.section className="bg-gray-100/60 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {cat.map((category, index) => (
            <motion.div variants={itemVariants}>
              <Link
                to={`/category/${category.label}`}
                key={index}
                className="bg-white rounded-lg shadow-md h-72 overflow-hidden transition-transform transform hover:scale-105">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-700">{category.label}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

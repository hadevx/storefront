import Product from "../../components/Product";
import hero3 from "../../assets/images/hero3.jpg";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetProductsQuery,
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import ProductCategorySection from "../../components/ProductCategorySection";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loader from "../../components/Loader";

function Home() {
  //API get products
  /*   const { data: products, isLoading, error, refetch } = useGetProductsQuery();*/
  const { data: products, isLoading, error, refetch } = useGetLatestProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const prevStockRef = useRef([]);
  useEffect(() => {
    if (products) {
      // Extract the current stock levels
      const currentStock = products.map((p) => p.countInStock);
      // Extract the previous stock levels from the ref
      const prevStock = prevStockRef.current;

      // Check if stock levels have changed
      const stockChanged = currentStock.some((stock, index) => stock !== prevStock[index]);

      if (stockChanged) {
        refetch(); // Refetch data if stock levels have changed
      }

      // Update the ref with current stock levels for next comparison
      prevStockRef.current = currentStock;
    }
  }, [products, refetch]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2, // Delay between each child's animation
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Layout>
        <div className="h-[320px] px-0 lg:px-10 lg:h-[500px] xl:h-[800px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            className="relative shadow-2xl h-full bg-top lg:rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${hero3})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            {/* Dark gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

            {/* Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="relative z-10 flex flex-col items-center lg:items-start justify-center h-full px-6 lg:px-20">
              <motion.h1
                variants={itemVariants}
                className="text-2xl lg:text-5xl font-bold text-white text-center lg:text-left max-w-lg leading-tight drop-shadow-lg">
                The Best All-in-one store for you
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-3 lg:mt-5 text-sm lg:text-xl text-gray-200 text-center lg:text-left max-w-md">
                Everything you'll ever need
              </motion.p>

              <motion.div variants={itemVariants} whileTap={{ scale: 0.97 }}>
                <a
                  href="#products"
                  className="mt-5 inline-flex items-center gap-2 bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white px-5 py-3 lg:px-7 lg:py-4 text-sm lg:text-lg rounded-xl font-semibold shadow-lg transition-all duration-300">
                  Start Shopping <ShoppingBag className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div id="products" className=" lg:px-28 py-12">
          <h2 className="text-4xl font-semibold mb-10 text-gray-900">Latest Products</h2>
          {isLoading ? (
            <Loader />
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  lg:gap-8">
              {products?.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl  overflow-hidden">
                  <Product product={product} categoryTree={categoryTree} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <ProductCategorySection />
      </Layout>
    </>
  );
}

export default Home;

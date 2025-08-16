import { useRef, useEffect } from "react";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Product from "../../components/Product";
import ProductCategorySection from "../../components/ProductCategorySection";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import hero3 from "../../assets/images/hero3.jpg";

function Home() {
  const { data: products, isLoading, refetch } = useGetLatestProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const prevStockRef = useRef([]);
  useEffect(() => {
    if (products) {
      const currentStock = products.map((p) => p.countInStock);
      const prevStock = prevStockRef.current;
      const stockChanged = currentStock.some((stock, index) => stock !== prevStock[index]);
      if (stockChanged) refetch();
      prevStockRef.current = currentStock;
    }
  }, [products, refetch]);

  const containerVariants = { visible: { transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <Layout>
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
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

      {/* Products Section */}
      <div id="products" className="lg:px-28 py-12">
        <h2 className="text-4xl font-semibold mb-10 text-gray-900">Latest Products</h2>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products?.slice(0, 8).map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl overflow-hidden">
                  <Product product={product} categoryTree={categoryTree} />
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-10">
              <Link
                to="/all-products"
                className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition">
                Show All
              </Link>
            </div>
          </>
        )}
      </div>

      <ProductCategorySection />
    </Layout>
  );
}

export default Home;

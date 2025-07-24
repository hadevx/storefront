import Product from "../../components/Product";
import hero3 from "../../assets/images/hero3.jpg";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useGetProductsQuery, useGetLatestProductsQuery } from "../../redux/queries/productApi";
import ProductCategorySection from "../../components/ProductCategorySection";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function Home() {
  //API get products
  /*   const { data: products, isLoading, error, refetch } = useGetProductsQuery();*/
  const { data: products, isLoading, error, refetch } = useGetLatestProductsQuery();
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
        <div className=" h-[320px] px-0 lg:px-10  lg:h-[500px]  xl:h-[800px] ">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            className="relative shadow-2xl  h-full object-cover inset-0 bg-top lg:rounded-2xl overflow-hidden"
            style={{ backgroundImage: `url(${hero3})`, backgroundSize: "cover" }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="absolute flex lg:w-[700px] flex-col items-center justify-center gap-3 lg:gap-1 bg-gradient-to-r    left-0 top-0 bottom-0  py-4  lg:p-24 ">
              <motion.h1
                variants={itemVariants}
                className="text-xl  text-violet-950/80 lg:text-5xl font-bold text-center font-[Poppins] w-[150px] lg:w-[350px]">
                The Best All-in-one store for you
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="lg:mt-5 w-1/2 text-center text-violet-950/80 lg:text-2xl">
                Everything you'll ever need
              </motion.p>
              <motion.div variants={itemVariants} whileTap={{ scale: 0.99 }}>
                <a
                  href="#products"
                  className="lg:mt-5 flex items-center gap-2 bg-gradient-to-t text-md  from-zinc-900 to-zinc-700 hover:bg-gradient-to-b text-white px-3 py-2 lg:p-4 text-xs lg:text-lg rounded-lg font-semibold hover:bg-gray-800 drop-shadow-lg">
                  Start Shopping <ShoppingBag />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <div id="products" className="px-2 py-10 lg:p-28">
          <h1 className="text-4xl font-semibold mb-10">Latest products:</h1>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className=" flex flex-wrap justify-start lg:items-center  gap-6  lg:gap-7 ">
            {products?.map((product) => (
              <motion.div
                variants={itemVariants}
                key={product._id}
                className="w-[210px] md:min-w-[250px] flex-grow rounded-lg">
                <Product product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <ProductCategorySection />
      </Layout>
    </>
  );
}

export default Home;

import Layout from "../../Layout";
import { motion } from "framer-motion";
import { useGetProductsQuery, useGetCategoriesTreeQuery } from "../../redux/queries/productApi";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import { useEffect } from "react";
function AllProducts() {
  const { data: products, isLoading } = useGetProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  /*   if (isLoading) return <Loader />;
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when page mounts
  }, []); */
  return (
    <Layout>
      <div className="container mx-auto py-12 lg:px-28">
        <h2 className="text-4xl font-semibold mb-10 text-gray-900">All Products</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products?.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden">
              <Product product={product} categoryTree={categoryTree} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}

export default AllProducts;

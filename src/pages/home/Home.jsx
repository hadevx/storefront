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
import hero3 from "../../assets/images/hero3.webp";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

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
                  className="bg-white rounded-xl overflow-hidden px-1">
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
      {/* Promotional Banner Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 px-6 lg:px-28 mx-5 lg:mx-20 rounded-2xl mt-16 text-center text-white">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">Limited Time Offer!</h2>
        <p className="mb-6 text-lg lg:text-xl">
          Get 20% off on all products this week. Don’t miss out!
        </p>
        <Link
          to="/all-products"
          className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
          Shop Now
        </Link>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 lg:px-28 mt-16">
        <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              “Amazing products and super fast delivery. Highly recommend!”
            </p>
            <p className="font-semibold">- Sarah K.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              “Customer support was very helpful and responsive.”
            </p>
            <p className="font-semibold">- Ahmed M.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              “I love the variety of products available. Will shop again!”
            </p>
            <p className="font-semibold">- Lina A.</p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-6 lg:px-28 mt-16 rounded-xl text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Follow Us</h2>
        <p className="mb-12 text-gray-600 max-w-xl mx-auto">
          Stay connected and get the latest updates on products, offers, and exciting news from our
          store.
        </p>

        <div className="flex justify-center gap-6">
          {[
            {
              href: "https://www.facebook.com/yourpage",
              icon: <Facebook size={24} />,
              bg: "bg-blue-600",
              hover: "hover:bg-blue-700",
            },
            {
              href: "https://www.instagram.com/yourpage",
              icon: <Instagram size={24} />,
              bg: "bg-pink-500",
              hover: "hover:bg-pink-600",
            },
            {
              href: "https://www.twitter.com/yourpage",
              icon: <Twitter size={24} />,
              bg: "bg-blue-400",
              hover: "hover:bg-blue-500",
            },
            {
              href: "https://www.linkedin.com/yourpage",
              icon: <Linkedin size={24} />,
              bg: "bg-blue-700",
              hover: "hover:bg-blue-800",
            },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg ${social.bg} ${social.hover} text-white transition transform hover:scale-110`}>
              {social.icon}
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Home;

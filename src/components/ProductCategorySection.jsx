import { useGetProductsQuery, useGetCategoriesTreeQuery } from "../redux/queries/productApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const findCategoryNameById = (id, nodes) => {
  if (!id || !Array.isArray(nodes)) return null;

  for (const node of nodes) {
    if (String(node._id) === String(id)) return node.name;
    if (node.children) {
      const result = findCategoryNameById(id, node.children);
      if (result) return result;
    }
  }

  // console.warn("Category ID not found:", id);
  return null;
};

export default function ProductCategorySection() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  console.log(categoryTree);

  // Extract unique category IDs from products
  const uniqueCategoryIds = [...new Set(products?.map((product) => product?.category))];

  // Only include IDs that exist at the top level in categoryTree
  const mainCategoryIds = uniqueCategoryIds.filter((id) =>
    categoryTree?.some((cat) => String(cat._id) === String(id))
  );

  // Map only top-level categories
  const cat = mainCategoryIds.map((id) => {
    const name = findCategoryNameById(id, categoryTree || []) || "Unknown";
    const label = name.charAt(0).toUpperCase() + name.slice(1);

    const productWithImage = products.find((p) => String(p.category) === String(id));
    const image = productWithImage?.image || "/images/default-category.jpg";

    return {
      id,
      label,
      image,
    };
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  if (cat.length === 0) return;
  return (
    <motion.section className="bg-gray-100/60 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          visible: {
            transition: {
              duration: 10,
              staggerChildren: 0.3,
            },
          },
        }}
        className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {cat.map((category, index) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}>
              <Link
                to={`/category/${category.label}`}
                className="bg-black rounded-lg shadow-md h-72 overflow-hidden transition-transform transform hover:scale-105">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4  text-center">
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

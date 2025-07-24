import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import devices from "/images/devices.jpg";

function ProductByCategory() {
  const { category } = useParams();

  const { data: products } = useGetProductsByCategoryQuery(category);

  console.log(products);

  return (
    <Layout>
      <div className="min-h-screen ">
        <div className=" w-full   ">
          <img
            src={devices}
            alt=""
            className="object-cover [object-position:50%_75%] h-80 w-full "
          />
        </div>
        <div id="products" className="px-2 py-5 lg:px-28">
          <h1 className="text-4xl font-semibold mb-3">{category}:</h1>
          <p className="mb-10 text-gray-700">
            {products?.length === 1
              ? `${products?.length} product`
              : `${products?.length} products`}{" "}
          </p>
          <div className=" flex flex-wrap  lg:items-center  gap-6  lg:gap-7 ">
            {products?.map((product) => (
              <div key={product?._id} className="w-[210px] md:min-w-[250px] rounded-lg">
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductByCategory;

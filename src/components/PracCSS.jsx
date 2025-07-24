import { useEffect, useState } from "react";

function PracCSS() {
  const [product, setProduct] = useState();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch("https://dummyjson.com/products/1");
      const data = await response.json();
      setProduct(data);
    };
    fetchProduct();
  }, []);
  console.log(product);
  return (
    <div className="container mx-auto  flex">
      <div className="w-1/2 bg-blue-100">
        <img src={product?.images[0]} alt="" />
      </div>
      <div className="flex  text-3xl flex-col justify-center gap-5 bg-rose-100">
        <h1>{product?.title}</h1>
        <h1>{product?.price}</h1>
        <button className="bg-blue-500 px-2 py-1 text-white ">Add To Cart</button>
      </div>
    </div>
  );
}

export default PracCSS;

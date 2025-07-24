import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useGetDiscountStatusQuery } from "../redux/queries/productApi";

function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { data: discountStatus } = useGetDiscountStatusQuery();

  console.log("discount status: ", discountStatus);

  const handleAddToCart = () => {
    if (product.countInStock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    const productInCart = cartItems.find((p) => p._id === product._id);

    if (productInCart && productInCart.qty === productInCart.countInStock) {
      return toast.error("Cannot add more", { position: "top-center" });
    }
    dispatch(addToCart({ ...product, price: newPrice, qty: 1 }));
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };

  function dis(item) {
    if (discountStatus?.category === "all") {
      const oldPrice = item.price;
      const newPrice = oldPrice - oldPrice * discountStatus.discountBy;
      return { oldPrice, newPrice };
    }
    if (discountStatus && item.category === discountStatus.category) {
      const oldPrice = item.price;
      const newPrice = oldPrice - oldPrice * discountStatus.discountBy;
      return { oldPrice, newPrice };
    }
    return { oldPrice: item.price, newPrice: item.price };
  }
  const { oldPrice, newPrice } = dis(product);
  return (
    <>
      <Link to={`/products/${product._id}`}>
        <div className="bg-gray-50 relative rounded-lg border  hover:shadow-md">
          {discountStatus?.category === product?.category && (
            <p className="px-2 absolute top-2 left-2 py-1 bg-blue-500 w-[100px] text-white rounded-full">
              offer {discountStatus.discountBy * 100}%
            </p>
          )}
          <img
            className="w-full rounded-lg shadow h-[300px] object-cover drop-shadow-2xl"
            src={product?.image}
          />
        </div>
      </Link>
      <div className="flex py-3 justify-between items-center">
        <div className="flex flex-col w-[100px] lg:w-[130px] justify-start ">
          <h2 className="lg:text-lg font-semibold  text-gray-800 overflow-hidden whitespace-nowrap truncate">
            {product.name}
          </h2>
          <p className="text-lg text-gray-500 font-semibold mt-2 ">
            {newPrice < oldPrice ? (
              <p>
                <span style={{ textDecoration: "line-through", color: "gray" }}>
                  {oldPrice.toFixed(3)} KD
                </span>{" "}
                <span className="text-green-600 font-bold">{newPrice.toFixed(3)} KD</span>
              </p>
            ) : (
              <p>
                <span style={{ color: "black", fontWeight: "bold" }}>{oldPrice.toFixed(3)} KD</span>
              </p>
            )}
          </p>
        </div>
        <button
          disabled={product.countInStock === 0}
          className={clsx(
            "bg-gradient-to-t text-md   hover:bg-gradient-to-b drop-shadow-lg rounded-lg  text-white py-2 px-3 ",
            product?.countInStock === 0
              ? "bg-zinc-300 "
              : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:bg-gradient-to-b "
          )}
          onClick={handleAddToCart}>
          {product?.countInStock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </>
  );
}

export default Product;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useGetProductByIdQuery, useGetDiscountStatusQuery } from "../../redux/queries/productApi";

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Extract productId from URL
  const { productId } = useParams();
  const { data: discountStatus } = useGetDiscountStatusQuery();
  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);

  // API to get product by id
  useEffect(() => {
    if (product) {
      refetch(); // Refetch data whenever the stock or any other dependency changes
    }
  }, [product?.countInStock, refetch]);
  // Get the items in the cart
  const cartItems = useSelector((state) => state.cart.cartItems);

  //Track the quantity of the product
  const [counter, setCounter] = useState(1);

  const handleIncrement = () => {
    product.countInStock > counter && setCounter(counter + 1);
  };
  const handleDecrement = () => {
    counter > 1 && setCounter(counter - 1);
  };

  const handleAddToCart = () => {
    const productInCart = cartItems.find((p) => p._id === product._id);

    if (productInCart && productInCart.qty === productInCart.countInStock) {
      return toast.error("You Can't add more", { position: "top-center" });
    }
    dispatch(addToCart({ ...product, price: newPrice, qty: Number(counter) }));
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };
  function dis(item) {
    if (discountStatus && item?.category === discountStatus?.category) {
      const oldPrice = item.price;
      const newPrice = oldPrice - oldPrice * discountStatus.discountBy;
      return { oldPrice, newPrice };
    }
    return { oldPrice: item?.price, newPrice: item?.price };
  }
  const { oldPrice, newPrice } = dis(product);

  return (
    <Layout>
      <Link
        to="/"
        className="absolute bg-gradient-to-t from-zinc-200 to-zinc-50 drop-shadow-md left-5 mt-5 lg:left-10 text-black hover:bg-zinc-200/40 border z-20 bg-zinc-200/50 p-3 rounded-lg font-bold">
        Go Back
      </Link>
      <div className="container mx-auto flex gap-5  min-h-screen items-center flex-col  lg:flex-row justify-center   ">
        <div className=" w-[400px] lg:w-1/2 lg:h-[700px] ">
          <img src={product?.image} className="w-full h-full drop-shadow-2xl object-cover" />
        </div>
        <div className="bg-zinc-200/50 relative justify-center items-center rounded-2xl shadow-md p-10 lg:p-20 w-full lg:w-1/2 h-[700px]">
          {product?.category === discountStatus?.category && (
            <p className="absolute top-0 lg:top-5 bg-blue-500 text-white px-2 py-1 rounded-full">
              {discountStatus?.discountBy * 100}% offer
            </p>
          )}

          <h1 className="text-3xl font-extrabold mb-10">{product?.name}</h1>
          <p className="text-gray-500 mb-10 text-lg lg:text-xl">{product?.description}</p>
          {product?.countInStock > 0 && (
            <div className="flex justify-start items-center gap-5 mb-10">
              <button
                onClick={handleDecrement}
                className={clsx(
                  "px-3 py-1 active:bg-gray-500 drop-shadow-xl bg-black border-[2px] rounded-lg font-bold text-3xl",
                  counter === 1
                    ? "bg-inherit border-[2px] border-black text-black"
                    : "text-white border-[2px]"
                )}>
                -
              </button>
              <p className="px-3 text-3xl ">{counter}</p>
              <button
                onClick={handleIncrement}
                className={clsx(
                  "px-3 py-1 active:bg-gray-500 drop-shadow-xl bg-black border-[2px] rounded-lg font-bold text-3xl",
                  counter === product.countInStock
                    ? "bg-inherit border-[2px] border-black text-black"
                    : "text-white border-[2px]"
                )}>
                +
              </button>
            </div>
          )}
          <p className="font-bold text-rose-500 mb-2">
            {product?.countInStock > 0 &&
              product?.countInStock <= 5 &&
              `Only ${product.countInStock} left in stock`}
          </p>
          <p className="font-bold text-3xl mb-10">
            {newPrice < oldPrice ? (
              <p>
                <span style={{ textDecoration: "line-through", color: "gray" }}>
                  {oldPrice.toFixed(3)} KD
                </span>{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {newPrice?.toFixed(3)} KD
                </span>
              </p>
            ) : (
              <p>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {oldPrice?.toFixed(3)} KD
                </span>
              </p>
            )}
          </p>
          <button
            className={clsx(
              " rounded-lg  text-white px-5 py-4 font-bold uppercase drop-shadow-lg",
              product?.countInStock === 0
                ? "bg-zinc-300 "
                : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:bg-gradient-to-b "
            )}
            onClick={handleAddToCart}
            disabled={product?.countInStock === 0}>
            {product?.countInStock === 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Product;

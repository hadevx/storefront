import React from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Truck } from "lucide-react";
import { removeFromCart, addToCart, updateCart } from "../../redux/slices/cartSlice";
import Message from "../../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery } from "../../redux/queries/productApi";

function Cart() {
  //Track the quantity of the product
  const [counter, setCounter] = useState(1);
  const [selectedValue, setSelectedValue] = useState(1);
  const { data: deliveryStatus, refetch } = useGetDeliveryStatusQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: userAddress } = useGetAddressQuery(userInfo?._id);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleChange = (e, item) => {
    setSelectedValue(e.target.value);
    const newQty = e.target.value;

    dispatch(updateCart({ _id: item._id, qty: Number(newQty) }));
  };

  console.log(cartItems);
  /*   const handleAddToCart = (item, qty) => {
    const item = cartItems.find((item) => item._id === product._id); 

    if (item?.qty < item?.countInStock) {
      dispatch(addToCart({ ...item, qty: qty }));
      toast.success(`${item.name} added to cart`, { position: "top-center" });
    }
  }; */

  const handleGoToPayment = () => {
    if (!userInfo) {
      navigate("/login");
      toast.info("You need to login first", { position: "top-center" });
      return;
    }
    if (!userAddress) {
      navigate("/address");
      toast.info("Add your address", { position: "top-center" });
      return;
    } else {
      navigate("/payment");
    }
  };

  return (
    <Layout>
      <div className=" px-4 lg:px-52 mt-20 min-h-screen  flex gap-10 flex-col lg:flex-row justify-between ">
        <div className="w-full lg:w-[1000px]">
          <h1 className="font-bold text-3xl mb-5">Cart</h1>
          {cartItems.length === 0 ? (
            <Message dismiss={false}>Your cart is empty</Message>
          ) : (
            <table className="min-w-full  ">
              <thead className="">
                <tr className="">
                  <th className="px-2 lg:px-4  py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Product
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Name
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Price
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Total
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-600"></th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-100/40">
                    <td className="px-0 lg:px-4 py-10 border-b border-gray-300">
                      <Link to={`/${item._id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 lg:w-24 lg:h-24 bg-zinc-100/50  border-2 object-cover rounded-xl"
                        />
                      </Link>
                    </td>
                    <td className="px-2 lg:px-4 py-2 w-[200px] border-b border-gray-300 text-sm text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-2 lg:px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                      {item.price.toFixed(3)} KD
                    </td>
                    <td className="px-2 lg:px-4  py-2 border-b border-gray-300">
                      <select
                        value={item.qty}
                        onChange={(e) => handleChange(e, item)}
                        className="border bg-zinc-100/50 lg:w-[100px] p-2 rounded  focus:border-blue-500">
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                      {(item.price * item.qty).toFixed(3)} KD
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      <button onClick={() => handleRemove(item._id)} className=" text-black  ">
                        <Trash2 strokeWidth={2} />
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="  rounded-3xl lg:w-[600px] px-2 lg:px-20 ">
          <h1 className="font-bold text-3xl mb-5">Summary</h1>
          <div className="w-full border border-gray-500/20 mb-5 "></div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between ">
              <p>Subtotal:</p>
              <p>{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(3)} KD</p>
            </div>
            <div className="flex justify-between W">
              <p className="flex gap-2">
                Shipping: <Truck strokeWidth={1} />
              </p>
              <p>{deliveryStatus?.shippingFee.toFixed(3)} KD</p>
            </div>
            <div className="flex justify-between W">
              <p className="flex gap-2">Expected delivery in:</p>
              <p className="uppercase">{deliveryStatus?.timeToDeliver}</p>
            </div>

            <div className="w-full border border-gray-500/20 mb-5 "></div>
            <div className="flex justify-between">
              <p>Total:</p>
              <p>
                {(
                  Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)) +
                  Number(deliveryStatus?.shippingFee)
                ).toFixed(3)}{" "}
                KD
              </p>
            </div>
            <div className="">
              <button
                onClick={handleGoToPayment}
                disabled={cartItems.length === 0}
                className={clsx(
                  "bg-gradient-to-t  mt-5 mb-10  text-white p-3 rounded-lg w-full font-bold",
                  cartItems.length === 0
                    ? "from-zinc-300 to-zinc-200  border "
                    : "from-zinc-900 to-zinc-700 hover:bg-gradient-to-b"
                )}>
                Go to payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;

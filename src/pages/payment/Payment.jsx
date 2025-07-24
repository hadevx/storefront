import { useEffect, useState } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { HandCoins, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import {
  useCreateOrderMutation,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/queries/orderApi";
import { useUpdateStockMutation, useGetDeliveryStatusQuery } from "../../redux/queries/productApi";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { clearCart } from "../../redux/slices/cartSlice";
import clsx from "clsx";
import { toast } from "react-toastify";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [updateStock] = useUpdateStockMutation();

  const { data: userAddress, refetch, isLoading } = useGetAddressQuery(userInfo._id);

  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();

  const { data: deliveryStatus } = useGetDeliveryStatusQuery();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  /*   const [payOrder] = usePayOrderMutation(); */
  /*   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer(); */

  //GET client Id from server
  /*   const { data: paypal } = useGetPayPalClientIdQuery(); */

  /*  useEffect(() => {
    if (paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (!window.paypal) {
        loadPayPalScript();
      }
    }
  }, [paypal, paypalDispatch]); */

  //PAY with cash
  const handleCashPayment = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.shippingFee,
        totalPrice:
          Number(cartItems.reduce((a, c) => a + c.price * c.qty, 0)) +
          Number(deliveryStatus?.shippingFee),
      }).unwrap();

      // Call API to update stock
      await updateStock({
        orderItems: cartItems,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleCreditPayment = async (paymentResult) => {
    try {
      const checkIsPaid = paymentResult?.status === "COMPLETED";
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.shippingFee,
        totalPrice:
          Number(cartItems.reduce((a, c) => a + c.price * c.qty, 0)) +
          Number(deliveryStatus?.shippingFee),
        isPaid: checkIsPaid,
        paidAt: checkIsPaid ? Date.now() : null,
      }).unwrap();

      // Call API to update stock
      await updateStock({
        orderItems: cartItems,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  // PayPal on approve
  const onApprovePayPal = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      // Call `handlePlaceOrder` with payment result after successful payment
      console.log(details);
      console.log(data);
      await handleCreditPayment(details);
    });
  };
  const createPaypalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (
              cartItems.reduce((a, c) => a + c.price * c.qty, 0) + deliveryStatus?.shippingFee
            ).toFixed(2),
          },
        },
      ],
    });
    /*  .then((orderId) => {
        return orderId;
      }) */
  };

  return (
    <Layout className="">
      <div className="min-h-screen">
        <div className="flex  flex-col-reverse py-10 lg:flex-row gap-5 lg:gap-10 px-5 lg:px-32 lg:mt-5">
          <div className="flex lg:w-[50%] gap-5 flex-col">
            <Link
              to="/profile"
              className="flex flex-col gap-5 border bg-zinc-2 `
              00/10 p-7 drop-shadow-lg shadow rounded-lg">
              <h1 className="font-extrabold text-3xl ">Shipping Address</h1>
              <hr />

              <div className="flex gap-10 ">
                <div className="flex text-md  flex-col gap-7 ">
                  <h1 className="text-gray-700">Province:</h1>
                  <h1 className="text-gray-700">City:</h1>
                  <h1 className="text-gray-700">Block:</h1>
                  <h1 className="text-gray-700">Street:</h1>
                  <h1 className="text-gray-700">House:</h1>
                </div>
                {isLoading ? (
                  <Spinner className="border-t-black" />
                ) : (
                  <div className="flex flex-col text-md  gap-7 ">
                    <h1 className="font-bold">{userAddress?.province}</h1>
                    <h1 className="font-bold">{userAddress?.city}</h1>
                    <h1 className="font-bold">{userAddress?.block}</h1>
                    <h1 className="font-bold">{userAddress?.street}</h1>
                    <h1 className="font-bold">{userAddress?.house}</h1>
                  </div>
                )}
              </div>
            </Link>
            <div className="flex flex-col gap-5 border bg-zinc-200/10 p-7 drop-shadow-lg shadow rounded-lg">
              <h1 className="font-extrabold text-3xl  ">Payment method</h1>
              <hr />
              <div className="flex gap-5 font-bold text-xl items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentChange}
                  className="size-[20px]"
                />
                <p>Cash on Delivery</p>
                <HandCoins />
              </div>
              <div className="flex gap-5 font-bold text-xl items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={handlePaymentChange}
                  className="size-[20px]"
                />
                <p>Credit card</p>
                <CreditCard />
              </div>
              {/* PAYPAL BUTTONS */}
              {paymentMethod === "paypal" && (
                <div>
                  <PayPalButtons
                    style={{ color: "blue" }}
                    createOrder={createPaypalOrder}
                    onApprove={onApprovePayPal}
                  />
                </div>
              )}

              {paymentMethod === "cash" && (
                <button
                  disabled={loadingCreateOrder}
                  onClick={handleCashPayment}
                  className={clsx(
                    "bg-gradient-to-t transition-all duration-300  flex justify-center  drop-shadow-lg mt-5 w-[200px] text-white font-bold p-3 rounded-lg",
                    loadingCreateOrder
                      ? "from-zinc-300 to-zinc-200 "
                      : "from-zinc-900 to-zinc-700 hover:bg-gradient-to-b"
                  )}>
                  {loadingCreateOrder ? <Spinner className="border-t-black" /> : " Place Order"}
                </button>
              )}
            </div>
          </div>

          <Link
            to="/cart"
            className="flex  lg:w-[50%] flex-col  gap-5 border bg-zinc-200/10 p-7 drop-shadow-lg shadow rounded-lg">
            <h1 className="font-extrabold text-3xl  ">Your cart</h1>
            <hr />
            <div className="flex gap-20 ">
              <div className="flex flex-col gap-2 ">
                <h1 className="text-gray-700">Subtotal:</h1>
                <h1 className="text-gray-700">Shipping:</h1>
                <hr />
                <h1 className="text-gray-700">Total:</h1>
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="font-bold">
                  {cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(3)} KD
                </h1>
                <h1 className="font-bold">{deliveryStatus?.shippingFee.toFixed(3)} KD</h1>
                <hr />
                <h1 className="font-bold">
                  {(
                    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) +
                    deliveryStatus?.shippingFee
                  ).toFixed(3)}{" "}
                  KD
                </h1>
              </div>
            </div>
            {cartItems.map((item) => (
              <>
                <div key={item._id} className="flex items-center mt-5 justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-20 h-20 bg-white rounded-lg  border-2 object-cover"
                    />
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">{item.name}</p>
                  </div>
                  <div>
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">
                      {item.qty} x {item.price.toFixed(3)} KD
                    </p>
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">
                      {(item.qty * item.price).toFixed(3)} KD
                    </p>
                  </div>
                </div>
                <hr />
              </>
            ))}
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;

import { useEffect, useState } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { HandCoins, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
  useCreateTapPaymentMutation,
} from "../../redux/queries/orderApi";
import {
  useUpdateStockMutation,
  useGetDeliveryStatusQuery,
  useFetchProductsByIdsMutation,
} from "../../redux/queries/productApi";
import { clearCart } from "../../redux/slices/cartSlice";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Inside your component
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [updateStock] = useUpdateStockMutation();
  const [fetchProductsByIds, { isLoading: loadingCheck }] = useFetchProductsByIdsMutation();
  const { data: userAddress, refetch, isLoading } = useGetAddressQuery(userInfo._id);

  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();

  const { data: deliveryStatus } = useGetDeliveryStatusQuery();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const totalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0].shippingFee).toFixed(3));
    return items + deliveryFee;
  };
  const totalAmount = totalCost(); // or calculated properly before using in handleApprove

  //PAY with cash
  const handleCashPayment = async () => {
    try {
      // 1️⃣ Get latest product data
      const productIds = cartItems.map((item) => item._id);
      const latestProducts = await fetchProductsByIds(productIds).unwrap();

      // 2️⃣ Check stock
      const outOfStockItems = cartItems.filter((item) => {
        const product = latestProducts.find((p) => p._id === item._id);
        return !product || item.qty > product.countInStock;
      });

      if (outOfStockItems.length > 0) {
        toast.error(
          `Some products are out of stock: ${outOfStockItems.map((i) => i.name).join(", ")}`
        );
        return;
      }

      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.[0].shippingFee,
        totalPrice: totalAmount,
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

  // Called when PayPal transaction is approved
  const handleApprove = async (data, actions) => {
    const details = await actions.order.capture();

    try {
      // Create your order in backend after successful payment
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.[0].shippingFee,
        totalPrice: Number(cartItems.reduce((a, c) => a + c.price * c.qty, 0)),
      };

      const res = await createOrder(orderPayload).unwrap();
      await updateStock({ orderItems: cartItems }).unwrap();
      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
      // navigate to order page if you want
    } catch (error) {
      toast.error("Failed to create order after PayPal payment");
    }
  };

  /*   const totalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0].shippingFee).toFixed(3));
    return items + deliveryFee;
  };
  const totalAmount = totalCost(); // or calculated properly before using in handleApprove */

  function convertKWDToUSD(amountInKWD, exchangeRate) {
    if (typeof amountInKWD !== "number" || amountInKWD < 0) {
      throw new Error("Invalid amount");
    }
    if (typeof exchangeRate !== "number" || exchangeRate <= 0) {
      throw new Error("Invalid exchange rate");
    }

    const amountInUSD = amountInKWD * exchangeRate;
    return amountInUSD;
  }

  const kwTous = convertKWDToUSD(totalAmount, 3.25);
  console.log(kwTous);

  return (
    <Layout className="bg-zinc-100">
      <div className="min-h-screen">
        <div className="flex  flex-col-reverse py-10 lg:flex-row gap-5 lg:gap-10 px-5 lg:px-60 lg:mt-5">
          <div className="flex lg:w-[50%] gap-5 flex-col">
            <Link
              to="/profile"
              className="flex bg-white hover:shadow transition-all duration-300 flex-col gap-5 border  p-7   rounded-lg">
              <h1 className="font-extrabold text-lg ">Shipping Address</h1>
              <hr />

              <div className="flex gap-10 ">
                <div className="flex   flex-col gap-2 ">
                  <h1 className="text-gray-700">Governorate:</h1>
                  <h1 className="text-gray-700">City:</h1>
                  <h1 className="text-gray-700">Block:</h1>
                  <h1 className="text-gray-700">Street:</h1>
                  <h1 className="text-gray-700">House:</h1>
                </div>
                {isLoading ? (
                  <Spinner className="border-t-black" />
                ) : (
                  <div className="flex flex-col   gap-2 ">
                    <h1 className="font-bold">{userAddress?.governorate}</h1>
                    <h1 className="font-bold">{userAddress?.city}</h1>
                    <h1 className="font-bold">{userAddress?.block}</h1>
                    <h1 className="font-bold">{userAddress?.street}</h1>
                    <h1 className="font-bold">{userAddress?.house}</h1>
                  </div>
                )}
              </div>
            </Link>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-bold text-xl mb-4">Payment Method</h2>
              <div className="space-y-4">
                {/* Cash Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "cash"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <HandCoins className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Cash on Delivery</span>
                </label>

                {/* PayPal Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "paypal"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Credit Card</span>
                </label>

                {/* PayPal Button */}
                {paymentMethod === "paypal" && (
                  <div className="mt-5">
                    <PayPalButtons
                      fundingSource={FUNDING.CARD} // Show only card funding option
                      /*   style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "pill",
                        tagline: false,
                        height: 40,
                      }} */
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: Number(kwTous.toFixed(2)),
                              },
                            },
                          ],
                          application_context: {
                            shipping_preference: "NO_SHIPPING",
                            user_action: "PAY_NOW",
                          },
                          payer: {
                            name: {
                              given_name: userInfo?.name,
                              surname: userInfo.name,
                            },
                            phone: {
                              phone_type: "MOBILE", // or "HOME", "WORK"
                              phone_number: {
                                national_number: userInfo?.phone, // your user's phone number string, e.g. "12345678"
                              },
                            },
                            email_address: "sb-glzmb32291307@personal.example.com",
                            address: {
                              country_code: "KW", // Limits billing address country to Kuwait
                              postal_code: "00000",
                            },
                          },
                        });
                      }}
                      onApprove={handleApprove}
                      onError={(err) => {
                        toast.error("PayPal payment failed");
                        console.error(err);
                      }}
                    />
                  </div>
                )}
              </div>

              {paymentMethod === "cash" && (
                <button
                  disabled={loadingCreateOrder || loadingCheck}
                  onClick={handleCashPayment}
                  className={clsx(
                    "w-full mt-5 py-4 flex justify-center  font-bold transition-all duration-300 shadow",
                    loadingCreateOrder || loadingCheck
                      ? "bg-gray-300 text-black"
                      : "bg-zinc-900 hover:bg-zinc-700 text-white  transition-all duration-300"
                  )}>
                  {loadingCheck
                    ? "Checking stock..."
                    : loadingCreateOrder
                    ? "Placing order..."
                    : "Place Order"}
                </button>
              )}
            </div>
          </div>
          {/* ------ */}
          <Link
            to="/cart"
            className="flex hover:shadow transition-all duration-300  lg:w-[50%] flex-col  gap-5 border bg-white p-7  rounded-lg">
            <h1 className="font-extrabold text-lg  ">Your Cart</h1>
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
                <h1 className="font-bold">{deliveryStatus?.[0].shippingFee.toFixed(3)} KD</h1>
                <hr />
                <h1 className="font-bold">{totalCost().toFixed(3)} KD</h1>
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

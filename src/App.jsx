import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import Register from "./pages/auth/Register";
import Payment from "./pages/payment/Payment";
import PrivateRoute from "./components/PrivateRoute";
import Product from "./pages/product/Product";
import Profile from "./pages/user/Profile";
import Address from "./pages/address/Address";
import Order from "./pages/order/Order";
import ProductByCategory from "./pages/productByCategory/ProductByCategory";
import { useGetStoreStatusQuery } from "./redux/queries/maintenanceApi";
import Maintenance from "./components/Maintenance";

function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: storeStatus } = useGetStoreStatusQuery();

  return (
    <Routes>
      <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!userInfo ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={<Home />} />
      <Route path="/products/:productId" element={<Product />} />
      <Route path="/category/:category" element={<ProductByCategory />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
      <Route path="/order/:orderId" element={<PrivateRoute element={<Order />} />} />
      <Route path="/address" element={<PrivateRoute element={<Address />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
    </Routes>
  );
}

export default App;

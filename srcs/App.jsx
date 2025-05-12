import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Header from '../components/features/header/Header';
// import Footer from '../components/features/footer/Footer';
import HomePage from "./components/pages/HomePage";
import ProductPage from "./components/pages/ProductPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import CompleteOrderPage from "./components/pages/CompleteOrderPage";
import PaymentPage from "./components/pages/PaymentPage";
import ShippingInfoPage from "./components/pages/ShippingInfoPage";
import LoginPage from "./components/pages/LoginPage";
import BuildPCPage from "./components/pages/BuildPCPage";
import ProductSelectionPage from "./components/pages/ProductSelectionPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="home" />} />
          <Route path="home" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="san-pham" element={<ProductPage />} />
          <Route path="thanh-toan" element={<CheckoutPage />} />
          <Route path="hoan-tat-thanh-toan" element={<CompleteOrderPage />} />
          <Route path="phuong-thuc-tt" element={<PaymentPage />} />
          <Route path="thong-tin-giao-hang" element={<ShippingInfoPage />} />
          <Route path="build-pc" element={<BuildPCPage />} />
          <Route path="chon-san-pham" element={<ProductSelectionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

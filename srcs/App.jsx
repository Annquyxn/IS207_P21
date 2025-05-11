import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/features/header/Header";
import Footer from "@/components/features/footer/Footer";
// import HomePage from "../pages/HomePage";
// import ProductPage from "../pages/ProductPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import CompleteOrderPage from "@/components/pages/CompleteOrderPage";
import PaymentPage from "@/components/pages/PaymentPage";
import ShippingInfoPage from "@/components/pages/ShippingInfoPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham" element={<ProductPage />} />
            <Route path="/thanh-toan" element={<CheckoutPage />} />
            <Route
              path="/hoan-tat-thanh-toan"
              element={<CompleteOrderPage />}
            />
            <Route path="/phuong-thuc-tt" element={<PaymentPage />} />
            <Route path="/thong-tin-giao-hang" element={<ShippingInfoPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

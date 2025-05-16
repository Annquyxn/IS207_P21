import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// import các thành phần cần thiết từ framer-motion
import Layout from "./components/ui/Layout";
import HomePage from "./components/pages/HomePage";
import ProductPage from "./components/pages/ProductPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import CompleteOrderPage from "./components/pages/CompleteOrderPage";
import PaymentPage from "./components/pages/PaymentPage";
import ShippingInfoPage from "./components/pages/ShippingInfoPage";
import LoginPage from "./components/pages/LoginPage";
import BuildPCPage from "./components/pages/BuildPCPage";
import User from "./components/pages/User";
import UserPage from "./components/features/user/UserPage";
import UserAddress from "./components/features/user/UserAddress";
import UserOrders from "./components/features/user/UserOrders";
import UserHistory from "./components/features/user/UserHistory";
import AccountForm from "./components/features/user/FormAccount";
import ShoppingCartPage from "./components/pages/ShoppingCartPage";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import RegistrationPage from "./components/pages/RegistrationPage";
import AnimatedPage from "./components/ui/AnimatedPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route
                path="home"
                element={
                  <AnimatedPage>
                    <HomePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="login"
                element={
                  <AnimatedPage>
                    <LoginPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="register"
                element={
                  <AnimatedPage>
                    <RegistrationPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <AnimatedPage>
                    <ForgotPasswordPage />
                  </AnimatedPage>
                }
              />

              <Route
                path="san-pham"
                element={
                  <AnimatedPage>
                    <ProductPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="checkout"
                element={
                  <AnimatedPage>
                    <CheckoutPage />
                  </AnimatedPage>
                }
              />

              <Route
                path="product-detail"
                element={
                  <AnimatedPage>
                    <ProductDetailPage />
                  </AnimatedPage>
                }
              />

              <Route
                path="shopping-cart"
                element={
                  <AnimatedPage>
                    <ShoppingCartPage />
                  </AnimatedPage>
                }
              />

              <Route
                path="complete"
                element={
                  <AnimatedPage>
                    <CompleteOrderPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="payment-page"
                element={
                  <AnimatedPage>
                    <PaymentPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="ship-info"
                element={
                  <AnimatedPage>
                    <ShippingInfoPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="build-pc"
                element={
                  <AnimatedPage>
                    <BuildPCPage />
                  </AnimatedPage>
                }
              />

              <Route path="user" element={<User />}>
                <Route
                  index
                  element={
                    <AnimatedPage>
                      <UserPage />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="address"
                  element={
                    <AnimatedPage>
                      <UserAddress />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <AnimatedPage>
                      <UserOrders />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="history"
                  element={
                    <AnimatedPage>
                      <UserHistory />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="update"
                  element={
                    <AnimatedPage>
                      <AccountForm />
                    </AnimatedPage>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
    </BrowserRouter>
  );
}

export default App;

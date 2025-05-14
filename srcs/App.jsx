import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // import các thành phần cần thiết từ framer-motion

import Layout from "./components/ui/Layout";
import HomePage from "./components/pages/HomePage";
import ProductPage from "./components/pages/ProductPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import CompleteOrderPage from "./components/pages/CompleteOrderPage";
import PaymentPage from "./components/pages/PaymentPage";
import ShippingInfoPage from "./components/pages/ShippingInfoPage";
import LoginPage from "./components/pages/LoginPage";
import RegistrationPage from "./components/pages/RegistrationPage";
import BuildPCPage from "./components/pages/BuildPCPage";
import ProductSelectionPage from "./components/pages/ProductSelectionPage";
import User from "./components/pages/User";
import UserPage from "./components/features/user/UserPage";
import UserAddress from "./components/features/user/UserAddress";
import UserOrders from "./components/features/user/UserOrders";
import UserHistory from "./components/features/user/UserHistory";
import AccountForm from "./components/features/user/FormAccount";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route
                path="home"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <HomePage />
                  </motion.div>
                }
              />
              <Route
                path="login"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoginPage />
                  </motion.div>
                }
              />
              <Route
                path="register"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RegistrationPage />
                  </motion.div>
                }
              />

              <Route
                path="san-pham"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductPage />
                  </motion.div>
                }
              />
              <Route
                path="checkout"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckoutPage />
                  </motion.div>
                }
              />
              <Route
                path="complete"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CompleteOrderPage />
                  </motion.div>
                }
              />
              <Route
                path="payment-page"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PaymentPage />
                  </motion.div>
                }
              />
              <Route
                path="ship-info"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShippingInfoPage />
                  </motion.div>
                }
              />
              <Route
                path="build-pc"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <BuildPCPage />
                  </motion.div>
                }
              />
              <Route
                path="select"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductSelectionPage />
                  </motion.div>
                }
              />

              <Route path="user" element={<User />}>
                <Route
                  index
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserPage />
                    </motion.div>
                  }
                />
                <Route
                  path="address"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserAddress />
                    </motion.div>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserOrders />
                    </motion.div>
                  }
                />
                <Route
                  path="history"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserHistory />
                    </motion.div>
                  }
                />
                <Route
                  path="update"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AccountForm />
                    </motion.div>
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

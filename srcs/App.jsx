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
import AboutGearVN from "./components/features/footer-components/AboutGearVN";
import JobPage from "./components/features/footer-components/JobPage";
import CustomerSupportForm from "./components/features/footer-components/CustomerSupportForm";
import InstallmentPlan from "./components/features/footer-components/InstallmentPlan";
import PaymentGuide from "./components/features/footer-components/PaymentGuide";
import PcBuilder from "./components/features/footer-components/PcBuilder";
import PrivacyPolicy from "./components/features/footer-components/PrivacyPolicy";
import ShippingPolicy from "./components/features/footer-components/ShippingPolicy";
import ShoppingGuide from "./components/features/footer-components/ShoppingGuide";
import ShowroomSystem from "./components/features/footer-components/ShowroomSystem";
import WarrantyLookup from "./components/features/footer-components/WarrantyLookup";
import WarrantyPolicy from "./components/features/footer-components/WarrantyPolicy";

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

            <Route
              path="about"
              element={
                <AnimatedPage>
                  <AboutGearVN />
                </AnimatedPage>
              }
            />

            <Route
              path="jobs"
              element={
                <AnimatedPage>
                  <JobPage />
                </AnimatedPage>
              }
            />

            <Route
              path="contact"
              element={
                <AnimatedPage>
                  <CustomerSupportForm />
                </AnimatedPage>
              }
            />

            <Route
              path="warranty-policy"
              element={
                <AnimatedPage>
                  <WarrantyPolicy />
                </AnimatedPage>
              }
            />

            <Route
              path="shipping-policy"
              element={
                <AnimatedPage>
                  <ShippingPolicy />
                </AnimatedPage>
              }
            />

            <Route
              path="privacy-policy"
              element={
                <AnimatedPage>
                  <PrivacyPolicy />
                </AnimatedPage>
              }
            />

            <Route
              path="showrooms"
              element={
                <AnimatedPage>
                  <ShowroomSystem />
                </AnimatedPage>
              }
            />

            <Route
              path="shopping-guide"
              element={
                <AnimatedPage>
                  <ShoppingGuide />
                </AnimatedPage>
              }
            />

            <Route
              path="payment-guide"
              element={
                <AnimatedPage>
                  <PaymentGuide />
                </AnimatedPage>
              }
            />

            <Route
              path="installment"
              element={
                <AnimatedPage>
                  <InstallmentPlan />
                </AnimatedPage>
              }
            />

            <Route
              path="warranty-lookup"
              element={
                <AnimatedPage>
                  <WarrantyLookup />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </BrowserRouter>
  );
}

export default App;

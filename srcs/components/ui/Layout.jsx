import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ChatBotContainer from "../features/chatBot/ChatBotContainer";
import LoginForm from "../features/auth/LoginForm";
import ModalWrapper from "./ModalWrapper";
import { AnimatePresence } from "framer-motion";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const hiddenRoutes = ["/login", "/register", "/forgot-password"];
  const hideHeaderFooter = hiddenRoutes.includes(location.pathname);

  // Handle modal parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const modalParam = searchParams.get("modal");

    if (modalParam === "login") {
      // Update URL without modal parameter but keep the history
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      // Set modal state in location
      navigate(location.pathname, { state: { modal: "login" } });
    }
  }, [location.pathname, navigate]);

  // Check if we should show login modal
  const showLoginModal = location.state?.modal === "login";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <Outlet key={location.pathname} />
          {showLoginModal && (
            <ModalWrapper key="login-modal">
              <LoginForm />
            </ModalWrapper>
          )}
        </AnimatePresence>
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ChatBotContainer />}
    </div>
  );
}

export default Layout;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShoppingCartPage from "../components/pages/ShoppingCartPage";
// import LoginPage from "../components/pages/LoginPage";
import RegistrationPage from "../components/pages/RegistrationPage";
import GlobalStyles from "../styles/GlobalStyles";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/cart" element={<ShoppingCartPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShoppingCartPage from "./pages/ShoppingCartPage";

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/cart" element={<ShoppingCartPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import CheckoutPage from './components/pages/CheckoutPage';
import CompleteOrderPage from './components/pages/CompleteOrderPage';
import PaymentPage from './components/pages/PaymentPage';
import ShippingInfoPage from './components/pages/ShippingInfoPage';
import LoginPage from './components/pages/LoginPage';
import BuildPCPage from './components/pages/BuildPCPage';
import ProductSelectionPage from './components/pages/ProductSelectionPage';
import UserAddress from './components/features/user/UserAddress';
import UserOrders from './components/features/user/UserOrders';
import UserHistory from './components/features/user/UserHistory';
import UserPage from './components/features/user/UserPage';
import User from './components/pages/User';
import Layout from './components/ui/Layout';
import AccountForm from './components/features/user/FormAccount';

function App() {
  return (
    <BrowserRouter>
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Navigate replace to='home' />} />
            <Route path='home' element={<HomePage />} />

            <Route path='user' element={<User />}>
              <Route index element={<UserPage />} />
              <Route path='address' element={<UserAddress />} />
              <Route path='orders' element={<UserOrders />} />
              <Route path='history' element={<UserHistory />} />
              <Route path='update' element={<AccountForm />} />
            </Route>

            <Route path='login' element={<LoginPage />} />
            <Route path='san-pham' element={<ProductPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='hoan-tat-thanh-toan' element={<CompleteOrderPage />} />
            <Route path='phuong-thuc-tt' element={<PaymentPage />} />
            <Route path='thong-tin-giao-hang' element={<ShippingInfoPage />} />
            <Route path='build-pc' element={<BuildPCPage />} />
            <Route path='chon-san-pham' element={<ProductSelectionPage />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

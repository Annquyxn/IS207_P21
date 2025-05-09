// src/pages/CartPage.jsx
import React from 'react';
import Header from '../components/shared/Header';
import CartProgress from '../components/shared/CartProgress';
import EmptyCart from '../components/shared/EmptyCart';
import Footer from '../components/shared/footer/Footer';
import '../styles/shoppingCart.css';

const CartPage = () => {
  return (
    <main className="shopping-cart">
      <Header />

      <section className="cart-content">
        <header className="cart-header">
          <i className="ion-ios-cart cart-header-icon"></i>
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <span className="product-count">(0 sản phẩm)</span>
        </header>
        <CartProgress />
      </section>

      <EmptyCart />

      <h2 className="featured-products-title">Sản phẩm nổi bật</h2>

      <section className="featured-products-row">
        <div className="products-container">
          <div className="product-column large">
            <article className="product-card"></article>
          </div>
          <div className="product-column small">
            <article className="product-card"></article>
          </div>
        </div>
      </section>

      <section className="featured-products-row">
        <div className="products-container equal">
          <div className="product-column">
            <article className="product-card"></article>
          </div>
          <div className="product-column">
            <article className="product-card"></article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CartPage;

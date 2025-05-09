import React from 'react';

const FooterColumn = ({ heading, links = [], texts = [] }) => (
  <section className="footer-column">
    <h3 className="footer-heading">{heading}</h3>
    <nav className="footer-links">
      {links.map((link, i) => (
        <a key={i} href="#" className="footer-link">{link}</a>
      ))}
      {texts.map((text, i) => (
        <p key={i} className="footer-text">{text}</p>
      ))}
    </nav>
  </section>
);

export default FooterColumn;

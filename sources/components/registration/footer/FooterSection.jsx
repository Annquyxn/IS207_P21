import React from 'react';

const FooterSection = ({ title, links }) => (
  <section className="footer-section">
    <h2 className="footer-heading">{title}</h2>
    {links.map((text, i) => (
      <a key={i} href="#" className="footer-link">{text}</a>
    ))}
  </section>
);

export default FooterSection;

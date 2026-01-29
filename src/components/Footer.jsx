import React from 'react';

const Footer = () => {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="glass" style={{ padding: '4rem 0', borderTop: '1px solid var(--card-border)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="logo font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Saifullah<span style={{ color: 'var(--accent-primary)' }}>Razzaq</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Building high-performance mobile products that grow retention and revenue.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
          <a href="#portfolio" onClick={(e) => handleScroll(e, 'portfolio')}>Portfolio</a>
          <a href="#experience" onClick={(e) => handleScroll(e, 'experience')}>Experience</a>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Contact</a>
        </div>
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} Saifullah Razzaq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

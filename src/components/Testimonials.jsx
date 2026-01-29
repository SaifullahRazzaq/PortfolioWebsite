import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      text: "“Saifullah shipped our React Native app ahead of schedule and improved performance immediately. Clear communication and high quality.”",
      author: "Product Manager, Mobility Startup"
    },
    {
      text: "“Great attention to detail and extremely reliable. Our release cycle is smoother and the crash rate dropped significantly.”",
      author: "CTO, HealthTech Company"
    },
    {
      text: "“Delivered a polished UI and seamless API integrations. We saw better retention within weeks.”",
      author: "Founder, Service Marketplace"
    }
  ];

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Testimonials</span>
          <h2 style={{ fontSize: '2.5rem' }}>Trusted by teams that ship fast</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              style={{ padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>{t.text}</p>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>— {t.author}</strong>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

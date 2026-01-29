import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Search, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'React Native Apps',
      description: 'High-performance iOS and Android apps with smooth UI, offline support, and native integrations.',
      icon: <Smartphone size={32} />
    },
    {
      title: 'API Integration',
      description: 'REST and GraphQL integrations with secure authentication, analytics, and reliable data flows.',
      icon: <Zap size={32} />
    },
    {
      title: 'Performance Optimization',
      description: 'Faster load times, crash reduction, and improved UX metrics with profiling and testing.',
      icon: <Search size={32} />
    },
    {
      title: 'Web-to-Mobile Migration',
      description: 'Convert existing web products into polished mobile experiences with seamless onboarding.',
      icon: <Globe size={32} />
    }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Services</span>
          <h2 style={{ fontSize: '2.5rem' }}>Mobile solutions designed to scale fast</h2>
        </div>

        <div className="services-grid grid-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="service-card glass"
              style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--card-border)' }}
              whileHover={{ y: -10, borderColor: 'var(--accent-primary)' }}
            >
              <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="btn btn-primary">Get a Quote</a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="btn btn-ghost">Book a Call</a>
        </div>
      </div>
    </section>
  );
};

export default Services;

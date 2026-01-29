import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Linkedin, Github } from 'lucide-react';

const Contact = () => {
  return (
    <section className="section" id="contact" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Contact</span>
          <h2 style={{ fontSize: '2.5rem' }}>Let's build something great together</h2>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            <div className="glass" style={{ padding: '3rem', borderRadius: '2rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Direct Contact</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                Ready to discuss your project? Send a quick message or connect
                on your preferred platform.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <a 
                  href="https://wa.me/923422359217" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ justifyContent: 'flex-start', padding: '1rem 2rem' }}
                >
                  <MessageSquare size={20} style={{ marginRight: '1rem' }} /> WhatsApp Chat
                </a>
                <a 
                  href="mailto:saifullah.razzaq1995@gmail.com" 
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', padding: '1rem 2rem' }}
                >
                  <Mail size={20} style={{ marginRight: '1rem' }} /> Email Me
                </a>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Social Profiles</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="https://www.linkedin.com/in/saifullah-razzaq-7ab027139/" target="_blank" rel="noopener noreferrer" className="glass btn-icon" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                    <Linkedin size={24} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="glass btn-icon" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                    <Github size={24} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form 
              className="glass" 
              style={{ padding: '3rem', borderRadius: '2rem' }}
              action="https://formsubmit.co/saifullah.razzaq1995@gmail.com"
              method="POST"
            >
              <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Send a message</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Name</label>
                  <input type="text" name="name" required style={{ 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '0.75rem',
                    color: 'white',
                    outline: 'none'
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email</label>
                  <input type="email" name="email" required style={{ 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '0.75rem',
                    color: 'white',
                    outline: 'none'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Project Details</label>
                <textarea name="message" rows="5" required style={{ 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '0.75rem',
                  color: 'white',
                  outline: 'none',
                  resize: 'none'
                }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                Send Message
              </button>
              
              <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                You will get a response within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <style jsx>{`
         @media (max-width: 992px) {
           .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
         }
      `}</style>
    </section>
  );
};

export default Contact;

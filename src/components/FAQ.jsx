import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does a typical app take?',
      answer: 'Most MVPs take 4–6 weeks. Larger apps vary by scope.'
    },
    {
      question: 'Do you handle App Store submissions?',
      answer: 'Yes, I prepare assets and submit to both stores.'
    },
    {
      question: 'How do we communicate during the project?',
      answer: 'Weekly updates via Slack/Zoom, plus shared task boards.'
    },
    {
      question: 'Can you take over an existing app?',
      answer: 'Yes. I can audit, refactor, and improve existing codebases.'
    }
  ];

  const Pricing = () => {
    const plans = [
      {
        name: 'Hourly',
        price: '$30',
        unit: 'hour',
        features: ['Flexible tasks', 'Weekly reporting', 'Time-tracked'],
        highlight: false
      },
      {
        name: 'Monthly Hiring',
        price: '$3,000',
        unit: 'month',
        features: ['Dedicated 5 hrs/day', 'Priority availability', 'Ongoing support'],
        highlight: true
      },
      {
        name: 'Project Based',
        price: 'Custom',
        unit: 'discussion',
        features: ['Custom scope', 'Milestone delivery', 'Fixed timeline'],
        highlight: false
      }
    ];

    return (
      <div style={{ marginTop: '8rem' }}>
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Pricing</span>
          <h2 style={{ fontSize: '2.5rem' }}>Flexible packages for every stage</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass ${plan.highlight ? 'highlight-border' : ''} pricing-card`}
              style={{ 
                padding: '3rem 2rem', 
                borderRadius: '1.5rem', 
                textAlign: 'center',
                position: 'relative',
                border: plan.highlight ? '2px solid var(--accent-primary)' : '1px solid var(--card-border)',
                zIndex: plan.highlight ? 2 : 1
              }}
            >
              {plan.highlight && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  background: 'var(--accent-primary)', 
                  color: 'white', 
                  padding: '2px 15px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700 
                }}>MOST POPULAR</div>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{plan.name}</h3>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                <span style={{ color: 'var(--text-secondary)' }}> / {plan.unit}</span>
              </div>
              <ul style={{ marginBottom: '2.5rem', textAlign: 'left', display: 'inline-block' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-primary)', marginRight: '10px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%' }}>
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">FAQ</span>
          <h2 style={{ fontSize: '2.5rem' }}>Answers to common questions</h2>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="glass"
                style={{ 
                  width: '100%', 
                  padding: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderRadius: '1rem',
                  border: '1px solid var(--card-border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'inherit',
                  fontFamily: 'inherit'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{faq.question}</span>
                {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <Pricing />
      </div>
    </section>
  );
};

export default FAQ;

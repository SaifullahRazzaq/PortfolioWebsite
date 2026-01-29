import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Apple, Play } from 'lucide-react';

const Portfolio = () => {
  const [filter, setFilter] = useState('all');

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'AI Agents', value: 'ai' },
    { label: 'Marketplace', value: 'marketplace' },
    { label: 'Services', value: 'services' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Commerce', value: 'commerce' },
  ];

  const projects = [
    {
      title: 'AI-Powered CRM Hub',
      category: 'ai',
      description: 'An advanced CRM system built with multi-agent orchestration for automated lead classification, sentiment analysis, and personalized outreach.',
      tags: ['LangChain', 'OpenAI', 'React', 'Node.js'],
      metrics: ['60% faster lead processing', '95% Accuracy'],
      links: [
        { label: 'View Demo', icon: <ExternalLink size={16} />, url: '#' }
      ]
    },
    {
      title: 'Autonomous Sales Agent',
      category: 'ai',
      description: 'An autonomous agent that manages full sales cycles, from prospecting to closing, using adaptive learning and real-time data extraction.',
      tags: ['Python', 'AutoGPT', 'Vectors', 'PostgreSQL'],
      metrics: ['3x ROI Improvement', 'Active 24/7'],
      links: [
        { label: 'Case Study', icon: <ExternalLink size={16} />, url: '#' }
      ]
    },
    {
      title: 'Voice Intelligence Suite',
      category: 'ai',
      description: 'Real-time voice processing agent for customer support, capable of high-fidelity speech-to-text and intent-driven action execution.',
      tags: ['Whisper', 'TTS', 'HuggingFace', 'Redis'],
      metrics: ['40% reduction in TTR', 'Natural flow'],
      links: [
        { label: 'Live Demo', icon: <ExternalLink size={16} />, url: '#' }
      ]
    },
    {
      title: 'Neighbors Trailer',
      category: 'marketplace',
      description: 'Trailer rental marketplace for owners, featuring booking management, secure payments, and real-time availability.',
      tags: ['React Native', 'Node.js', 'MongoDB'],
      metrics: ['4.8★ rating', '1K+ downloads'],
      links: [
        { label: 'App Store', icon: <Apple size={16} />, url: 'https://apps.apple.com/us/app/neighbors-trailer-owner/id1667847016' },
        { label: 'Play Store', icon: <Play size={16} />, url: 'https://play.google.com/store/apps/details?id=com.neighbourstrailerowner&hl=en' }
      ]
    },
    {
      title: 'Tamkeen Care',
      category: 'services',
      description: 'Home services platform for repairs, maintenance, and bookings with streamlined service discovery and scheduling.',
      tags: ['React Native', 'REST APIs', 'Firebase'],
      metrics: ['35% faster bookings', 'High retention'],
      links: [
        { label: 'App Store', icon: <Apple size={16} />, url: 'https://apps.apple.com/kw/app/tamkeencare/id1546481161' }
      ]
    },
    {
      title: 'DVAGO',
      category: 'healthcare',
      description: 'Pharmacy and healthcare delivery platform with fast ordering, prescription support, and secure checkout.',
      tags: ['React Native', 'Node.js', 'Payments'],
      metrics: ['500K+ users', '4.6★ rating'],
      links: [
        { label: 'App Store', icon: <Apple size={16} />, url: 'https://apps.apple.com/pk/app/dvago-pharmacy-healthcare/id1603962269' },
        { label: 'Play Store', icon: <Play size={16} />, url: 'https://play.google.com/store/apps/details?id=com.dvago&hl=en' }
      ]
    },
    {
      title: 'Tamkeen Stores',
      category: 'commerce',
      description: 'Ecommerce experience for home appliances with secure checkout, product discovery, and delivery tracking.',
      tags: ['React Native', 'Commerce', 'Payments'],
      metrics: ['50K+ downloads', 'Reliable checkout'],
      links: [
        { label: 'App Store', icon: <Apple size={16} />, url: 'https://apps.apple.com/us/app/tamkeen-stores' },
        { label: 'Play Store', icon: <Play size={16} />, url: 'https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores&hl=en' }
      ]
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Portfolio</span>
          <h2 style={{ fontSize: '2.5rem' }}>Interactive mobile UI projects</h2>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`btn ${filter === cat.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="portfolio-grid" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="project-card glass"
                style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div className="project-preview" style={{ 
                  height: '200px', 
                  marginBottom: '1.5rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Styled placeholders for project media */}
                  <div style={{ 
                    width: '120px', 
                    height: '200px', 
                    background: `linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))`,
                    borderRadius: '20px',
                    transform: 'rotate(-10deg) translateY(20px)',
                    opacity: 0.3
                  }}></div>
                   <div style={{ 
                    width: '120px', 
                    height: '200px', 
                    background: `linear-gradient(45deg, var(--accent-secondary), var(--accent-primary))`,
                    borderRadius: '20px',
                    transform: 'rotate(10deg) translateY(30px)',
                    marginLeft: '-40px'
                  }}></div>
                </div>

                <div className="project-content" style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{project.description}</p>
                  
                  <div className="tags" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.6rem', 
                        background: 'rgba(56, 189, 248, 0.1)', 
                        color: 'var(--accent-primary)',
                        borderRadius: '99px',
                        fontWeight: 600
                      }}>{tag}</span>
                    ))}
                  </div>

                  <div className="metrics" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    {project.metrics.map(m => <span key={m}>{m}</span>)}
                  </div>
                </div>

                <div className="links" style={{ display: 'grid', gridTemplateColumns: project.links.length > 1 ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
                   {project.links.map(link => (
                      <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                        {link.icon} <span style={{ marginLeft: '0.35rem' }}>{link.label}</span>
                      </a>
                   ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <style jsx>{`
         @media (max-width: 480px) {
           .portfolio-grid { grid-template-columns: 1fr !important; }
         }
      `}</style>
    </section>
  );
};

export default Portfolio;

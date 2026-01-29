import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      role: 'MEAN Developer',
      company: 'JS Bank',
      period: 'Mar 2025 - Jul 2025',
      description: 'Built a responsive banking web app with Angular, Node.js, Express, and MongoDB.'
    },
    {
      role: 'Senior React Native Developer',
      company: 'Jon East Digital Media',
      period: 'Mar 2024 - Feb 2025',
      description: 'Led mobile development, improved app performance by 25%, and mentored junior engineers.'
    },
    {
      role: 'Senior React Native Developer',
      company: 'Logicose',
      period: 'Jul 2022 - Jan 2024',
      description: 'Delivered 15+ apps, optimized APIs, and reduced crash rates by 30%.'
    },
    {
      role: 'React Native Developer',
      company: 'LN Technologies',
      period: 'Apr 2020 - Jul 2022',
      description: 'Shipped features across 10+ apps and migrated web apps to mobile platforms.'
    },
    {
      role: 'Junior React Native Developer',
      company: 'Tamkeen International',
      period: 'Dec 2018 - Mar 2020',
      description: 'Built Android and iOS apps and supported automated testing and CI/CD adoption.'
    },
    {
      role: "Bachelor's Degree in Computer Science",
      company: 'Bahria University',
      period: '2016 - 2020',
      description: 'Strong foundations in software engineering and architecture.'
    }
  ];

  return (
    <section className="section" id="experience" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">Experience & Education</span>
          <h2 style={{ fontSize: '2.5rem' }}>Proven delivery with solid foundations</h2>
        </div>

        <div className="timeline" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Timeline center line */}
          <div 
            className="timeline-line"
            style={{ 
            position: 'absolute', 
            left: '20px', 
            top: 0, 
            bottom: 0, 
            width: '2px', 
            background: 'linear-gradient(180deg, var(--accent-primary), transparent)',
            opacity: 0.3
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {experiences.map((exp, index) => (
              <motion.div
                key={`${exp.role}-${index}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ position: 'relative', paddingLeft: '60px' }}
                className="timeline-item"
              >
                {/* Timeline Dot */}
                <div 
                  className="timeline-dot"
                  style={{ 
                    position: 'absolute', 
                    left: '11px', 
                    top: '5px', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-primary)',
                    border: '3px solid var(--accent-primary)',
                    zIndex: 2
                  }}
                ></div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{exp.role}</h3>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{exp.company}</p>
                      </div>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        padding: '0.35rem 0.75rem', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '0.5rem',
                        color: 'var(--text-secondary)'
                      }}>{exp.period}</span>
                   </div>
                   <p style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

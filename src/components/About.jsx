import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    { name: 'React Native', level: 95 },
    { name: 'Agentic AI & LLMs', level: 92 },
    { name: 'TypeScript & JavaScript', level: 94 },
    { name: 'Node.js & Express', level: 88 },
    { name: 'Firebase, REST & GraphQL', level: 86 },
  ];

  const stats = [
    { label: 'Years Experience', value: '6+' },
    { label: 'Mobile Apps Shipped', value: '30+' },
    { label: 'Avg. Performance Gains', value: '25%' },
  ];

  return (
    <section className="section" id="about" style={{ background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span className="eyebrow">About Me</span>
          <h2 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>Reliable partner for high-performance mobile delivery</h2>
        </div>

        <div className="about-grid grid-2" style={{ alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              I am a senior software engineer focused on building and
              optimizing high-performance mobile applications for iOS and
              Android. I specialize in React Native, TypeScript, and
              JavaScript, delivering smooth experiences that keep users
              engaged.
            </p>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              I have led development teams, integrated modern APIs, and
              shipped 30+ mobile apps with measurable performance and
              engagement improvements.
            </p>
            <div className="stats grid-3" style={{ marginTop: '3rem' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{stat.value}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="skills-container"
          >
            {skills.map((skill, index) => (
              <div key={skill.name} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
                  />
                </div>
              </div>
            ))}
            
            <div className="card glass" style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '1.5rem' }}>
               <h3 style={{ marginBottom: '1rem' }}>Specializations</h3>
               <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    Multi-Agent Systems
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    MERN Stack
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    React Native & TS
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    API Integrations
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    Performance Opt.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '10px' }}></span>
                    Web Migrations
                  </li>
               </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

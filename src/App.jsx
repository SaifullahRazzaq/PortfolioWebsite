import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial, Sphere, Environment, ContactShadows } from '@react-three/drei'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import Header from './components/Header'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Experience from './components/Experience'
import FAQ from './components/FAQ'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

import './index.css'

// 3D Scene Component
const Scene = ({ theme }) => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={theme === 'dark' ? 0.4 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <Stars 
            radius={100} 
            depth={50} 
            count={theme === 'dark' ? 5000 : 2000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[1.2, 64, 64]} position={[2, 1, -2]}>
              <MeshDistortMaterial
                color={theme === 'dark' ? "#38bdf8" : "#0ea5e9"}
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.1}
                metalness={0.8}
              />
            </Sphere>
          </Float>
          
          <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
             <mesh position={[-2, -1, -3]} rotation={[Math.PI / 4, 0, 0]}>
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <meshStandardMaterial color={theme === 'dark' ? "#818cf8" : "#6366f1"} roughness={0.3} metalness={0.8} />
             </mesh>
          </Float>

          <Environment preset="city" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark';
  })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (window.innerWidth <= 768 ? 70 : 80),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="app">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="scroll-bar" 
        style={{ 
          scaleX, 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          background: 'var(--accent-primary)', 
          transformOrigin: '0%', 
          zIndex: 1000 
        }} 
      />

      <Scene theme={theme} />
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main>
        {/* Hero Section */}
        <section className="section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: 'var(--nav-height)' }}>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="eyebrow">Senior Software Engineer & AI Architect</span>
              <h1 style={{ maxWidth: '1000px', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                Building <span style={{ 
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Agentic AI</span> & Mobile Products.
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '3.5rem', lineHeight: 1.6 }}>
                Hi, I'm Saifullah Razzaq. With 6+ years of experience in React Native and Agentic AI, 
                I help teams ship intelligent systems and polished mobile apps that grow retention and revenue.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>Hire Me</a>
                <a href="#portfolio" onClick={(e) => handleLinkClick(e, '#portfolio')} className="btn btn-ghost" style={{ padding: '0.875rem 2rem' }}>View Portfolio</a>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}
          >
             <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Scroll</span>
             <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 1.5, repeat: Infinity }}
             >
               <ChevronDown size={24} />
             </motion.div>
          </motion.div>
        </section>

        <About />
        <Services />
        <Portfolio />
        <Experience />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App

'use client'

import { useState, useCallback } from 'react'
import SplashScreen from '@/components/SplashScreen'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Advantages from '@/components/Advantages'
import About from '@/components/About'
import Features from '@/components/Features'
import TechStack from '@/components/TechStack'
import Security from '@/components/Security'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div
        className="transition-opacity duration-500"
        style={{ opacity: splashDone ? 1 : 0 }}
      >
        <Navbar />
        <main>
          <Hero />
          <Advantages />
          <About />
          <Features />
          <div className="h-px max-w-5xl mx-auto" style={{ background: '#e5eaf0' }} />
          <TechStack />
          <Security />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

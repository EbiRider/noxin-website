'use client'

import { motion, Variants } from 'framer-motion'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Fade up on scroll ──────────────────────────────────────────────────────
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0  },
}

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger container + item ───────────────────────────────────────────────
const staggerContainerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
}

export function StaggerGrid({ children, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: StaggerProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}

// ── Hero entrance (triggered by a `ready` signal, not scroll) ─────────────
interface HeroMotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  ready: boolean
}

export function HeroFadeUp({ children, delay = 0, className, ready }: HeroMotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

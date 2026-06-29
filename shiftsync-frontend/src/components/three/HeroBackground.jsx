import { motion } from 'framer-motion';

const FloatingOrb = ({ color, size, x, y, delay, duration }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-30"
    style={{
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      width: size,
      height: size,
      left: x,
      top: y,
    }}
    animate={{
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingOrb color="#3b82f6" size="400px" x="-10%" y="-20%" delay={0} duration={8} />
      <FloatingOrb color="#8b5cf6" size="350px" x="60%" y="60%" delay={1} duration={10} />
      <FloatingOrb color="#06b6d4" size="300px" x="70%" y="-10%" delay={2} duration={12} />
      <FloatingOrb color="#ec4899" size="250px" x="10%" y="70%" delay={0.5} duration={9} />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="rgba(255,255,255,0.03)" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  );
}

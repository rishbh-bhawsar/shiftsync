import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useTheme from '../../hooks/useTheme';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const AppLayout = () => {
  const location = useLocation();
  const { colors } = useTheme();

  return (
    <div style={{ backgroundColor: colors.bg }} className="flex min-h-screen transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <motion.main key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 p-6">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;

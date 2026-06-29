import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme';

const StatCard = ({ title, value, icon: Icon, color = 'blue', delay = 0 }) => {
  const { colors } = useTheme();
  const gradients = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ backgroundColor: colors.bgCard, borderColor: colors.border }} className="relative overflow-hidden rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ color: colors.textSecondary }} className="text-sm font-medium">{title}</p>
          <p style={{ color: colors.text }} className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div style={{ backgroundColor: colors.bgSecondary }} className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-50" />
    </motion.div>
  );
};

export default StatCard;

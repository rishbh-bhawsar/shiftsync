import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme';

const FillRateChart = ({ filled = 0, open = 0 }) => {
  const { colors } = useTheme();
  const data = [
    { name: 'Filled', value: filled },
    { name: 'Open', value: open },
  ];
  const chartColors = ['#3b82f6', colors.border];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.text }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[i] }} />
            <span style={{ color: colors.textSecondary }}>{item.name}</span>
            <span className="font-semibold" style={{ color: colors.text }}>{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export { FillRateChart };

import { STATUS_COLORS } from '../../../constants/shiftStatus';

const Badge = ({ status, children }) => {
  const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
      {children || status}
    </span>
  );
};

export default Badge;

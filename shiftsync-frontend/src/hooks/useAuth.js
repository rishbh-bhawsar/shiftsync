import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, accessToken, role } = useSelector((s) => s.auth);
  return { user, accessToken, role, isAuthenticated: !!accessToken && !!user };
};

export default useAuth;

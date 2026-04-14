import { Navigate } from 'react-router-dom';
import { useViewPreference } from '../hooks/useViewPreference';

export const HomeRedirect = () => {
  const [preference] = useViewPreference();
  return <Navigate to={`/${preference}`} replace />;
};

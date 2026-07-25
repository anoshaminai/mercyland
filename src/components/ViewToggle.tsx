import { Link, useLocation } from 'react-router-dom';
import { useViewPreference } from '../hooks/useViewPreference';

export const ViewToggle = () => {
  const location = useLocation();
  const [, setPreference] = useViewPreference();
  const isVoid = location.pathname === '/void';

  const target = isVoid ? '/termites' : '/void';
  const label = isVoid ? 'FLAT VIEW' : 'ENTER THE VOID';

  const handleClick = () => {
    setPreference(isVoid ? 'flat' : 'void');
  };

  return (
    <Link
      to={target}
      onClick={handleClick}
      className="view-toggle"
    >
      {label}
    </Link>
  );
};

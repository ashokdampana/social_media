import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { getApiErrorMessage } from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, 'Could not log out'));
    }
  };

  return (
    <header className="app-header">
      <nav className="app-header-nav">
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <div className="nav-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>Logo</h2>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

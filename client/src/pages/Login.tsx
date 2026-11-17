import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { userSchema, type UserInputType } from '../types/schema';
import { loginUserApi } from '../services/authApi';
import useAuthStore from '../store/useAuthStore';

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInputType>({
    resolver: zodResolver(userSchema),
  });

  const handleLogin = async (data: UserInputType) => {
    setErrorMessage(null);
    try {
      const res = await loginUserApi(data);
      setAuth(res.data.data);
      navigate('/feed');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not log in');
    }
  };

  return (
    <div className="form-login">
      <h2>Login</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}

      <form onSubmit={handleSubmit(handleLogin)}>
        <div>
          <label>Email</label>
          <input type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;

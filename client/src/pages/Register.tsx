import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { userSchema, type UserInput } from '../types/schema';
import useAuthStore from '../store/useAuthStore';
import { registerUserApi } from '../services/authApi'
import { getApiErrorMessage } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  });

  const handleRegister = async (formdata: UserInput) => {
    try {
      const res = await registerUserApi(formdata);
      setAuth(res.data.user);
      navigate('/feed');
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, 'Something went wrong'));
    }
  };

  return (
    <div className="form-register">
      <h2>Create Account</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}

      <form onSubmit={handleSubmit(handleRegister)}>

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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;

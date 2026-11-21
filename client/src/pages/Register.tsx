import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { userSchema, type UserInputType } from '../types/schema';
import useAuthStore from '../store/useAuthStore';
import { registerUserApi } from '../services/authApi';
import { getApiErrorMessage } from '../services/api';

function Register() {
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

  const handleRegister = async (formdata: UserInputType) => {
    setErrorMessage(null);
    try {
      const res = await registerUserApi(formdata);
      setAuth(res.data.data);
      navigate('/feed');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Could not create account'));
    }
  };

  return (
    <div className="form-register">
      <h2>Create Account</h2>
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

      <form className="auth-form" onSubmit={handleSubmit(handleRegister)}>

        <div className="form-field">
          <label>Email</label>
          <input type="email" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="form-field">
          <label>Password</label>
          <input type="password" {...register('password')} />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
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

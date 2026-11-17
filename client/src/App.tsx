
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

function App() {
  const { loading, error, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <div>Checking your session...</div>;


  return (
    <>
      <div className='App'>
        <Navbar />
        {error && (
          <p role="alert">
            {error} <button onClick={() => void checkAuth()}>Retry</button>
          </p>
        )}
        <Routes>
          <Route path='/' element={<div>Home page</div>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/feed' element={<Feed />} />

        </Routes>
        <section className='app-footer'></section>
      </div>
    </>
  )
}

export default App

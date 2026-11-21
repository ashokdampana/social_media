
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

  if (loading) return <div className="session-loading">Checking your session...</div>;


  return (
    <>
      <div className="app-shell" id="app">
        <Navbar />
        {error && (
          <p className="app-alert" role="alert">
            {error} <button onClick={() => void checkAuth()}>Retry</button>
          </p>
        )}
        <Routes>
          <Route path="/" element={<main className="home-page" id="home"><h1>Welcome</h1><p>Join the conversation and share what is on your mind.</p></main>} />
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

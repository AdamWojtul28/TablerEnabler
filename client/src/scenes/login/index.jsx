import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation (can be expanded for more complex logic)
    if (username === '' || password === '') {
      setErrorMessage('Both fields are required.');
      return;
    }

    // Simulate login logic
    if (username === 'admin' && password === 'password') {
      onLogin(true); // Trigger parent component's login callback
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="switch-form">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

      </form>
    </div>
  );
}

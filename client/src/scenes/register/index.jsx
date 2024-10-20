import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('student'); // Default to 'student' user
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation logic
    if (email === '' || password === '' || confirmPassword === '' || !accountType) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Registration logic here (API call, etc.) !!!********$$$%#%#%#&#$%%&!!!!!!!!!
    console.log('User Registered:', { email, password, accountType });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="student"
                checked={accountType === 'student'}
                onChange={(e) => setAccountType(e.target.value)}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="organization"
                checked={accountType === 'organization'}
                onChange={(e) => setAccountType(e.target.value)}
              />
              Organization
            </label>
          </div>
        </div>

        <button type="submit" className="register-button">Register</button>

        <p className="switch-form">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

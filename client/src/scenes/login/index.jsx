import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ onLogin }) {
  const [user, setUser] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { identifier, password, role });

    if (identifier === '' || password === '') {
      setErrorMessage('Both fields are required.');
      console.log("Validation failed: Both fields are required.");
      return;
    }

    console.log("Sending request to server...");

    try {
      const response = await fetch('http://localhost:5001/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role })
      });

      console.log("Received response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Parsed result:", result);

        // Check if token is present in response
        if (result.data && result.user) {
          localStorage.setItem('token', result.data); // Store token for authentication
          console.log("Login successful:", result.user);

          // Set success message with user's name and email
          setSuccessMessage(`Login successful! Welcome, ${result.user.name} (${result.user.email})`);
          setErrorMessage(''); // Clear any previous error

          localStorage.setItem('email', result.user.email);
          
          // Trigger the login success callback to update app state
          if (onLogin) {
            onLogin(true);
          }

          // Redirect to congratulations page after successful login
          navigate('/congrats');
        } else {
          setErrorMessage("Login successful, but user data is missing.");
          console.log("Error: JWT token or user details missing in response.");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An unknown error occurred.");
        console.log("Login failed:", errorData.message || "Unknown error");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <div className="form-group">
          <label>Account Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="organization"
                checked={role === 'organization'}
                onChange={() => setRole('organization')}
              />
              Organization
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="identifier">
            {role === 'student' ? 'Email' : 'Organization Name'}
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={`Enter your ${role === 'student' ? 'email' : 'organization name'}`}
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

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { identifier, password });

    if (identifier === '' || password === '') {
      setErrorMessage('Both fields are required.');
      console.log("Validation failed: Both fields are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }), // Only identifier and password
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Parsed result:", result);

        // Check if token and user data are present
        if (result.data && result.user) {
          localStorage.setItem('token', result.data); // Store token
          localStorage.setItem('user', JSON.stringify(result.user)); // Store user details

          // Pull the role from the user data provided by the backend
          const role = result.user.role; 
          localStorage.setItem('role', role); // Save the role for future use
          console.log("Role stored in localStorage:", role);



          // Store organization name in localStorage if role is "organization"
          if (role === 'organization' && result.user.name) {
            const orgName = result.user.name; 
            localStorage.setItem('organizationName', orgName);
            console.log("Organization name stored in localStorage:", orgName);
          }
          else {
            console.log("Role is not 'organization' or organization name is missing.");
          }
          

          

          // Set success message with user's name and email
          setSuccessMessage(`Login successful! Welcome, ${result.user.name} (${result.user.email})`);
          setErrorMessage(''); // Clear any previous error

          // Trigger login callback to update app state
          if (onLogin) {
            onLogin(true);
          }

          // Redirect to congratulations page after successful login
          navigate('/congrats');
          window.location.reload();
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
          <label htmlFor="identifier">Email</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
        
        <button type="submit" className="login-button">Login</button>
        <p className="switch-form">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

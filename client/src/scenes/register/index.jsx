import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    ufl_email: '',
    password: '',
    role: '',
    name: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log("Field updated:", input.name, input.value); // Log field changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ufl_email, password, role, name, first_name, last_name } = data;
    console.log("Submitting data:", data); // Log entire data on submit

    if ((role === 'student' && (ufl_email === '' || password === '' || first_name === '' || last_name === '')) ||
        (role === 'organization' && (name === '' || password === ''))) {
      setErrorMessage('All fields are required.');
      console.log("Validation failed: Missing required fields");
      return;
    }

    const submissionData = role === 'student' 
      ? { first_name, last_name, ufl_email, password, role } 
      : { name, password, role };

    console.log("Sending submissionData:", submissionData); // Log the data being sent

    try {
      const endpoint = role === 'student' ? 'http://localhost:5001/students' : 'http://localhost:5001/organizations';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const contentType = response.headers.get("content-type");
      console.log("Response received:", response.status); // Log response status

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        localStorage.setItem('token', result.data);
        navigate('/map');
      } else if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.message);
        setErrorMessage(errorData.message);
      } else {
        console.error('Unexpected error response:', await response.text());
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-group">
          <label>Account Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={data.role === 'student'}
                onChange={handleChange}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="organization"
                checked={data.role === 'organization'}
                onChange={handleChange}
              />
              Organization
            </label>
          </div>
        </div>

        {data.role === 'student' && (
          <>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                value={data.first_name}
                onChange={handleChange}
                placeholder="Enter your First Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                value={data.last_name}
                onChange={handleChange}
                placeholder="Enter your Last Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="UF Email"
                name="ufl_email"
                value={data.ufl_email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </>
        )}
        
        {data.role === 'organization' && (
          <>
            <div className="form-group">
              <label htmlFor="name">Organization Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter your organization name"
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="register-button">Register</button>

        <p className="switch-form">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

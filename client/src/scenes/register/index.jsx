import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [data, setData] = useState({
   
    first_name: '',
    last_name: '',
    ufl_email: '',
    password: 'student',
    role: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { ufl_email, password, role } = data;
  
    if (ufl_email === '' || password === '' || !role) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/students', { // Change to /api/students
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
  
      const contentType = response.headers.get("content-type");
  
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
    console.log('User Registered:', { ufl_email, password, role });
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
              <label htmlFor="name">Name</label>
              <input
                type="name"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          </>
          )
        }
        
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

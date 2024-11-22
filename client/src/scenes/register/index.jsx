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
    name: '',
    description: '',
    officers: '',
    profile_image: null, // New field for image
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    const value = input.type === 'file' ? input.files[0] : input.value; // Handle file input
    setData({ ...data, [input.name]: value });
    console.log("Field updated:", input.name, value); // Log field changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ufl_email, password, role, name, description, officers, first_name, last_name, profile_image } = data;
    console.log("Submitting data:", data); // Log entire data on submit

    if (
      (role === 'student' && (ufl_email === '' || password === '' || first_name === '' || last_name === '')) ||
      (role === 'organization' && (name === '' || description === '' || officers === ''))
    ) {
      setErrorMessage('All fields are required.');
      console.log("Validation failed: Missing required fields");
      return;
    }

    const submissionData = new FormData(); // Use FormData for file uploads
    if (role === 'student') {
      submissionData.append('first_name', first_name);
      submissionData.append('last_name', last_name);
      submissionData.append('ufl_email', ufl_email);
      submissionData.append('password', password);
      submissionData.append('role', role);
    } else {
      submissionData.append('name', name);
      submissionData.append('description', description);
      submissionData.append('officers', officers);
      if (profile_image) submissionData.append('profile_image', profile_image); // Add image if provided
    }

    try {
      const endpoint =
        role === 'student'
          ? 'http://localhost:5001/students'
          : 'http://localhost:5001/pending-organizations';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: submissionData, // Send FormData directly
      });

      console.log('Response received:', response.status); // Log response status

      if (response.ok) {
        const result = await response.json();
        console.log('Request successful:', result);

        if (role === 'student') {
          localStorage.setItem('token', result.data);
          navigate('/map');
        } else {
          setSuccessMessage(
            'Your application to register an organization has been sent successfully. When it is approved, officers can edit the organization profile and create tabling events. You can log in or create an account with any email provided in the form and start using the app.'
          );
          setErrorMessage('');
        }
      } else {
        const errorData = await response.json();
        console.error('Request failed:', errorData.message);
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error during request:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Register</h2>

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
              <label htmlFor="ufl_email">Email</label>
              <input
                type="email"
                id="ufl_email"
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

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Enter a brief description of your organization"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="officers">Officers' Emails (comma-separated)</label>
              <label htmlFor="officers" className="officers-info">
              <span className="icon">ℹ️</span>
              Officers can edit organization information and create tabling events.
            </label>              
            <input
                type="text"
                id="officers"
                name="officers"
                value={data.officers}
                onChange={handleChange}
                placeholder="Enter officers' emails"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile_image">Upload Organization Image (optional)</label>
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                onChange={handleChange}
              />
            </div>
          </>
        )}


        <button type="submit" className="register-button">
          {data.role === 'organization' ? 'Send Request' : 'Register'}
        </button>

        <p className="switch-form">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

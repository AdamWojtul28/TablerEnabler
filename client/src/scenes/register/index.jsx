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
    officers: [], // Array of "email:position" strings
    officerEmail: '',
    officerPosition: 'Board Member',
    profile_image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const initialFormState = {
    first_name: '',
    last_name: '',
    ufl_email: '',
    password: '',
    role: '',
    name: '',
    description: '',
    officers: [],
    officerEmail: '',
    officerPosition: 'Board Member',
    profile_image: null,
  };

  const handleChange = ({ currentTarget: input }) => {
        const value = input.type === 'file' ? input.files[0] : input.value;
        setData((prev) => ({
          ...prev,
          [input.name]: value,
        }));
      };

  // const handleAddEmail = (e) => {
  //   e.preventDefault();
  //   const email = data.officerEmail.trim();
  //   const position = data.officerPosition.trim() || 'Board Member';

  //   // Validate email format
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     alert('Please enter a valid email address.');
  //     return;
  //   }

  //   const officerEntry = `${email}:${position}`;

  //   if (!data.officers.includes(officerEntry)) {
  //     setData((prev) => ({
  //       ...prev,
  //       officerEmail: '',
  //       officerPosition: 'Board Member',
  //       officers: [...prev.officers, officerEntry],
  //     }));
  //   } else {
  //     alert('Officer is already added.');
  //   }
  // };


  const handleAddEmail = (e) => {
    e.preventDefault();
    const email = data.officerEmail.trim();
    const position = data.officerPosition.trim() || 'Board Member';
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    const officerEntry = `${email}:${position}`;
  
    if (!data.officers.includes(officerEntry)) {
      setData((prev) => {
        const updatedOfficers = [...prev.officers, officerEntry];
        console.log("Adding officer:", officerEntry);
        console.log("Updated officers array:", updatedOfficers);
        return {
          ...prev,
          officerEmail: '',
          officerPosition: 'Board Member',
          officers: updatedOfficers,
        };
      });
    } else {
      alert('Officer is already added.');
    }
  };
  

  const handleRemoveEmail = (index) => {
    setData((prev) => {
      const updatedOfficers = prev.officers.filter((_, i) => i !== index);
      console.log("Removing officer at index:", index);
      console.log("Updated officers array:", updatedOfficers);
      return {
        ...prev,
        officers: updatedOfficers,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   

  
    // Extract data values
    const { first_name, last_name, ufl_email, password, role, name, description, officers, profile_image } = data;
  

    console.log("Current data.officers before submission:", data.officers);

    
    const submissionData = new FormData();
  
    if (role === 'student') {
      submissionData.append('first_name', first_name);
      submissionData.append('last_name', last_name);
      submissionData.append('ufl_email', ufl_email);
      submissionData.append('password', password);
      submissionData.append('role', role);
  
    } else if (role === 'organization') {
      submissionData.append('name', name);
      submissionData.append('description', description);
      officers.forEach((officer) => submissionData.append("officers[]", officer));
      if (profile_image) submissionData.append('profile_image', profile_image);
    } else {
      setErrorMessage("Please select a role.");
      return;
    }
  
    console.log("Data before submission:");
    for (let [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      const endpoint =
        role === 'student'
          ? 'http://localhost:5001/general/student-profile'
          : 'http://localhost:5001/general/pending-organization-profile';
  
      const response = await fetch(endpoint, {
        method: "POST",
        body: submissionData,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Read response body ONCE
        console.error("Error:", errorData.message);
        setErrorMessage(errorData.message || "An unexpected error occurred.");
      } else {
        const successData = await response.json(); // Read response body ONCE
        console.log("Registration successful:", successData);

         // Save the user token to localStorage to keep the user logged in
        if (successData.token) {
          localStorage.setItem("token", successData.token);
        }

        setErrorMessage("");
        // Show a success message
        if (role === 'student') {
          setSuccessMessage(
            <>
              Registration successful! Please login now{' '}
              <Link to="/login" style={{ color: '#007BFF', textDecoration: 'underline' }}>
                here
              </Link>
              !
            </>
          );
          
        }
        else {
          setSuccessMessage('Your application to register an organization has been sent successfully. When it is approved, officers can edit the organization profile and create tabling events. You can log in or create an account with any email provided in the form and start using the app.'
        );
        }


        setErrorMessage('');
        // Reset form after successful submission
        setData(initialFormState);
        
      }
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  
  

  return (
    <div className="page-container">
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
                  onChange={() => setData((prev) => ({ ...prev, role: 'student' }))}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="organization"
                  checked={data.role === 'organization'}
                  onChange={() => setData((prev) => ({ ...prev, role: 'organization' }))}
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
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  placeholder="Enter a brief description of your organization"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="officers">Officers' Emails</label>
                <div className="email-input-container stacked">
                  <input
                    type="text"
                    id="officerEmail"
                    name="officerEmail"
                    value={data.officerEmail || ''}
                    onChange={handleChange}
                    placeholder="Enter officer's email"
                  />
                  <input
                    type="text"
                    name="officerPosition"
                    value={data.officerPosition || ''}
                    onChange={(e) => setData({ ...data, officerPosition: e.target.value })}
                    placeholder="Enter position (default: Board Member)"
                  />
                  <button type="button" onClick={handleAddEmail} className="add-email-button">
                    Add
                  </button>
                </div>
                <ul className="officer-email-list">
                  {data.officers.map((officer, index) => {
                    const [email, position] = officer.split(':');
                    return (
                      <li key={index}>
                        {email} ({position})
                        <button type="button" onClick={() => handleRemoveEmail(index)} className="remove-email-button">
                          ✖
                        </button>
                      </li>
                    );
                  })}
                </ul>
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
    </div>
  );
}

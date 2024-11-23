// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Register.css';

// export default function Register() {
//   const [data, setData] = useState({
//     first_name: '',
//     last_name: '',
//     ufl_email: '',
//     password: '',
//     role: '',
//     name: '',
//     description: '',
//     officers: [], // Store officers as an array
//     officerEmail: '', // Current officer email being typed
//     officerPosition: 'Board Member',
//     profile_image: null,
//   });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = ({ currentTarget: input }) => {
//     const value = input.type === 'file' ? input.files[0] : input.value;
//     setData((prev) => ({
//       ...prev,
//       [input.name]: value,
//     }));
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     const email = data.officerEmail.trim();

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       alert('Please enter a valid email address.');
//       return;
//     }

//     // Add email and position as a pair to the list if not already added
//     if (!data.officers.find((officer) => officer.email === email)) {
//       setData((prev) => ({
//         ...prev,
//         officerEmail: '',
//         officerPosition: 'Board Member', // Reset to default
//         officers: [...prev.officers, email],
//       }));
//     } else {
//       alert('Email is already added.');
//     }
//   };

//   const handleRemoveEmail = (index) => {
//     setData((prev) => ({
//       ...prev,
//       officers: prev.officers.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { ufl_email, password, role, name, description, officers, first_name, last_name, profile_image } = data;

//     if (
//       (role === 'student' && (ufl_email === '' || password === '' || first_name === '' || last_name === '')) ||
//       (role === 'organization' && (name === '' || officers.length === 0))
//     ) {
//       setErrorMessage('All fields are required.');
//       return;
//     }

//     const submissionData = new FormData();
//     if (role === 'student') {
//       submissionData.append('first_name', first_name);
//       submissionData.append('last_name', last_name);
//       submissionData.append('ufl_email', ufl_email);
//       submissionData.append('password', password);
//       submissionData.append('role', role);
//     } else {
//       submissionData.append('name', name);
//       submissionData.append('description', description);
//       submissionData.append('officers', JSON.stringify(officers));
//       if (profile_image) submissionData.append('profile_image', profile_image);
//     }

//     try {
//       const endpoint =
//         role === 'student'
//           ? 'http://localhost:5001/students'
//           : 'http://localhost:5001/pending-organizations';

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         body: submissionData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         if (role === 'student') {
//           localStorage.setItem('token', result.data);
//           navigate('/map');
//         } else {
//           setSuccessMessage(
//             'Your application to register an organization has been sent successfully. When it is approved, officers can edit the organization profile and create tabling events. You can log in or create an account with any email provided in the form and start using the app.'
//           );
//           setErrorMessage('');
//         }
//       } else {
//         const errorData = await response.json();
//         setErrorMessage(errorData.message || 'An unexpected error occurred.');
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="page-container">

//     <div className="register-container">
//       <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
//         <h2>Register</h2>

//         {errorMessage && <div className="error-message">{errorMessage}</div>}
//         {successMessage && <div className="success-message">{successMessage}</div>}

//         <div className="form-group">
//           <label>Account Type</label>
//           <div className="radio-group">
//             <label>
//               <input
//                 type="radio"
//                 name="role"
//                 value="student"
//                 checked={data.role === 'student'}
//                 onChange={handleChange}
//               />
//               Student
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="role"
//                 value="organization"
//                 checked={data.role === 'organization'}
//                 onChange={handleChange}
//               />
//               Organization
//             </label>
//           </div>
//         </div>
        

//         {data.role === 'student' && (
//           <>
//             <div className="form-group">
//             <label htmlFor="officers" className="officers-info">
//               <span className="icon">ℹ️</span>
//               If you are an officer, please use the same email address you submitted in the organization registration form.
//               </label> 
//               <label htmlFor="first_name">First Name</label>
//               <input
//                 id="first_name"
//                 name="first_name"
//                 value={data.first_name}
//                 onChange={handleChange}
//                 placeholder="Enter your First Name"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="last_name">Last Name</label>
//               <input
//                 id="last_name"
//                 name="last_name"
//                 value={data.last_name}
//                 onChange={handleChange}
//                 placeholder="Enter your Last Name"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="ufl_email">Email</label>
//               <input
//                 type="email"
//                 id="ufl_email"
//                 name="ufl_email"
//                 value={data.ufl_email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//               />
//             </div>
//           </>
//         )}

//         {data.role === 'organization' && (
//           <>
//             <div className="form-group">
//               <label htmlFor="name">Organization Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={data.name}
//                 onChange={handleChange}
//                 placeholder="Enter your organization name"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="description">Description (optional)</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={data.description}
//                 onChange={handleChange}
//                 placeholder="Enter a brief description of your organization"
//               ></textarea>
//             </div>
//             <div className="form-group">
//             <label htmlFor="officers" className="officers-info">
//             <span className="icon">ℹ️</span>
//             Officers can edit organization information and create tabling events.
//             </label> 
//               <label htmlFor="officers">Officers' Emails</label>
//               <div className="email-input-container">
//                 <input
//                   type="text"
//                   id="officers"
//                   name="officerEmail"
//                   value={data.officerEmail || ''}
//                   onChange={handleChange}
//                   placeholder="Enter officer's email and press 'Add' or 'Enter'"
//                   onKeyDown={(e) => e.key === 'Enter' && handleAddEmail(e)}
//                 />

//                 <input
//                     type="text"
//                     name="officerPosition"
//                     value={data.officerPosition || ''}
//                     onChange={(e) => setData({ ...data, officerPosition: e.target.value })}
//                     placeholder="Enter position (default: Board Member)"
//                   />


//                 <button type="button" onClick={handleAddEmail} className="add-email-button">
//                   Add
//                 </button>
//               </div>
//               <ul className="officer-email-list">
//                 {data.officers.map((email, index) => (
//                   <li key={index}>
//                     {email}
//                     <button type="button" onClick={() => handleRemoveEmail(index)} className="remove-email-button">
//                       ✖
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="form-group">
//               <label htmlFor="profile_image">Upload Organization Image (optional)</label>
//               <input
//                 type="file"
//                 id="profile_image"
//                 name="profile_image"
//                 onChange={handleChange}
//               />
//             </div>
//           </>
//         )}

//         <button type="submit" className="register-button">
//           {data.role === 'organization' ? 'Send Request' : 'Register'}
//         </button>

//         <p className="switch-form">
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </form>
//     </div>
//     </div>

    
//   );
// }


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
    officers: [], // Store officers as an array of objects { email, position }
    officerEmail: '', // Current officer email being typed
    officerPosition: 'Board Member', // Default position
    profile_image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    const value = input.type === 'file' ? input.files[0] : input.value;
    setData((prev) => ({
      ...prev,
      [input.name]: value,
    }));
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    const email = data.officerEmail.trim();
    const position = data.officerPosition.trim() || 'Board Member'; // Use default if position is empty

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Add email and position as a pair to the list if not already added
    if (!data.officers.find((officer) => officer.email === email)) {
      setData((prev) => ({
        ...prev,
        officerEmail: '',
        officerPosition: 'Board Member', // Reset position field to default
        officers: [...prev.officers, { email, position }],
      }));
    } else {
      alert('Email is already added.');
    }
  };

  const handleRemoveEmail = (index) => {
    setData((prev) => ({
      ...prev,
      officers: prev.officers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ufl_email, password, role, name, description, officers, first_name, last_name, profile_image } = data;

    if (
      (role === 'student' && (ufl_email === '' || password === '' || first_name === '' || last_name === '')) ||
      (role === 'organization' && (name === '' || officers.length === 0))
    ) {
      setErrorMessage('All fields are required.');
      return;
    }

    const submissionData = new FormData();
    if (role === 'student') {
      submissionData.append('first_name', first_name);
      submissionData.append('last_name', last_name);
      submissionData.append('ufl_email', ufl_email);
      submissionData.append('password', password);
      submissionData.append('role', role);
    } else {
      submissionData.append('name', name);
      submissionData.append('description', description);
      submissionData.append('officers', JSON.stringify(officers));
      if (profile_image) submissionData.append('profile_image', profile_image);
    }

    try {
      const endpoint =
        role === 'student'
          ? 'http://localhost:5001/students'
          : 'http://localhost:5001/pending-organizations';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: submissionData,
      });

      if (response.ok) {
        const result = await response.json();
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
        setErrorMessage(errorData.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
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
                <label htmlFor="officers" className="officers-info">
                  <span className="icon">ℹ️</span> Officers can edit organization information and create tabling events.
                </label>
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
                  {data.officers.map((officer, index) => (
                    <li key={index}>
                      {officer.email} ({officer.position})
                      <button type="button" onClick={() => handleRemoveEmail(index)} className="remove-email-button">
                        ✖
                      </button>
                    </li>
                  ))}
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

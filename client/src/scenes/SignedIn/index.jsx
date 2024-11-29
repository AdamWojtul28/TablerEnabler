import React, { useEffect, useState } from 'react';

const Congrats = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role'); // Retrieve role from localStorage
    const orgs = JSON.parse(localStorage.getItem('organizations')); // Retrieve organizations from localStorage
    console.log('User data from localStorage:', user);
    console.log('Role from localStorage:', role);
    console.log('Organizations from localStorage:', orgs);

    if (user && user.name) {
      setUserName(user.name);
      setUserRole(role || "N/A"); // Fallback to "N/A" if role is missing
    } else {
      console.log("User data is missing or incomplete in localStorage");
    }

    // If the user is an officer, set the organizations state
    if (role === 'officer' && Array.isArray(orgs)) {
      setOrganizations(orgs);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>You're logged in, congratulations!</h1>
      <p style={{ color: '#ff8000', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Welcome to the application, <strong>{userName || "Guest"}</strong>!
      </p>
      <p style={{ color: '#ff8000', fontSize: '1.4rem', fontStyle: 'italic' }}>
        Your role: <em>{userRole}</em>
      </p>

      {userRole === 'officer' && organizations.length > 0 && (
        <div style={{ marginTop: '0px' }}>
          <h2 style={{ color: '#ff8000' }}>Your Organizations:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {organizations.map((org) => (
              <li
                key={org._id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  margin: '10px auto',
                  width: '50%',
                  textAlign: 'left',
                }}
              >
                <strong>Name:</strong> {org.name}
                <br />
                <strong>Role:</strong> {org.position}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Congrats;

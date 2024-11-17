import React, { useEffect, useState } from 'react';

const Congrats = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role'); // Retrieve role from localStorage
    console.log('User data from localStorage:', user);
    console.log('Role from localStorage:', role);

    if (user && user.name) {
      setUserName(user.name);
      setUserRole(role || "N/A"); // Fallback to "N/A" if role is missing
    } else {
      console.log("User data is missing or incomplete in localStorage");
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
  </div>
  );
};

export default Congrats;

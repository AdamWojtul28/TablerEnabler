import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';


function App() {
  const user = localStorage.getItem("token");

  return (
      <Routes>
          {user && <Route path="/" exact element={<Main />} />}
          <Route path="/main" element={<MainPage />} />
      </Routes>
  );
}



function MainPage() {
  const [open, setOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

   const handleTicketEditFormClose = (e) => {
      if (e.target.id === "close-ticketEdit-container" || e.target.className === "close") {
          setShowEditForm(false);
      }
  };

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          const decodedToken = jwtDecode(token);
          console.log("Decoded Token:", decodedToken); // Log the decoded token
          if (decodedToken.firstName && decodedToken.lastName) {
              setUserName(`${decodedToken.firstName} ${decodedToken.lastName}`);
              setUserRole(decodedToken.role); // Set the user role
              setIsAdmin(decodedToken.role === 'admin'); // Set isAdmin based on the role
          } else {
              setUserName("User"); // Fallback if the token does not have the required fields
          }
      }
  }, []);

  const handleModalClose = (e) => {
      if (e.target.id === "close-modal-container") setShowModal(false);
  };

  const handleRowClick = (ticket) => {
      if (userRole === 'admin' || userRole === 'employee') {
          setShowEditForm(true);
          setSelectedTicket(ticket);
      } else {
          console.log("You can't edit the ticket");
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
  };

  const addEmployee = () => {
      navigate('/manage_employees');
  };

  
  const goToMessages = () => {
      navigate('/messages');
  };

  const goToCalendar = () => {
      navigate('/calendar');
  };

  const createTicketButton = <button onClick={() => setShowModal(true)} className="w-full">create ticket</button>;
  const viewTicketsButton = <button onClick={() => setShowTickets(true)}>Tickets in Calendar</button>;

  const Menus = [
      { title: "Dashboard", src: chartFillImg },
      { title: "Messages", src: chatImg, onClick: goToMessages },
      { title: userName, src: userImg, gap: true },
      (userRole === 'admin' || userRole === 'employee') && { title: "Calendar", src: calendarImg, onClick: goToCalendar }, // Allow both admin and employee
      { title: "Search", src: searchImg },
      { title: "Ticket Analytics", src: chartImg },
      { title: "Files ", src: folderImg, gap: true },
      { title: "Setting", src: settingImg },
      { title: createTicketButton, src: plusImg },
      userRole === 'admin' && { title: "Manage Employees", src: null, onClick: addEmployee }, // Conditionally add the Add Employee button
      { title: "Logout", src: null, onClick: handleLogout },
  ].filter(Boolean); // Filter out false values

  return (
      <div className="flex">
          <div className={` ${open ? "w-72" : "w-20 "} bg-dark-purple h-screen p-5 pt-8 relative duration-300`}>
              <img
                  src={controlImg}
                  className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full  ${!open && "rotate-180"}`}
                  onClick={() => setOpen(!open)}
              />
              <div className="flex gap-x-4 items-center">
                  <img
                      src={logoImg}
                      className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                  />
                  <h1
                      className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}
                  >
                      {userName}
                  </h1>
              </div>
              <ul className="pt-6">
                  {Menus.map((Menu, index) => (
                      <li
                          key={index}
                          className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
                              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"} `}
                          onClick={Menu.onClick ? Menu.onClick : null}
                      >
                          {Menu.src && <img src={Menu.src} />}
                          <span className={`${!open && "hidden"} origin-left duration-200`}>
                              {Menu.title}
                          </span>
                      </li>
                  ))}
              </ul>
          </div>
          <div className="h-screen flex-1 p-7">
              <h1 className="text-2xl font-semibold ">Main Page</h1>
              <TicketsPage onRowClick={handleRowClick} />
          </div>
          <TicketCreationForm onClose={handleModalClose} visible={showModal} />
          <TicketEditForm onClose={handleTicketEditFormClose} visible={showEditForm} ticket={selectedTicket} isAdmin={isAdmin} /> {/* Pass isAdmin prop */}
      </div>
  );
}

export default App;
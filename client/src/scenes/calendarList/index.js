import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './CalendarList.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [theme, setTheme] = useState(document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const calendarRef = useRef(null); // Reference for FullCalendar instance

  // Generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:5001/general/tabling-reservations');
        const data = await response.json();

        const formattedEvents = data.map(event => ({
          title: event.org_name,
          start: event.start_time,
          end: event.end_time,
          description: event.description,
          backgroundColor: getRandomColor(), // Assign a random color to each event
          borderColor: getRandomColor(), // Optional: border color
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.querySelector('.fullscreen-calendar')?.dispatchEvent(new Event('resize'));
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [theme]);

  return (
    <FullCalendar
      ref={calendarRef} // Attach the reference here
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      headerToolbar={
        isMobile
          ? {
              left: 'prev,next today',
              center: 'title',
              right: 'customDatePicker',
            }
          : {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }
      }
      customButtons={{
        customDatePicker: {
          text: 'Select Other Date',
          click: () => {
            const calendarApi = calendarRef.current.getApi(); // Correctly get the calendarApi
            const selectedDate = prompt('Enter a date (YYYY-MM-DD):');
            if (selectedDate) {
              calendarApi.gotoDate(selectedDate); // Use the API to navigate to the selected date
              if (window.innerWidth < 768) {
                calendarApi.changeView('timeGridDay'); // Force the day view for mobile
              }
            }
          },
        },
      }}
      
      nowIndicator={true}
      editable={false}
      selectable={true}
      height={window.innerWidth < 768 ? 'calc(100vh - 100px)' : '100%'}
      events={events}
      eventClick={(info) => {
        alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
      }}
    />
  );
};

export default CalendarComponent;

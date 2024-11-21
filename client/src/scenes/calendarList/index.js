import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import './CalendarList.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [theme, setTheme] = useState(document.body.classList.contains('dark-mode') ? 'dark' : 'light');


  // Refresh the page once when the component mounts
  useEffect(() => {
    if (!sessionStorage.getItem('refreshed')) {
      sessionStorage.setItem('refreshed', 'true');
      window.location.reload();
    }
  }, []);
  
  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:5001/general/tabling-reservations');
        const data = await response.json();

        console.log("Fetched Reservations: ", data);

        const formattedEvents = data.map(event => ({
          title: event.org_name,
          start: event.start_time,
          end: event.end_time,
          description: event.description,
        }));

        console.log("Formatted Events: ", formattedEvents);

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  // Recalculate layout when theme changes
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      document.querySelector('.fullscreen-calendar')?.dispatchEvent(new Event('resize'));
    };

    // Trigger resize on window resize
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay',
      }}
      nowIndicator={true}
      editable={true}
      selectable={true}
      height={window.innerWidth < 768 ? 'calc(100vh - 100px)' : '100%'}
      views={{
        resourceTimeGridDay: {
          resources: [
            { id: '1', title: 'Table 1' },
            { id: '2', title: 'Table 2' },
            { id: '3', title: 'Table 3' },
          ],
        },
      }}
      events={events}
      resourceAreaHeaderContent="Tables"
      eventClick={(info) => {
        alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
      }}
    />
  );
};

export default CalendarComponent;

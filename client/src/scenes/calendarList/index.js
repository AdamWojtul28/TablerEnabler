import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import './CalendarList.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

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

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
      initialView="timeGridWeek" // Start with the week view
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay', // Include the day view
      }}
      nowIndicator={true}
      editable={true}
      selectable={true}
      resources={[
        { id: '1', title: 'Table 1' },
        { id: '2', title: 'Table 2' },
        { id: '3', title: 'Table 3' },
      ]}
      events={events}
      resourceAreaHeaderContent="Tables"
      eventClick={(info) => {
        alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
      }}
    />
  );
};

export default CalendarComponent;

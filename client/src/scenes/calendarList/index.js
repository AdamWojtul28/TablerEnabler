import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './CalendarList.css';

const CalendarComponent = () => {
  return (
<<<<<<< HEAD
    <div style={{fontWeight: 'bold', fontSize: '32px'}}>CalendarList page here</div>
  )
}
=======
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek" // Use timeGrid view to show the now indicator
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      nowIndicator={true} // Show the current time indicator
      editable={true}
      selectable={true}
    />
  );
};
>>>>>>> 5ae21d4ed2a164b38db65c1a0a122995717c10b0

export default CalendarComponent;

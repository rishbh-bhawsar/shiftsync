import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const ShiftCalendar = ({ shifts = [] }) => {
  const events = shifts.map((shift) => ({
    id: shift.id,
    title: `${shift.title} - ${shift.facilityName}`,
    start: `${shift.date}T${shift.startTime}`,
    end: `${shift.date}T${shift.endTime}`,
    backgroundColor: shift.status === 'filled' ? '#3b82f6' : shift.status === 'completed' ? '#22c55e' : '#f59e0b',
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={events}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
      />
    </div>
  );
};

export default ShiftCalendar;

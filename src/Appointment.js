import React from 'react';

const waktuAppointmentHariItu = mulaiPada => {
  const [jam, menit] = new Date(mulaiPada).toTimeString().split(':');
  return `${jam}:${menit}`;
};

export const Appointment = ({ customer: { namaDepan } }) => (
  <div>{namaDepan}</div>
);

export const AppointmentsDayView = ({ appointments }) => (
  <div id="appointmentsDayView">
    <ol>
      {appointments.map(appointment => (
        <li key={appointment.mulaiPada}>
          {waktuAppointmentHariItu(appointment.mulaiPada)}
        </li>
      ))}
    </ol>
    {appointments.length === 0 ? (
      <p>Tidak ada appointment untuk hari ini.</p>
    ) : (
      <Appointment {...appointments[0]} />
    )}
  </div>
);

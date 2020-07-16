import React, { useState } from 'react';

const waktuAppointmentHariItu = mulaiPada => {
  const [jam, menit] = new Date(mulaiPada).toTimeString().split(':');
  return `${jam}:${menit}`;
};

export const Appointment = ({ customer: { namaDepan } }) => (
  <div>{namaDepan}</div>
);

export const AppointmentsDayView = ({ appointments }) => {
  const [appointmentDipilih, setAppointmentDipilih] = useState(0);

  return (
    <div id="appointmentsDayView">
      <ol>
      {appointments.map((appointment, i) => (
        <li key={appointment.mulaiPada}>
          <button type="button" onClick={() => setAppointmentDipilih(i)}>
            {waktuAppointmentHariItu(appointment.mulaiPada)}
          </button>
        </li>))}
      </ol>

      {appointments.length === 0 ? (
        <p>Tidak ada appointment untuk hari ini.</p>
      ) : (
        <Appointment {...appointments[appointmentDipilih]} />
      )}
    </div>
  );
}

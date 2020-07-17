import React, { useState } from 'react';

const waktuAppointmentHariItu = mulaiPada => {
  const [jam, menit] = new Date(mulaiPada).toTimeString().split(':');
  return `${jam}:${menit}`;
};

export const Appointment = ({ mulaiPada, customer, stylist, layanan, catatan }) => (
  <div id="appointmentView">
    <h3>Appointment hari ini untuk jam {waktuAppointmentHariItu(mulaiPada)}</h3>

    <table>
      <tbody>
        <tr>
          <td>Customer</td>
          <td>{customer.namaDepan} {customer.namaBelakang}</td>
        </tr>
        <tr>
          <td>Nomor Telepon</td>
          <td>{customer.nomorTelepon}</td>
        </tr>
        <tr>
          <td>Stylist</td>
          <td>{stylist}</td>
        </tr>
        <tr>
          <td>Layanan</td>
          <td>{layanan}</td>
        </tr>
        <tr>
          <td>Catatan</td>
          <td>{catatan}</td>
        </tr>
      </tbody>
    </table>
  </div>
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

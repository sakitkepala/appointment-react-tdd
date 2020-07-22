import React, { useState } from 'react';


const FormAppointment = ({ layananTersedia, layanan, handleSubmit, bukaPada, tutupPada }) => {
  let [appointment, setAppointment] = useState({ layanan });
  
  const handleChangeLayanan = ({ target }) => {
    setAppointment(appointment => ({
      ...appointment,
      layanan: target.value
    }));
  };

  return (
    <form id="appointment" onSubmit={() => handleSubmit(appointment)}>
      <label htmlFor="layanan">Layanan</label>
      <select id="layanan" name="layanan" value={layanan} onChange={handleChangeLayanan}>
        <option />
        {layananTersedia.map(item => <option key={item}>{item}</option>)}
      </select>

      <TabelTimeSlot bukaPada={bukaPada} tutupPada={tutupPada} />
    </form>
  );
};

FormAppointment.defaultProps = {
  layananTersedia: [
    'Cukur',
    'Sisir bulu',
    'Keramas anti-kutu',
    'Perawatan kuku'
  ],
  bukaPada: 9,
  tutupPada: 19
};

const timeSlotHarian = (bukaPada, tutupPada) => {
  const slotTotal = (tutupPada - bukaPada) * 2;
  const waktuMulai = new Date().setHours(bukaPada, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return Array(slotTotal)
    .fill([waktuMulai])
    .reduce((acc, _, i) =>
      acc.concat([waktuMulai + (i * increment)])
    );
};

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const TabelTimeSlot = ({ bukaPada, tutupPada }) => {
  const timeSlot = timeSlotHarian(bukaPada, tutupPada);
  return (
    <table id="time-slot">
      <tbody>
        {timeSlot.map(slot => (
          <tr key={slot}>
            <th>{toTimeValue(slot)}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { FormAppointment };

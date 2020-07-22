import React, { useState } from 'react';


const FormAppointment = ({ layananTersedia, layanan, handleSubmit, bukaPada, tutupPada, hariIni }) => {
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

      <TabelTimeSlot bukaPada={bukaPada} tutupPada={tutupPada} hariIni={hariIni} />
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
  tutupPada: 19,
  hariIni: new Date()
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

const nilaiTanggalMingguan = tanggalMulai => {
  const tengahMalam = new Date(tanggalMulai).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return Array(7)
    .fill([tengahMalam])
    .reduce((acc, _, i) =>
      acc.concat([tengahMalam + (i * increment)])
    );
};

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const toShortDate = timestamp => {
  const [day, , dayOfMonth] = new Date(timestamp)
    .toDateString()
    .split(' ');
  return `${day} ${dayOfMonth}`;
};

const TabelTimeSlot = ({ bukaPada, tutupPada, hariIni }) => {
  const timeSlot = timeSlotHarian(bukaPada, tutupPada);
  const tanggalSeminggu = nilaiTanggalMingguan(hariIni);

  return (
    <table id="time-slot">
      <thead>
        <tr>
          <th />
          {tanggalSeminggu.map(tanggal => (
            <th key={tanggal}>{toShortDate(tanggal)}</th>
          ))}
        </tr>
      </thead>
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

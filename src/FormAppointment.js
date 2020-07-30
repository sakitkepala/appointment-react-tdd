import React, { useState, useCallback } from 'react';


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

const mergeTanggalDanWaktu = (tanggal, timeSlot) => {
  const waktu = new Date(timeSlot);
  return new Date(tanggal).setHours(
    waktu.getHours(),
    waktu.getMinutes(),
    waktu.getSeconds(),
    waktu.getMilliseconds()
  );
};


const FormAppointment = ({
  layananTersedia,
  layanan,
  handleSubmit,
  bukaPada,
  tutupPada,
  hariIni,
  timeSlotTersedia,
  mulaiPada
}) => {
  let [appointment, setAppointment] = useState({ layanan, mulaiPada });
  
  const handleChangeLayanan = ({ target }) => {
    setAppointment(appointment => ({
      ...appointment,
      layanan: target.value
    }));
  };

  const handleChangeMulaiPada = useCallback((
    ({ target: { value } }) =>{
      return setAppointment(appointment => ({
        ...appointment,
        mulaiPada: parseInt(value)
      }));}
  ), []);

  return (
    <form id="appointment" onSubmit={() => handleSubmit(appointment)}>
      <label htmlFor="layanan">Layanan</label>
      <select id="layanan" name="layanan" value={layanan} onChange={handleChangeLayanan}>
        <option />
        {layananTersedia.map(item => <option key={item}>{item}</option>)}
      </select>

      <TabelTimeSlot
        bukaPada={bukaPada}
        tutupPada={tutupPada}
        hariIni={hariIni}
        timeSlotTersedia={timeSlotTersedia}
        mulaiPada={appointment.mulaiPada}
        handleChange={handleChangeMulaiPada} />
      
      <input type="submit" value="Simpan" />
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
  hariIni: new Date(),
  timeSlotTersedia: []
};


const TabelTimeSlot = ({ bukaPada, tutupPada, hariIni, timeSlotTersedia, mulaiPada, handleChange }) => {
  const slotSlot = timeSlotHarian(bukaPada, tutupPada);
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
        {slotSlot.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {tanggalSeminggu.map(tanggal => (
              <td key={tanggal}>
                <RadioButtonJikaTersedia
                  timeSlotTersedia={timeSlotTersedia}
                  tanggal={tanggal}
                  timeSlot={timeSlot}
                  slotDipilih={mulaiPada}
                  handleChange={handleChange} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const RadioButtonJikaTersedia = ({timeSlotTersedia, tanggal, timeSlot, slotDipilih, handleChange }) => {
  const mulaiPada = mergeTanggalDanWaktu(tanggal, timeSlot);
  if ( timeSlotTersedia.some(slotTersedia => slotTersedia.mulaiPada === mulaiPada) ) {
    const isChecked = mulaiPada === slotDipilih;
    return (
      <input
        type="radio"
        name="mulaiPada"
        value={mulaiPada}
        checked={isChecked}
        onChange={handleChange} />
    );
  }
  return null;
};

export { FormAppointment };

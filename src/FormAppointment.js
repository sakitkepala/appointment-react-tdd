import React, { useState } from 'react';


const FormAppointment = ({
  layananTersedia,
  layanan,
  handleSubmit,
  bukaPada,
  tutupPada,
  hariIni,
  timeSlotTersedia
}) => {
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

      <TabelTimeSlot
        bukaPada={bukaPada}
        tutupPada={tutupPada}
        hariIni={hariIni}
        timeSlotTersedia={timeSlotTersedia} />
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

const TabelTimeSlot = ({ bukaPada, tutupPada, hariIni, timeSlotTersedia }) => {
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
        {timeSlot.map(waktuSlot => (
          <tr key={waktuSlot}>
            <th>{toTimeValue(waktuSlot)}</th>
            {tanggalSeminggu.map(tanggal => (
              <td key={tanggal}>
                <RadioButtonJikaTersedia
                  timeSlotTersedia={timeSlotTersedia}
                  tanggal={tanggal}
                  waktuSlot={waktuSlot} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const RadioButtonJikaTersedia = ({timeSlotTersedia, tanggal, waktuSlot }) => {
  const mulaiPada = mergeTanggalDanWaktu(tanggal, waktuSlot);
  if ( timeSlotTersedia.some(slotTersedia => slotTersedia.mulaiPada === mulaiPada) ) {
    return (
      <input type="radio" name="mulaiPada" value={mulaiPada} />
    );
  }
  return null;
};

export { FormAppointment };

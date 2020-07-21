import React, { useState } from 'react';


const FormAppointment = ({ layananTersedia, layanan, handleSubmit }) => {
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
    </form>
  );
};

FormAppointment.defaultProps = {
  layananTersedia: [
    'Cukur',
    'Sisir bulu',
    'Keramas anti-kutu',
    'Perawatan kuku'
  ]
};

export { FormAppointment };

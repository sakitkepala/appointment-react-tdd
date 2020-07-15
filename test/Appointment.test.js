import React from 'react';
import ReactDOM from 'react-dom';
import { Appointment, AppointmentsDayView } from '../src/Appointment';

describe('Appointment', () => {
  let container;
  let customer;

  beforeEach(() => {
    container = document.createElement('div');
  });

  const render = komponen => ReactDOM.render(komponen, container);

  it('nge-render nama depannya customer', () => {
    // "Arrange", untuk testing komponen.
    // Di React, berarti juga termasuk mempersiapkan component dan container-nya, dimana komponen akan di-mount
    // Tapi, untuk container-nya sudah didefinisikan di `beforeEach()` di atas.
    customer = { namaDepan: 'Mary' };

    // render sebagai "Act"
    render(<Appointment customer={customer} />);

    // cek teks nama 'Mary' di node DOM dimana dia
    // diharapkan untuk ditemukan sebagai "Assert"
    expect(container.textContent).toMatch('Mary');
  })

  it('nge-render nama depan customer yang satunya', () => {
    customer = { namaDepan: 'Belu' };

    render(<Appointment customer={customer} />);

    expect(container.textContent).toMatch('Belu');
  })
});

describe('AppointmentsDayView', () => {
  let container;

  const hariIni = new Date();
  const appointments = [
    {
      mulaiPada: hariIni.setHours(12, 0),
      customer: { namaDepan: 'Mary' }
    },
    {
      mulaiPada: hariIni.setHours(13, 0),
      customer: { namaDepan: 'Belu' }
    }
  ];

  beforeEach(() => {
    container = document.createElement('div');
  });

  const render = komponen => ReactDOM.render(komponen, container);

  it('nge-render sebuah div yang benar id-nya', () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
  });

  // render untuk element ol & li dipisah testnya sendiri-sendiri.
  // Yang pertama ini, cuma cek jumlah childrennya ada banyak, lebih dari satu.
  // Sedangkan satunya, dia memverifikasi apakah kontennya sudah benar.
  it('nge-render banyak appointment pada element ol', () => {
    render(<AppointmentsDayView appointments={appointments} />);

    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('ol').children).toHaveLength(2);
  });

  it('nge-render tiap-tiap appointment pada li', () => {
    render(<AppointmentsDayView appointments={appointments} />);

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0].textContent).toEqual('12:00');
    expect(container.querySelectorAll('li')[1].textContent).toEqual('13:00');
  });

  it('di awal menampilkan pesan tidak ada appointment hari ini', () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(container.textContent).toMatch('Tidak ada appointment untuk hari ini.');
  });

  it('milih appointment pertama secara defaultnya', () => {
    render(<AppointmentsDayView appointments={appointments} />);

    expect(container.textContent).toMatch('Mary');
  });
});

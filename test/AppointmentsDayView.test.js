import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';

describe('Appointment', () => {
  let container;
  // customer didefinisikan sebagai objek kosongan di awal
  // supaya ekspektasi tes kita bisa untuk ngetest nilai null di props
  let customer = {};

  beforeEach(() => {
    customer = {};
    container = document.createElement('div');
  });

  const render = komponen => ReactDOM.render(komponen, container);

  const tabelAppointment = () => container.querySelector('#appointmentView > table');

  it('nge-render tabel data customer', () => {
    render(<Appointment customer={customer} />);

    // mengharapkan element table ada di dalam komponen yang dirender
    expect(tabelAppointment()).not.toBeNull();
  });

  // Apakah dengan label ditest, testnya akan jadi brittle?
  // Apakah label perlu ditest?
  it('nge-render label Customer', () => {
    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Customer');
  })

  it('nge-render nama depannya customer', () => {
    // "Arrange", untuk testing komponen.
    // Di React, berarti juga termasuk mempersiapkan component dan container-nya, dimana komponen akan di-mount
    // Tapi, untuk container-nya sudah didefinisikan di `beforeEach()` di atas.
    customer = { namaDepan: 'Mary' };

    // render sebagai "Act"
    render(<Appointment customer={customer} />);

    // cek teks nama 'Mary' di node DOM dimana dia
    // diharapkan untuk ditemukan sebagai "Assert"

    // semua data props direfaktor untuk dicari di dalam elemen table
    expect(tabelAppointment().textContent).toMatch('Mary');
  })

  it('nge-render nama depan customer yang satunya', () => {
    customer = { namaDepan: 'Belu' };

    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Belu');
  })

  it('nge-render nama belakangnya customer', () => {
    customer = { namaBelakang: 'Jane' };

    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Jane');
  })

  it('nge-render nama belakang customer yang satunya', () => {
    customer = { namaBelakang: 'Kesayangan' };

    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Kesayangan');
  })

  it('nge-render label Nomor Telepon', () => {
    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Nomor Telepon');
  })

  it('nge-render nomor telepon customer', () => {
    customer = { nomorTelepon: '085700003017' };

    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('085700003017');
  })

  it('nge-render nomor telepon customer yang lain', () => {
    customer = { nomorTelepon: '085700003333' };

    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('085700003333');
  })

  it('nge-render label Stylist', () => {
    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Stylist');
  })

  it('nge-render nama stylistnya', () => {
    render(<Appointment customer={customer} stylist='Bayu' />);

    expect(tabelAppointment().textContent).toMatch('Bayu');
  })

  it('nge-render nama stylist lainnya', () => {
    render(<Appointment customer={customer} stylist='Agung' />);

    expect(tabelAppointment().textContent).toMatch('Agung');
  })

  it('nge-render label Layanan', () => {
    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Layanan');
  })

  it('nge-render layanan tukang cukur', () => {
    render(<Appointment customer={customer} layanan='Cukur jenggot' />);

    expect(tabelAppointment().textContent).toMatch('Cukur jenggot');
  })

  it('nge-render layanan yang lainnya', () => {
    render(<Appointment customer={customer} layanan='Semir bulu hidung' />);

    expect(tabelAppointment().textContent).toMatch('Semir bulu hidung');
  })

  it('nge-render label Catatan', () => {
    render(<Appointment customer={customer} />);

    expect(tabelAppointment().textContent).toMatch('Catatan');
  })

  it('nge-render teks catatan', () => {
    render(<Appointment customer={customer} catatan='Haha' />);

    expect(tabelAppointment().textContent).toMatch('Haha');
  })

  it('nge-render teks catatan yang lain', () => {
    render(<Appointment customer={customer} catatan='Mantap' />);

    expect(tabelAppointment().textContent).toMatch('Mantap');
  })

  it('nge-render judul appointment dengan jam appointment yang sedang dipilih', () => {
    const waktu = new Date().setHours(12, 0);

    render(<Appointment customer={customer} mulaiPada={waktu} />);

    expect(container.querySelector('h3')).not.toBeNull();
    expect(container.querySelector('h3').textContent).toMatch('Appointment hari ini untuk jam 12:00');
  })

  it('nge-render judul appointment dengan jam appointment lain yang dipilih', () => {
    const waktu = new Date().setHours(9, 0);

    render(<Appointment customer={customer} mulaiPada={waktu} />);

    expect(container.querySelector('h3')).not.toBeNull();
    expect(container.querySelector('h3').textContent).toMatch('Appointment hari ini untuk jam 09:00');
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

  it('punya elemen button untuk setiap li', () => {
    render(<AppointmentsDayView appointments={appointments} />);

    expect(container.querySelectorAll('li > button')).toHaveLength(2);
    expect(container.querySelectorAll('li > button')[0].type).toEqual('button');
  });

  it('nge-render appointment lain ketika dipilih', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = container.querySelectorAll('button')[1];
    
    ReactTestUtils.Simulate.click(button);

    expect(container.textContent).toMatch('Belu');
  });
});

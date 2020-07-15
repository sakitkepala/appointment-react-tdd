import React from 'react';
import ReactDOM from 'react-dom';
import { Appointment } from '../src/Appointment';

describe('Appointment', () => {
  let container;
  let customer;

  beforeEach(() => {
    container = document.createElement('div');
  });

  const render = komponen => ReactDOM.render(komponen, container);
  
  it ('nge-render nama depannya customer', () => {
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

  it ('nge-render nama depan customer yang satunya', () => {
    customer = { namaDepan: 'Belu' };

    render(<Appointment customer={customer} />);

    expect(container.textContent).toMatch('Belu');
  })
});

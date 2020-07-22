import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulator';
import { FormAppointment } from '../src/FormAppointment';


describe('FormAppointment', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = namaField => form('appointment').elements[namaField];
  const labelFor = forElemen => container.querySelector(`label[for="${forElemen}"]`);

  const cariOption = (nodeDropdown, textContent) => {
    const options = Array.from(nodeDropdown.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };

  it('nge-render form appointment', () => {
    render(<FormAppointment />);

    expect(form('appointment')).not.toBeNull();
  });

  describe('field layanan', () => {

    it('nge-render box select', () => {
      render(<FormAppointment />);

      expect(field('layanan')).not.toBeNull();
      expect(field('layanan').tagName).toEqual('SELECT');
    });

    it('awalnya yang terpilih nilai kosong', () => {
      render(<FormAppointment />);

      const nodePertama = field('layanan').childNodes[0];

      expect(nodePertama.value).toEqual('');
      expect(nodePertama.selected).toBeTruthy();
    });

    it('mencantumkan semua layanan tukang cukur', () => {
      const layananTersedia = ['Layanan A', 'Layanan B'];

      render(<FormAppointment layananTersedia={layananTersedia} />);
      const nodeOption = Array.from(
        field('layanan').childNodes
      );
      const layananYangDirender = nodeOption.map(
        node => node.textContent
      );

      expect(layananYangDirender).toEqual(
        expect.arrayContaining(layananTersedia)
      );
    });

    it('pilih dulu nilai yang existing di awal', () => {
      const layananTersedia = ['Layanan A', 'Layanan B'];
      render(<FormAppointment layananTersedia={layananTersedia} layanan="Layanan B" />);

      const option = cariOption(field('layanan'), 'Layanan B');

      expect(option.selected).toBeTruthy();
    });

    it('nge-render label field layanan', () => {
      render(<FormAppointment />);

      expect(labelFor('layanan').textContent).toEqual('Layanan');
    });

    it('kasih id yang sesuai id labelnya', () => {
      render(<FormAppointment />);

      expect(field('layanan').id).toEqual('layanan');
    });

    it('submit nilai select yang existing', async () => {
      expect.hasAssertions();
      const layananTersedia = ['Layanan A', 'Layanan B'];
      render(
        <FormAppointment
          layananTersedia={layananTersedia}
          layanan="Layanan A"
          handleSubmit={
            ({ layanan }) => expect(layanan).toEqual('Layanan A')
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('submit nilai select yang input baru', async () => {
      expect.hasAssertions();
      const layananTersedia = ['Layanan A', 'Layanan B'];
      render(
        <FormAppointment
          layananTersedia={layananTersedia}
          layanan="Layanan A"
          handleSubmit={
            ({ layanan }) => expect(layanan).toEqual('Layanan B')
          }
        />
      );
      await ReactTestUtils.Simulate.change(field('layanan'), {
        target: { value: 'Layanan B' }
      });
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });
  });

  describe('tabel time-slot', () => {

    const tabelTimeSlot = () => container.querySelector('table#time-slot');

    it('nge-render tabel untuk time-slot', () => {
      render(<FormAppointment />);

      expect(tabelTimeSlot()).not.toBeNull();
    });

    it('nge-render satu time-slot tiap setengah jam antara waktu buka dan tutup', () => {
      render(<FormAppointment bukaPada={9} tutupPada={11} />);

      const jumlahSlotTime = tabelTimeSlot().querySelectorAll('tbody >* th');

      expect(jumlahSlotTime).toHaveLength(4);
      expect(jumlahSlotTime[0].textContent).toEqual('09:00');
      expect(jumlahSlotTime[1].textContent).toEqual('09:30');
      expect(jumlahSlotTime[3].textContent).toEqual('10:30');
    });
  });
});

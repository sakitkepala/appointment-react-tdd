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

    const fieldMulaiPada = indeks => container.querySelectorAll('input[name="mulaiPada"]')[indeks];

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

    it('nge-render cell kosong di depan baris header', () => {
      render(<FormAppointment />);

      const barisHeader = tabelTimeSlot().querySelector('thead > tr');

      expect(barisHeader.firstChild.textContent).toEqual('');
    });

    it('nge-render tanggal-tanggal yang available dalam seminggu', () => {
      const hariIni = new Date(2020, 6, 22);
      render(<FormAppointment hariIni={hariIni} />);

      const tanggal = tabelTimeSlot().querySelectorAll(
        'thead >* th:not(:first-child)'
      );

      expect(tanggal).toHaveLength(7);
      expect(tanggal[0].textContent).toEqual('Wed 22');
      expect(tanggal[1].textContent).toEqual('Thu 23');
      expect(tanggal[6].textContent).toEqual('Tue 28');
    });

    it('nge-render radio button untuk masing-masing slot', () => {
      const hariIni = new Date();
      const slotTersedia = [
        { mulaiPada: hariIni.setHours(9, 0, 0, 0) },
        { mulaiPada: hariIni.setHours(9, 30, 0, 0) }
      ];
      render(<FormAppointment timeSlotTersedia={slotTersedia} hariIni={hariIni} />);

      const semuaCell = tabelTimeSlot().querySelectorAll('td');

      expect(semuaCell[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(semuaCell[7].querySelector('input[type="radio"]')).not.toBeNull();
    });

    it('tidak nge-render radio button untuk slot yang tidak available', () => {
      render(<FormAppointment timeSlotTersedia={[]} />);
      
      const jumlahSlotTime = tabelTimeSlot().querySelectorAll('input');

      expect(jumlahSlotTime).toHaveLength(0);
    });

    it('nge-set value radio button dengan index appointment yang dimaksud', () => {
      const hariIni = new Date();
      const slotTersedia = [
        { mulaiPada: hariIni.setHours(9, 0, 0, 0) },
        { mulaiPada: hariIni.setHours(9, 30, 0, 0) }
      ];
      render(<FormAppointment timeSlotTersedia={slotTersedia} hariIni={hariIni} />);

      expect(fieldMulaiPada(0).value).toEqual(slotTersedia[0].mulaiPada.toString());
      expect(fieldMulaiPada(1).value).toEqual(slotTersedia[1].mulaiPada.toString());
    });

    it('secara default pilih radio button dari nilai existing', () => {
      const hariIni = new Date();
      const slotTersedia = [
        { mulaiPada: hariIni.setHours(9, 0, 0, 0) },
        { mulaiPada: hariIni.setHours(9, 30, 0, 0) }
      ];
      render(
        <FormAppointment
          timeSlotTersedia={slotTersedia}
          hariIni={hariIni}
          mulaiPada={slotTersedia[0].mulaiPada} />
      );

      expect(fieldMulaiPada(0).checked).toBeTruthy();
      expect(fieldMulaiPada(1).checked).toBeFalsy();
    });

    it('simpan nilai existing radio button-nya saat disubmit', () => {
      expect.hasAssertions();
      const hariIni = new Date();
      const slotTersedia = [
        { mulaiPada: hariIni.setHours(9, 0, 0, 0) },
        { mulaiPada: hariIni.setHours(9, 30, 0, 0) }
      ];
      render(
        <FormAppointment
          timeSlotTersedia={slotTersedia}
          hariIni={hariIni}
          mulaiPada={slotTersedia[0].mulaiPada}
          handleSubmit={
            ({ mulaiPada }) => expect(mulaiPada).toEqual(slotTersedia[0].mulaiPada)
          } />
      );
      ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('simpan nilai input baru radio button saat disumbit', () => {
      expect.hasAssertions();
      const hariIni = new Date();
      const slotTersedia = [
        { mulaiPada: hariIni.setHours(9, 0, 0, 0) },
        { mulaiPada: hariIni.setHours(9, 30, 0, 0) }
      ];
      render(
        <FormAppointment
        timeSlotTersedia={slotTersedia}
        hariIni={hariIni}
        mulaiPada={slotTersedia[0].mulaiPada}
        handleSubmit={
          ({ mulaiPada }) => expect(mulaiPada).toEqual(slotTersedia[1].mulaiPada)
        } />
      );
      ReactTestUtils.Simulate.change(fieldMulaiPada(1), {
        target: {
          value: slotTersedia[1].mulaiPada.toString(),
          name: 'mulaiPada'
        }
      });
      ReactTestUtils.Simulate.submit(form('appointment'));
    });
  });
});

import React from 'react';

import 'whatwg-fetch';
import { createContainer, denganEvent } from './domManipulator';

import { FormAppointment } from '../src/FormAppointment';
import { responFetchOk, bodyRequestnya } from './helperSpy';


describe('FormAppointment', () => {
  let render, container, element, elementSemua, form, field, labelFor, change, submit;

  beforeEach(() => {
    ({ render, container, element, elementSemua, form, field, labelFor, change, submit } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(responFetchOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  // TODO: ekstrak ke `domManipulator`?
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

  it('ada tombol submitnya', () => {
    render(<FormAppointment />);

    const tombolSubmit = element('input[type="submit"]');
    expect(tombolSubmit).not.toBeNull();
  });

  it('panggil fetch pakai properti/parameter yang benar waktu submit data', async () => {
    render(<FormAppointment />);

    await submit(form('appointment'));

    expect(window.fetch).toHaveBeenCalledWith(
      '/appointment',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      })
    );
  });

  const itDirenderJadiKotakSelect = namaField => {
    it('dirender jadi kotak select', () => {
      render(<FormAppointment />);

      expect(field('appointment', namaField)).not.toBeNull();
      expect(field('appointment', namaField).tagName).toEqual('SELECT');
    });
  };

  const itAwalnyaYangTerpilihNilaiKosong = namaField => {
    it('awalnya yang terpilih nilai kosong', () => {
      render(<FormAppointment />);

      const nodePertama = field('appointment', namaField).childNodes[0];
      expect(nodePertama.value).toEqual('');
      expect(nodePertama.selected).toBeTruthy();
    });
  };

  const itNgrenderLabelField = (namaField, teksLabel) => {
    it('nge-render label field', () => {
      render(<FormAppointment />);

      expect(labelFor(namaField).textContent).toEqual(teksLabel);
    });
  };

  const itKasihIdYangSesuaiIdLabelnya = namaField => {
    it('kasih id yang sesuai id labelnya', () => {
      render(<FormAppointment />);

      expect(field('appointment', namaField).id).toEqual(namaField);
    });
  };

  const itPilihDuluNilaiExistingDiAwal = (namaField, props, nilaiExisting) => { 
    it('pilih dulu nilai yang existing di awal', () => {
      render(
        <FormAppointment
          {...props}
          {...{ [namaField]: nilaiExisting }} />
      );

      const option = cariOption(field('appointment', namaField), nilaiExisting);
      expect(option.selected).toBeTruthy();
    });
  };

  const itSubmitDenganNilaiExisting = (namaField, props) => {
    it('submit nilai select yang existing', async () => {
      render(
        <FormAppointment
          {...props}
          {...{ [namaField]: 'nilainya' }}
        />
      );

      await submit(form('appointment'));

      expect(bodyRequestnya(window.fetch)[namaField]).toEqual('nilainya');
    });
  };

  const itSubmitNilaiSelectInputBaru = (namaField, props) => {
    it('submit nilai select yang input baru', async () => {
      render(
        <FormAppointment
          {...props}
          {...{ [namaField]: 'nilai existing' }}
        />
      );

      change(field('appointment', namaField), denganEvent(namaField, 'nilai baru'));
      await submit(form('appointment'));

      expect(bodyRequestnya(window.fetch)[namaField]).toEqual('nilai baru');
    });
  };

  describe('field layanan', () => {

    itDirenderJadiKotakSelect('layanan');
    
    itAwalnyaYangTerpilihNilaiKosong('layanan');

    itNgrenderLabelField('layanan', 'Layanan');

    itKasihIdYangSesuaiIdLabelnya('layanan');

    itPilihDuluNilaiExistingDiAwal(
      'layanan',
      { layananTersedia: ['Cukur', 'Sisir bulu'] },
      'Sisir bulu'
    );

    itSubmitDenganNilaiExisting('layanan', {
      stylistMenurutLayanan: { 'nilainya': [] }
    });

    itSubmitNilaiSelectInputBaru('layanan', {
      stylistMenurutLayanan: { 'nilai existing': [], 'nilai baru': [] }
    });

    it('mencantumkan semua layanan tukang cukur', () => {
      const layananTersedia = ['Cukur', 'Sisir bulu'];

      render(<FormAppointment layananTersedia={layananTersedia} />);

      const nodeOption = Array.from(
        field('appointment', 'layanan').childNodes
      );
      const layananYangDirender = nodeOption.map(
        node => node.textContent
      );
      expect(layananYangDirender).toEqual(
        expect.arrayContaining(layananTersedia)
      );
    });
  });

  describe('field stylist', () => {

    itDirenderJadiKotakSelect('stylist');
    
    itAwalnyaYangTerpilihNilaiKosong('stylist');

    itNgrenderLabelField('stylist', 'Stylist');

    itKasihIdYangSesuaiIdLabelnya('stylist');

    itPilihDuluNilaiExistingDiAwal(
      'stylist',
      { stylistTersedia: ['King', 'Agung'] },
      'Agung'
    );

    itSubmitDenganNilaiExisting('stylist');

    itSubmitNilaiSelectInputBaru('stylist');

    it('hanya menampilkan stylist yang bisa mengerjakan layanan yang dipilih', () => {
      const layananTersedia = ['1', '2'];
      const stylistTersedia = ['Stylist A', 'Stylist B', 'Stylist C', 'Stylist D'];
      const stylistMenurutLayanan = {
        '1': ['Stylist A', 'Stylist B']
      };

      render(
        <FormAppointment
          layananTersedia={layananTersedia}
          stylistTersedia={stylistTersedia}
          stylistMenurutLayanan={stylistMenurutLayanan} />
      );

      change(field('appointment', 'layanan'), denganEvent('layanan', '1'));

      const opsiNode = Array.from(field('appointment', 'stylist').childNodes);
      const stylistDirender = opsiNode.map(n => n.textContent);
      expect(stylistDirender).toEqual(
        expect.arrayContaining(['Stylist A', 'Stylist B'])
      );
    });
  });

  describe('tabel time-slot', () => {

    const tabelTimeSlot = () => element('table#time-slot');
    const fieldMulaiPada = indeks => elementSemua('input[name="mulaiPada"]')[indeks];

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
        />
      );

      submit(form('appointment'));

      expect(bodyRequestnya(window.fetch).mulaiPada).toEqual(slotTersedia[0].mulaiPada);
    });

    it('simpan nilai input baru radio button saat disumbit', () => {
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
        />
      );

      change(
        fieldMulaiPada(1),
        denganEvent(
          'mulaiPada',
          slotTersedia[1].mulaiPada.toString()
        )
      );
      submit(form('appointment'));

      expect(bodyRequestnya(window.fetch).mulaiPada).toEqual(slotTersedia[1].mulaiPada);
    });

    it('filter appointment menurut stylist yang terpilih', () => {
      const hariIni = new Date();
      const timeSlotTersedia = [
        { 
          mulaiPada: hariIni.setHours(9, 0, 0, 0),
          stylist: ['A', 'B']
        },
        { 
          mulaiPada: hariIni.setHours(9, 30, 0, 0),
          stylist: ['A']
        }
      ];
      render(
        <FormAppointment
          timeSlotTersedia={timeSlotTersedia}
          hariIni={hariIni} />
      );

      change(field('appointment', 'stylist'), denganEvent('stylist', 'B'));

      const cell = tabelTimeSlot().querySelectorAll('td');
      expect(
        cell[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cell[7].querySelector('input[type="radio"]')
      ).toBeNull();
    });
  });
});

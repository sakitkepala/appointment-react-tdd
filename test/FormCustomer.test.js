import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';

import 'whatwg-fetch';
import { createContainer, denganEvent } from './domManipulator';
import { responFetchOk, responFetchError, bodyRequestnya } from './helperSpy';

import { FormCustomer } from '../src/FormCustomer';


describe('FormCustomer', () => {
  let render, container, element, form, field, labelFor, change, submit;

  beforeEach(() => {
    ({ render, container, element, form, field, labelFor, change, submit } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(responFetchOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it('nge-render form', () => {
    render(<FormCustomer />);

    expect(form('customer')).not.toBeNull();
  });

  it('punya tombol submit', () => {
    render(<FormCustomer />);

    const tombolSubmit = element('input[type="submit"]');
    expect(tombolSubmit).not.toBeNull();
  });

  it('panggil fetch pakai properti yang benar ketika submit data', async () => {
    render(<FormCustomer />);

    await submit(form('customer'));

    expect(window.fetch).toHaveBeenCalledWith(
      '/customer',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      })
    );
  });

  it('kasih notif berupa onSave waktu form disubmit', async () => {
    const customer = { id: 123 };
    window.fetch.mockReturnValue(responFetchOk(customer));
    const spySave = jest.fn();
    render(<FormCustomer onSave={spySave} />);

    await submit(form('customer'));

    expect(spySave).toHaveBeenCalledWith(customer);
  });

  it('gak kasih notif berupa onSave kalau request POST ngereturn error', async () => {
    window.fetch.mockReturnValue(responFetchError());
    const spySave = jest.fn();
    render(<FormCustomer onSave={spySave} />);

    await submit(form('customer'));

    expect(spySave).not.toHaveBeenCalled();
  });

  it('cegah action default waktu submit form', async () => {
    const spyPreventDefault = jest.fn();
    render(<FormCustomer />);

    await submit(form('customer'), {
      preventDefault: spyPreventDefault
    });

    expect(spyPreventDefault).toHaveBeenCalled();
  });

  it('tampilkan pesan error waktu pemanggilan fetch-nya gagal', async () => {
    window.fetch.mockReturnValue(Promise.resolve({ ok: false }));
    render(<FormCustomer />);

    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('Terjadi error');
  });

  const expectFieldInputTipenyaText = elemenForm => {
    // expect(elemenForm).not.toBe(undefined);
    expect(elemenForm).not.toBeNull();
    expect(elemenForm.tagName).toEqual('INPUT');
    expect(elemenForm.type).toEqual('text');
  };

  const itDirenderSebagaiBoxInputTeks = (namaField) => {
    it('di-render sebagai box input teks', () => {
      render(<FormCustomer />);

      expectFieldInputTipenyaText(field('customer', namaField));
    });
  };

  const itMenyertakanNilaiYangExisting = (namaField) => {
    it('menyertakan nilai yang existing', () => {
      render(<FormCustomer {...{[namaField]: 'nilai' }} />);

      expect(field('customer', namaField).value).toEqual('nilai');
    });
  };

  const itNgerenderLabel = (namaField, nilaiLabel) => {
    it('nge-render label', () => {
      render(<FormCustomer />);
  
      expect(labelFor(namaField).textContent).toEqual(nilaiLabel);
    });
  };

  const itAssignIdSesuaiIdLabel = (namaField) => {
    it('nge-assign id yang sesuai id label-nya', () => {
      render(<FormCustomer />);
  
      expect(field('customer', namaField).id).toEqual(namaField);
    });
  };

  const itNgesubmitNilaiExisting = namaField => {
    it('simpan nilai yang existing ketika disubmit', async () => {
      render(
        <FormCustomer
          {...{ [namaField]: 'nilainya' }} />
      );

      await submit(form('customer'));

      expect(bodyRequestnya(window.fetch)).toMatchObject({
        [namaField]: 'nilainya'
      });
    });
  };

  const itNgesubmitNilaiInputBaru = (namaField, nilaiInput) => {
    it('simpan nilai yang diinput baru ketika disubmit', async () => {
      render(
        <FormCustomer
          {...{ [namaField]: 'nilai existing' }} />
      );

      change(
        field('customer', namaField),
        denganEvent(namaField, nilaiInput)
      );
      await submit(form('customer'));

      expect(bodyRequestnya(window.fetch)).toMatchObject({
        [namaField]: nilaiInput
      });
    });
  };

  describe('field nama depan', () => {

    itDirenderSebagaiBoxInputTeks('namaDepan');

    itMenyertakanNilaiYangExisting('namaDepan');

    itNgerenderLabel('namaDepan', 'Nama depan');

    itAssignIdSesuaiIdLabel('namaDepan');

    itNgesubmitNilaiExisting('namaDepan');

    itNgesubmitNilaiInputBaru('namaDepan', 'Belu');
  });

  describe('field nama belakang', () => {

    itDirenderSebagaiBoxInputTeks('namaBelakang');

    itMenyertakanNilaiYangExisting('namaBelakang');

    itNgerenderLabel('namaBelakang', 'Nama belakang');

    itAssignIdSesuaiIdLabel('namaBelakang');

    itNgesubmitNilaiExisting('namaBelakang');

    itNgesubmitNilaiInputBaru('namaBelakang', 'Kesayangan');
  });

  describe('field nomor telepon', () => {

    itDirenderSebagaiBoxInputTeks('nomorTelepon');

    itMenyertakanNilaiYangExisting('nomorTelepon');

    itNgerenderLabel('nomorTelepon', 'Nomor telepon');

    itAssignIdSesuaiIdLabel('nomorTelepon');

    itNgesubmitNilaiExisting('nomorTelepon');

    itNgesubmitNilaiInputBaru('nomorTelepon', '654321');
  });

});

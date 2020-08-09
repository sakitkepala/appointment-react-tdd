import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { createContainer } from './domManipulator';
import { FormCustomer } from '../src/FormCustomer';


describe('FormCustomer', () => {
  let render, container;
  const fetchAsli = window.fetch;
  let spyFetch;

  beforeEach(() => {
    ({ render, container } = createContainer());
    spyFetch = jest.fn(() => responFetchOk({}));
    window.fetch = spyFetch;
  });

  afterEach(() => {
    window.fetch = fetchAsli;
  });

  const responFetchOk = body =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body)
    });

  const responFetchError = () => Promise.resolve({ ok: false });

  const bodyRequestFetch = () => JSON.parse(spyFetch.mock.calls[0][1].body);

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form('customer').elements[name];
  const labelFor = elemenForm => container.querySelector(`label[for="${elemenForm}"]`);

  it('nge-render form', () => {
    render(<FormCustomer />);

    expect(form('customer')).not.toBeNull();
  });

  it('punya tombol submit', () => {
    render(<FormCustomer />);

    const tombolSubmit = form('customer').querySelector('input[type="submit"]');

    expect(tombolSubmit).not.toBeNull();
  });

  it('panggil fetch pakai properti yang benar ketika submit data', () => {
    render(<FormCustomer />);

    ReactTestUtils.Simulate.submit(form('customer'));

    expect(spyFetch).toHaveBeenCalledWith(
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
    spyFetch.mockReturnValue(responFetchOk(customer));
    const spySave = jest.fn();

    render(<FormCustomer onSave={spySave} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(spySave).toHaveBeenCalledWith(customer);
  });

  it('gak kasih notif berupa onSave kalau request POST ngereturn error', async () => {
    spyFetch.mockReturnValue(responFetchError());
    const spySave = jest.fn();

    render(<FormCustomer onSave={spySave} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(spySave).not.toHaveBeenCalled();
  });

  it('cegah action default waktu submit form', async () => {
    const spyPreventDefault = jest.fn();
    render(<FormCustomer />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: spyPreventDefault
      });
    });

    expect(spyPreventDefault).toHaveBeenCalled();
  });

  it('tampilkan pesan error waktu pemanggilan fetch-nya gagal', async () => {
    spyFetch.mockReturnValue(Promise.resolve({ ok: false }));

    render(<FormCustomer />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    const elementError = container.querySelector('.error');
    expect(elementError).not.toBeNull();
    expect(elementError.textContent).toMatch('Terjadi error');
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

      expectFieldInputTipenyaText(field(namaField));
    });
  };

  const itMenyertakanNilaiYangExisting = (namaField) => {
    it('menyertakan nilai yang existing', () => {
      render(<FormCustomer {...{[namaField]: 'nilai' }} />);

      expect(field(namaField).value).toEqual('nilai');
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
  
      expect(field(namaField).id).toEqual(namaField);
    });
  };

  const itNgesubmitNilaiExisting = namaField => {
    it('simpan nilai yang existing ketika disubmit', async () => {
      render(
        <FormCustomer
          {...{ [namaField]: 'nilainya' }} />
      );

      ReactTestUtils.Simulate.submit(form('customer'));

      expect(bodyRequestFetch()).toMatchObject({
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

      ReactTestUtils.Simulate.change(
        field(namaField),
        { target: { value: nilaiInput, name: namaField } }
      );
      ReactTestUtils.Simulate.submit(form('customer'));

      expect(bodyRequestFetch()).toMatchObject({
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

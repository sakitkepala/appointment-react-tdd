import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulator';
import { FormCustomer } from '../src/FormCustomer';


const spy = () => {
  let argumenDiterima;
  return {
    fn: (...args) => (argumenDiterima = args),
    argumenDiterima: () => argumenDiterima,
    argumen: n => argumenDiterima[n]
  };
};

expect.extend({
  toHaveBeenCalled(received) {
    if (received.argumenDiterima() === undefined) {
      return { pass: false, message: () => 'Spy tidak dipanggil.' };
    }
    return { pass: true, message: () => 'Spy dipanggil.' };
  }
});

describe('FormCustomer', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

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
      const spySubmit = spy();
      render(
        <FormCustomer
          {...{ [namaField]: 'nilainya' }}
          onSubmit={spySubmit.fn}
        />
      );

      ReactTestUtils.Simulate.submit(form('customer'));

      expect(spySubmit).toHaveBeenCalled();
      expect(spySubmit.argumen(0)[namaField]).toEqual('nilainya');
    });
  };

  const itNgesubmitNilaiInputBaru = (namaField, nilaiInput) => {
    it('simpan nilai yang diinput baru ketika disubmit', async () => {
      expect.hasAssertions();
      render(
        <FormCustomer
          {...{ [namaField]: 'nilai existing' }}
          onSubmit={
            customer => expect(customer[namaField]).toEqual(nilaiInput)
          }
        />
      );

      await ReactTestUtils.Simulate.change(
        field(namaField),
        { target: { value: nilaiInput, name: namaField } }
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
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

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulator';
import { FormCustomer } from '../src/FormCustomer';


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

  const itNgesubmitNilaiInputBaru = (namaField, nilaiInput) => {
    it('simpan nilai yang diinput baru ketika disubmit', async () => {
      expect.hasAssertions();
      render(
        <FormCustomer
          {...{ [namaField]: 'nilaiExisting' }}
          onSubmit={
            customer => expect(customer[namaField]).toEqual(nilaiInput)
          }
        />
      );

      await ReactTestUtils.Simulate.change(
        field(namaField),
        { target: { value: nilaiInput } }
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  const itNgesubmitNilaiExisting = (namaField, nilaiExisting) => {
    it('simpan nilai yang existing ketika disubmit', async () => {
      expect.hasAssertions();
      render(
        <FormCustomer
          {...{ [namaField]: nilaiExisting }}
          onSubmit={
            customer => expect(customer[namaField]).toEqual(nilaiExisting)
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  describe('field nama depan', () => {

    itDirenderSebagaiBoxInputTeks('namaDepan');

    itMenyertakanNilaiYangExisting('namaDepan');

    itNgerenderLabel('namaDepan', 'Nama depan');

    itAssignIdSesuaiIdLabel('namaDepan');

    itNgesubmitNilaiExisting('namaDepan', 'Mary');

    itNgesubmitNilaiInputBaru('namaDepan', 'Mary');
  });

});

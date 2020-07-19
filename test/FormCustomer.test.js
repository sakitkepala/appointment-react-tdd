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

  const expectFieldInputTipenyaText = elemenForm => {
    // expect(elemenForm).not.toBe(undefined);
    expect(elemenForm).not.toBeNull();
    expect(elemenForm.tagName).toEqual('INPUT');
    expect(elemenForm.type).toEqual('text');
  };

  const fieldNamaDepan = () => form('customer').elements.namaDepan;

  const labelFor = elemenForm => container.querySelector(`label[for="${elemenForm}"]`);

  it('nge-render form', () => {
    render(<FormCustomer />);

    expect(form('customer')).not.toBeNull();
  });

  it('nge-render field nama depan sebagai box teks', () => {
    render(<FormCustomer />);

    expectFieldInputTipenyaText(fieldNamaDepan());
  });

  it('menyertakan nilai yang existing untuk nama depan', () => {
    render(<FormCustomer namaDepan="Belu" />);

    expect(fieldNamaDepan().value).toEqual('Belu');
  });

  it('nge-render label untuk field nama depan', () => {
    render(<FormCustomer />);

    expect(labelFor('namaDepan').textContent).toEqual('Nama depan');
  });

  it('assign satu id yang sesuai id label-nya dengan field nama depan', () => {
    render(<FormCustomer />);

    expect(fieldNamaDepan().id).toEqual('namaDepan');
  });

  it('simpan nama depan yang existing ketika disubmit', async () => {
    expect.hasAssertions();
    render(
      <FormCustomer
        namaDepan="Belu"
        onSubmit={
          ({ namaDepan }) => expect(namaDepan).toEqual('Belu')
        }
      />);
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

  it('simpan nama depan yang baru ketika disubmit', async () => {
    expect.hasAssertions();
    render(
      <FormCustomer
        namaDepan="Belu"
        onSubmit={
          ({ namaDepan }) => expect(namaDepan).toEqual('Mary')
        }
      />);
      await ReactTestUtils.Simulate.change(fieldNamaDepan(), {
        target: { value: 'Mary' }
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
  });
});

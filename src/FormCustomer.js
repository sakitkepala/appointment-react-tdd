import React, { useState } from 'react';


const Error = () => (<div className="error">Terjadi error selagi save</div>);

const FormCustomer = ({ namaDepan, namaBelakang, nomorTelepon, onSave }) => {
  // Sintaks assignment ini `{ namaDepan }` ternyata
  // untuk bikin Objek yang punya properti `namaDepan`
  // dengan nilai key dari props di atas.
  const [ customer, setCustomer ] = useState({ namaDepan, namaBelakang, nomorTelepon });
  const [ error, setError ] = useState(false);

  const handleChangeDiInput = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  };

  const handleSubmit = async evt => {
    evt.preventDefault();

    const res = await window.fetch('/customer', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });

    if (res.ok) {
      const customerDenganId = await res.json();
      onSave(customerDenganId);
    }
    else {
      setError(true);
    }
  };

  // Form di komponen ini pakai event handler yang memanggil function
  // yang diambilkan dari props, dan dengan berdiri sendiri, dia tidak
  // punya logic sendiri.

  // Dengan panggil function dari komponen parent untuk event handler,
  // ini akan memungkinkan event submit dari form di komponen ini
  // dihandle dengan logic yang "DITENTUKAN PARENT"-nya. Form ini tidak
  // sepenuhnya tahu apa yang akan dilakukan ketika event muncul, hanya
  // melakukan tugasnya menyampaikan bahwa event submit muncul, apapun
  // yang akan dilakukan dengan event ini oleh handler.
  // Ini bisa diartikan seperti ini: "ketika event submit muncul,
  // lakukan yang disuruh oleh parent".

  // Tapi function dari props tidak langsung berperan sebagai event
  // handler. "Handler" di bawah pakai ANONYMOUS FUNCTION yang memanggil
  // FUNCTION DARI PROPS.

  // Atribut `onSubmit` di tag form ini dipanggil di event handler
  // untuk form ini sedangkan onSubmit di props di atas itu props yang
  // berupa function `onSubmit()` yang dioper dari komponen parent ke
  // sini (komponen FormCustomer).
  return (
    <form id="customer" onSubmit={handleSubmit}>
      { error ? <Error /> : null }

      <label htmlFor="namaDepan">Nama depan</label>
      <input id="namaDepan" type="text" name="namaDepan" value={namaDepan} onChange={handleChangeDiInput} />

      <label htmlFor="namaBelakang">Nama belakang</label>
      <input id="namaBelakang" type="text" name="namaBelakang" value={namaBelakang} onChange={handleChangeDiInput} />

      <label htmlFor="nomorTelepon">Nomor telepon</label>
      <input id="nomorTelepon" type="text" name="nomorTelepon" value={nomorTelepon} onChange={handleChangeDiInput} />

      <input type="submit" value="Simpan" />
    </form>
  );
};

FormCustomer.defaultProps = {
  onSave: () => {}
};

export { FormCustomer };

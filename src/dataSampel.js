const hariIni = new Date();

const waktu = jam => hariIni.setHours(jam, 0);

export const appointmentSampel = [
  {
    mulaiPada: waktu(9),
    customer: {
      namaDepan: 'Mary',
      namaBelakang: 'Jane',
      nomorTelepon: '085700003017'
    },
    stylist: 'Dika',
    layanan: 'Sisir bulu',
    catatan: 'Bikin halus.'
  },
  {
    mulaiPada: waktu(10),
    customer: {
      namaDepan: 'Belu',
      namaBelakang: 'Kesayangan',
      nomorTelepon: '085700003333'
    },
    stylist: 'Dika',
    layanan: 'Kepang ekor',
    catatan: 'Keren ih.'
  },
  {
    mulaiPada: waktu(11),
    customer: {
      namaDepan: 'Nona',
      namaBelakang: 'Kembar',
      nomorTelepon: '582145628435'
    },
    stylist: 'Vandy',
    layanan: 'Keramas anti kutu',
    catatan: 'Gondrong rambutku.'
  },
  {
    mulaiPada: waktu(12),
    customer: {
      namaDepan: 'Merri',
      namaBelakang: 'Putih',
      nomorTelepon: '593745628435'
    },
    stylist: 'Vandy',
    layanan: 'Keramas anti kutu',
    catatan: 'Gondrong rambutku.'
  },
  {
    mulaiPada: waktu(13),
    customer: {
      namaDepan: 'Bot',
      namaBelakang: 'Tarjo',
      nomorTelepon: '837205628435'
    },
    stylist: 'Omolik',
    layanan: 'Pijat capek',
    catatan: 'Keliling kampung mulu.'
  },
  {
    mulaiPada: waktu(14),
    customer: {
      namaDepan: 'Puthel',
      namaBelakang: 'Buntutnya',
      nomorTelepon: '837205620035'
    },
    stylist: 'Dika',
    layanan: 'Elus punggung',
    catatan: 'Hati-hati ekornya.'
  },
  {
    mulaiPada: waktu(15),
    customer: {
      namaDepan: 'Onah',
      namaBelakang: 'Tante',
      nomorTelepon: '917205840035'
    },
    stylist: 'Budhe',
    layanan: 'Luluran',
    catatan: 'Perawat dong.'
  },
  {
    mulaiPada: waktu(16),
    customer: {
      namaDepan: 'Noni',
      namaBelakang: 'Kembar',
      nomorTelepon: '955205443035'
    },
    stylist: 'Agung',
    layanan: 'Potong kuku',
    catatan: 'Pertajam.'
  },
  {
    mulaiPada: waktu(17),
    customer: {
      namaDepan: 'Kecil',
      namaBelakang: 'Kesayangan',
      nomorTelepon: '157225430035'
    },
    stylist: 'Dika',
    layanan: 'Ayunan',
    catatan: 'Ajakin main.'
  }
];

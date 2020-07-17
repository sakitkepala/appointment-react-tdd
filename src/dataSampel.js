const hariIni = new Date();

const waktu = jam => hariIni.setHours(jam, 0);

export const appointmentSampel = [
  { mulaiPada: waktu(9), customer: { namaDepan: 'Mary' } },
  { mulaiPada: waktu(10), customer: { namaDepan: 'Belu' } },
  { mulaiPada: waktu(11), customer: { namaDepan: 'Nona' } },
  { mulaiPada: waktu(12), customer: { namaDepan: 'Merri' } },
  { mulaiPada: waktu(13), customer: { namaDepan: 'Bot' } },
  { mulaiPada: waktu(14), customer: { namaDepan: 'Puthel' } },
  { mulaiPada: waktu(15), customer: { namaDepan: 'Onah' } },
  { mulaiPada: waktu(16), customer: { namaDepan: 'Noni' } },
  { mulaiPada: waktu(17), customer: { namaDepan: 'Kecil' } }
];

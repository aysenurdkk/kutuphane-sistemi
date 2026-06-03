const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Kullanici = require('../models/Kullanici');

dotenv.config();

const baglanti = require('../config/db');

const adminOlustur = async () => {
  await baglanti();

  const mevcutAdmin = await Kullanici.findOne({ email: 'admin@kutuphane.com' });
  if (mevcutAdmin) {
    console.log('Admin zaten mevcut.');
    process.exit(0);
  }

  await Kullanici.create({
    ad: 'Admin',
    soyad: 'Kullanici',
    email: 'admin@kutuphane.com',
    sifre: 'admin123',
    rol: 'admin',
  });

  console.log('Admin oluşturuldu.');
  process.exit(0);
};

adminOlustur().catch((err) => { console.error(err); process.exit(1); });

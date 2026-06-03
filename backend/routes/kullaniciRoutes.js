const express = require('express');
const router = express.Router();
const {
  kayitOl,
  girisYap,
  profilGetir,
  tumKullanicilariGetir,
  kullaniciGetir,
  kullaniciGuncelle,
  kullaniciSil,
} = require('../controllers/kullaniciController');
const { koruma, adminKoruma } = require('../middleware/authMiddleware');

router.post('/kayit', kayitOl);
router.post('/giris', girisYap);
router.get('/profil', koruma, profilGetir);
router.get('/', koruma, adminKoruma, tumKullanicilariGetir);
router.get('/:id', koruma, adminKoruma, kullaniciGetir);
router.put('/:id', koruma, adminKoruma, kullaniciGuncelle);
router.delete('/:id', koruma, adminKoruma, kullaniciSil);

module.exports = router;

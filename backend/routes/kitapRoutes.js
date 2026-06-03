const express = require('express');
const router = express.Router();
const {
  tumKitaplariGetir,
  kitapGetir,
  kitapEkle,
  kitapGuncelle,
  kitapSil,
} = require('../controllers/kitapController');
const { koruma, adminKoruma } = require('../middleware/authMiddleware');

router.get('/', tumKitaplariGetir);
router.get('/:id', kitapGetir);
router.post('/', koruma, adminKoruma, kitapEkle);
router.put('/:id', koruma, adminKoruma, kitapGuncelle);
router.delete('/:id', koruma, adminKoruma, kitapSil);

module.exports = router;

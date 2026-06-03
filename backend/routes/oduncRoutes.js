const express = require('express');
const router = express.Router();
const {
  oduncAl,
  iadeEt,
  tumOduncleriGetir,
  benimOdunclerim,
  oduncSil,
} = require('../controllers/oduncController');
const { koruma, adminKoruma } = require('../middleware/authMiddleware');

router.get('/', koruma, adminKoruma, tumOduncleriGetir);
router.get('/benim', koruma, benimOdunclerim);
router.post('/', koruma, oduncAl);
router.put('/:id/iade', koruma, iadeEt);
router.delete('/:id', koruma, adminKoruma, oduncSil);

module.exports = router;

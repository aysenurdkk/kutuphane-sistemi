import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner';

const KATEGORILER = ['Roman', 'Bilim', 'Tarih', 'Felsefe', 'Çocuk', 'Diğer'];

const bos = { kitapAdi: '', yazar: '', kategori: 'Diğer', stok: 1, sayfaSayisi: '', aciklama: '', kapakResmi: '' };

const KitapForm = ({ kitap, kapat, onBasarili }) => {
  const [form, setForm] = useState(
    kitap
      ? {
          kitapAdi:   kitap.kitapAdi,
          yazar:      kitap.yazar,
          kategori:   kitap.kategori,
          stok:       kitap.stok,
          sayfaSayisi: kitap.sayfaSayisi || '',
          aciklama:   kitap.aciklama || '',
          kapakResmi: kitap.kapakResmi || '',
        }
      : bos
  );
  const [hatalar, setHatalar]     = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);
  const { toastEkle } = useToast();

  const degistir = (e) => {
    const { name, value } = e.target;
    const sayisal = ['stok', 'sayfaSayisi'].includes(name);
    setForm((p) => ({ ...p, [name]: sayisal ? (value === '' ? '' : Number(value)) : value }));
    if (hatalar[name]) setHatalar((p) => ({ ...p, [name]: '' }));
  };

  const dogrula = () => {
    const yeni = {};
    if (!form.kitapAdi.trim()) yeni.kitapAdi = 'Kitap adı zorunludur';
    if (!form.yazar.trim())    yeni.yazar    = 'Yazar adı zorunludur';
    if (form.stok < 0)         yeni.stok     = 'Stok 0 veya daha fazla olmalı';
    if (form.sayfaSayisi !== '' && form.sayfaSayisi < 1)
      yeni.sayfaSayisi = 'Sayfa sayısı en az 1 olmalı';
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dogrula()) return;

    const gonderi = { ...form };
    if (gonderi.sayfaSayisi === '') delete gonderi.sayfaSayisi;
    if (gonderi.kapakResmi === '') delete gonderi.kapakResmi;

    try {
      setYukleniyor(true);
      if (kitap) {
        await api.put(`/kitaplar/${kitap._id}`, gonderi);
        toastEkle('Kitap güncellendi', 'success');
      } else {
        await api.post('/kitaplar', gonderi);
        toastEkle('Kitap eklendi', 'success');
      }
      onBasarili();
      kapat();
    } catch (hata) {
      toastEkle(hata.response?.data?.mesaj || 'İşlem başarısız', 'error');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Kitap Adı *</label>
          <input name="kitapAdi" className="form-input" value={form.kitapAdi}
            onChange={degistir} placeholder="Kitap adını girin" />
          {hatalar.kitapAdi && <p className="form-error">{hatalar.kitapAdi}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Yazar *</label>
          <input name="yazar" className="form-input" value={form.yazar}
            onChange={degistir} placeholder="Yazar adını girin" />
          {hatalar.yazar && <p className="form-error">{hatalar.yazar}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Kategori</label>
          <select name="kategori" className="form-select" value={form.kategori} onChange={degistir}>
            {KATEGORILER.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Stok Adedi *</label>
          <input name="stok" type="number" min="0" className="form-input"
            value={form.stok} onChange={degistir} />
          {hatalar.stok && <p className="form-error">{hatalar.stok}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Sayfa Sayısı</label>
        <input name="sayfaSayisi" type="number" min="1" className="form-input"
          value={form.sayfaSayisi} onChange={degistir} placeholder="Ör: 384" />
        {hatalar.sayfaSayisi && <p className="form-error">{hatalar.sayfaSayisi}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Açıklama</label>
        <textarea name="aciklama" className="form-textarea" value={form.aciklama}
          onChange={degistir} placeholder="Kitap hakkında kısa bir açıklama..." rows={3} />
      </div>

      <div className="form-group">
        <label className="form-label">Kapak Resmi URL <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opsiyonel)</span></label>
        <input name="kapakResmi" className="form-input" value={form.kapakResmi}
          onChange={degistir} placeholder="https://örnek.com/kapak.jpg" />
        {form.kapakResmi && (
          <div className="kapak-onizleme">
            <img src={form.kapakResmi} alt="Kapak önizleme" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>

      <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
        <button type="button" className="btn btn-secondary" onClick={kapat} disabled={yukleniyor}>
          İptal
        </button>
        <button type="submit" className="btn btn-primary" disabled={yukleniyor}>
          {yukleniyor ? <Spinner kucuk satir /> : kitap ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  );
};

export default KitapForm;

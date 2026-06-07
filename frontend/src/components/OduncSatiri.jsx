import { useState } from 'react';

const tarihFormat = (tarih) => {
  if (!tarih) return '—';
  return new Date(tarih).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const OduncSatiri = ({ odunc, oduncIade, adminGorunu = false, onSil }) => {
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleIade = async () => {
    setYukleniyor(true);
    try {
      await oduncIade(odunc._id);
    } finally {
      setYukleniyor(false);
    }
  };

  const aktif = odunc.durum === 'oduncte';
  const gecikmisMi = aktif && odunc.sonIadeTarihi && new Date() > new Date(odunc.sonIadeTarihi);

  return (
    <tr>
      <td>
        <strong>{odunc.kitapId?.kitapAdi || '—'}</strong>
        <br />
        <small style={{ color: 'var(--text-light)' }}>{odunc.kitapId?.yazar}</small>
      </td>
      {adminGorunu && (
        <td>
          {odunc.kullaniciId?.ad} {odunc.kullaniciId?.soyad}
          <br />
          <small style={{ color: 'var(--text-light)' }}>{odunc.kullaniciId?.email}</small>
        </td>
      )}
      <td>{tarihFormat(odunc.almaTarihi)}</td>
      <td>
        {aktif ? (
          <span style={{ color: gecikmisMi ? 'var(--danger)' : 'inherit', fontWeight: gecikmisMi ? '600' : 'normal' }}>
            {tarihFormat(odunc.sonIadeTarihi)}
            {gecikmisMi && <><br /><small>Gecikmiş</small></>}
          </span>
        ) : (
          tarihFormat(odunc.iadeTarihi)
        )}
      </td>
      <td>
        <span className={`badge ${aktif ? 'badge-warning' : 'badge-success'}`}>
          {aktif ? 'Ödünçte' : 'İade Edildi'}
        </span>
      </td>
      <td>
        <div className="tablo__aksiyonlar">
          {aktif && (
            <button
              className="btn-iade btn-sm"
              onClick={handleIade}
              disabled={yukleniyor}
            >
              {yukleniyor ? 'Bekleniyor...' : 'İade Et'}
            </button>
          )}
          {onSil && (
            <button className="btn btn-danger btn-sm" onClick={onSil}>
              Sil
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OduncSatiri;

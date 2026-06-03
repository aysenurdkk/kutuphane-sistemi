import { useEffect } from 'react';

const Modal = ({ acik, kapat, baslik, children }) => {
  useEffect(() => {
    if (acik) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [acik]);

  if (!acik) return null;

  const overlayTikla = (e) => {
    if (e.target === e.currentTarget) kapat();
  };

  return (
    <div className="modal-overlay" onClick={overlayTikla}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{baslik}</h3>
          <button className="modal-close" onClick={kapat} aria-label="Kapat">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

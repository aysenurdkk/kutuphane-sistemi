const Toast = ({ mesaj, tip = 'info', kapat }) => {
  return (
    <div className={`toast ${tip}`} role="alert">
      <span className="toast__icon" />
      <span className="toast__title">{mesaj}</span>
      <button className="toast__close" onClick={kapat} aria-label="Kapat">
        &times;
      </button>
    </div>
  );
};

export default Toast;

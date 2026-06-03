const Spinner = ({ kucuk = false, satir = false }) => {
  if (satir) {
    return <span className={`spinner inline ${kucuk ? 'sm' : ''}`} />;
  }
  return (
    <div className="spinner-container">
      <div className={`spinner ${kucuk ? 'sm' : ''}`} />
    </div>
  );
};

export default Spinner;

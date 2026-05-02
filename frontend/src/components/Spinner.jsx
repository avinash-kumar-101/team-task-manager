export default function Spinner({ size = 'md' }) {
  return (
    <div className="spinner-container">
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`}></div>
    </div>
  );
}

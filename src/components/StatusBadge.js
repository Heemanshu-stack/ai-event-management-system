export default function StatusBadge({ status }) {
  if (!status) return null;
  
  const normalized = status.toLowerCase();

  if (normalized === 'present' || normalized === 'checked-in' || normalized === 'yes') {
    return (
      <span className="badge badge-present">
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--status-present)',
          marginRight: '6px',
        }} />
        Present
      </span>
    );
  }

  if (normalized === 'pending' || normalized === 'no') {
    return (
      <span className="badge badge-pending">
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--status-pending)',
          marginRight: '6px',
        }} />
        Pending
      </span>
    );
  }

  if (normalized === 'ongoing') {
    return (
      <span className="badge badge-present">
        Live Now
      </span>
    );
  }

  return (
    <span className="badge badge-neutral">
      {status}
    </span>
  );
}

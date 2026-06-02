const EmptyState = ({ icon = '📭', title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in" id="empty-state">
      <div className="text-6xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-surface-700 mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-surface-500 max-w-sm mb-6">{message}</p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;

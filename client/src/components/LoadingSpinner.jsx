const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16" id="loading-spinner">
      <div
        className={`${sizeClasses[size]} rounded-full border-3 border-surface-200 border-t-primary-500 animate-spin`}
        style={{ borderWidth: '3px' }}
      />
      {message && (
        <p className="text-sm text-surface-500 mt-4 animate-pulse-soft">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

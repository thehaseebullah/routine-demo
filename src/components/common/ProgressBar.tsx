import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 - 100
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  className = ''
}) => {
  const safeProgress = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));

  return (
    <div className={`progress-bar-wrapper ${className}`} style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontWeight: 600,
            marginBottom: '4px',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Progress</span>
          <span>{safeProgress}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

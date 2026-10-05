import React from 'react';
import { APP_CONFIG } from '../../config/appConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconDimensions = size === 'sm' ? 26 : size === 'lg' ? 40 : 32;
  const fontSize = size === 'sm' ? '15px' : size === 'lg' ? '22px' : '18px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      {/* Sleek architectural emblem: layered blueprints / routine cycle in blue and black */}
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="Routine Logo"
      >
        <rect width="40" height="40" rx="10" fill="#09090B" />
        {/* Modern architectural isometric cube / routine loop in precision blue & white */}
        <path
          d="M20 9L31 15.35V28.05L20 34.4L9 28.05V15.35L20 9Z"
          stroke="#3B82F6"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M20 9V21.7M31 15.35L20 21.7M9 15.35L20 21.7"
          stroke="#60A5FA"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="21.7" r="3.2" fill="#2563EB" />
        <circle cx="20" cy="9" r="2" fill="#93C5FD" />
        <circle cx="31" cy="15.35" r="2" fill="#93C5FD" />
        <circle cx="31" cy="28.05" r="2" fill="#3B82F6" />
        <circle cx="20" cy="34.4" r="2" fill="#2563EB" />
        <circle cx="9" cy="28.05" r="2" fill="#3B82F6" />
        <circle cx="9" cy="15.35" r="2" fill="#93C5FD" />
      </svg>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.1
            }}
          >
            {APP_CONFIG.appName}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--blue-subtle)',
              color: 'var(--blue-primary)',
              border: '1px solid var(--blue-border)'
            }}
          >
            PROTOTYPE
          </span>
        </div>
        {showTagline && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              marginTop: '1px'
            }}
          >
            {APP_CONFIG.appTagline}
          </div>
        )}
      </div>
    </div>
  );
};

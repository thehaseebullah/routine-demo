import React from 'react';
import { BOQCategorySummary as SummaryType } from '../../../types/boq';
import { Card } from '../../common/Card';
import { APP_CONFIG } from '../../../config/appConfig';

interface BOQCategorySummaryProps {
  summaries: SummaryType[];
  totalAmount: number;
}

export const BOQCategorySummary: React.FC<BOQCategorySummaryProps> = ({
  summaries,
  totalAmount
}) => {
  if (summaries.length === 0) return null;

  return (
    <Card
      title="Category Cost Breakdown"
      subtitle="Aggregated estimate distribution across project work packages"
    >
      <div className="boq-category-grid">
        {summaries.map((s) => (
          <div
            key={s.category}
            style={{
              padding: '12px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {s.category}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--blue-primary)',
                  background: 'var(--blue-subtle)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {s.percentageOfTotal}%
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {s.itemCount} {s.itemCount === 1 ? 'item' : 'items'}
              </span>
              <strong
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)'
                }}
              >
                {APP_CONFIG.currencySymbol}
                {s.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            </div>

            {/* Micro visual proportion bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                background: 'var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${s.percentageOfTotal}%`,
                  height: '100%',
                  background: 'var(--blue-primary)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

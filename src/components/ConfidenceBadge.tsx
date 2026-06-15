'use client';

import type { RiskLevel } from '@/lib/types';

const STYLES: Record<RiskLevel, string> = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
};

const DOT: Record<RiskLevel, string> = {
  green: 'bg-risk-green',
  amber: 'bg-risk-amber',
  red: 'bg-risk-red',
};

export default function ConfidenceBadge({
  level,
  overall,
  label,
}: {
  level: RiskLevel;
  overall: number;
  label: string;
}) {
  return (
    <span className={`chip ${STYLES[level]}`}>
      <span className={`h-2 w-2 rounded-full ${DOT[level]}`} />
      {label}: {Math.round(overall * 100)}%
    </span>
  );
}

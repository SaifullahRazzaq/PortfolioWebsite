'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { QualitySettings } from '@/hooks/useQualityTier';

/**
 * Quality tier, shared across the 3D tree.
 *
 * Decided once at mount and never changed, so rooms can branch on it at render
 * time without any risk of a mid-journey renderer rebuild.
 */
const QualityContext = createContext<QualitySettings | null>(null);

export function QualityProvider({
  value,
  children,
}: {
  value: QualitySettings;
  children: ReactNode;
}) {
  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>;
}

export function useQuality(): QualitySettings {
  const ctx = useContext(QualityContext);
  if (!ctx) throw new Error('useQuality must be used inside <QualityProvider>');
  return ctx;
}

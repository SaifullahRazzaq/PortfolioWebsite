import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated share card. Built at request time from /data, so it can never drift
 * out of sync with the name or role shown on the site.
 *
 * System fonts only: loading a webfont here would add a network fetch to every
 * social scrape for a card nobody reads at display sizes anyway.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#08090C',
          backgroundImage:
            'radial-gradient(70% 60% at 15% 0%, rgba(255,138,61,0.20) 0%, rgba(8,9,12,0) 60%)',
          color: '#EDEAE4',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 2, background: '#FF8A3D' }} />
          <div style={{ fontSize: 22, letterSpacing: 8, color: '#A7A49F' }}>
            {profile.role.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
            {profile.firstName}
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -3,
              color: '#FF8A3D',
            }}
          >
            {profile.lastName}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#A7A49F', maxWidth: 900 }}>
            {profile.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, fontSize: 22, color: '#6B6863' }}>
          {profile.stats.map((stat) => (
            <div key={stat.label} style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#5EE7D0' }}>{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

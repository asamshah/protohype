'use client';

import { useMemo } from 'react';
import { getDevicesByCategory, getBrands } from '@/data/devices';
import styles from './DevicePicker.module.css';

function DeviceIcon({ device }) {
  const lines = device.icon.split('\n');
  const type = device.iconType;

  if (type === 'phone') {
    return (
      <svg width="32" height="52" viewBox="0 0 32 52" fill="none" className={styles.iconSvg}>
        <rect x="3" y="1" width="26" height="50" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="5" width="20" height="38" rx="2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="12" y1="47" x2="20" y2="47" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
        {lines.map((line, i) => (
          <text key={i} x="16" y={22 + i * 10 - ((lines.length - 1) * 5)}
            textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{line}</text>
        ))}
      </svg>
    );
  }

  if (type === 'tablet') {
    return (
      <svg width="40" height="52" viewBox="0 0 40 52" fill="none" className={styles.iconSvg}>
        <rect x="2" y="1" width="36" height="50" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="5" width="30" height="42" rx="2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        {lines.map((line, i) => (
          <text key={i} x="20" y={24 + i * 10 - ((lines.length - 1) * 5)}
            textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{line}</text>
        ))}
      </svg>
    );
  }

  if (type === 'fold') {
    return (
      <svg width="44" height="52" viewBox="0 0 44 52" fill="none" className={styles.iconSvg}>
        <rect x="2" y="4" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="4" x2="22" y2="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
        <rect x="5" y="8" width="34" height="36" rx="2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        {lines.map((line, i) => (
          <text key={i} x="22" y={24 + i * 10 - ((lines.length - 1) * 5)}
            textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{line}</text>
        ))}
      </svg>
    );
  }

  if (type === 'laptop') {
    return (
      <svg width="48" height="40" viewBox="0 0 48 40" fill="none" className={styles.iconSvg}>
        <rect x="6" y="2" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="5" width="30" height="20" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <path d="M2 32 H46 L44 36 H4 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        {lines.map((line, i) => (
          <text key={i} x="24" y={14 + i * 9 - ((lines.length - 1) * 4.5)}
            textAnchor="middle" fontSize="8" fontWeight="600" fill="currentColor">{line}</text>
        ))}
      </svg>
    );
  }

  if (type === 'monitor') {
    return (
      <svg width="48" height="44" viewBox="0 0 48 44" fill="none" className={styles.iconSvg}>
        <rect x="4" y="2" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="5" width="34" height="22" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="24" y1="30" x2="24" y2="36" stroke="currentColor" strokeWidth="1.2" />
        <line x1="16" y1="36" x2="32" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <text x="24" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="currentColor">
          {device.icon}
        </text>
      </svg>
    );
  }

  return null;
}

export default function DevicePicker({ category, onCategoryChange, selectedDevice, onDeviceChange }) {
  const filteredDevices = useMemo(() => getDevicesByCategory(category), [category]);
  const brands = useMemo(() => getBrands(category), [category]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${category === 'mobile' ? styles.active : ''}`}
          onClick={() => onCategoryChange('mobile')}
        >
          Mobile
        </button>
        <button
          className={`${styles.tab} ${category === 'desktop' ? styles.active : ''}`}
          onClick={() => onCategoryChange('desktop')}
        >
          Desktop
        </button>
      </div>

      <div className={styles.deviceList}>
        {brands.map((brand) => (
          <div key={brand} className={styles.brandGroup}>
            <span className={styles.brandLabel}>{brand}</span>
            <div className={styles.deviceGrid}>
              {filteredDevices
                .filter((d) => d.brand === brand)
                .map((device) => (
                  <button
                    key={device.id}
                    className={`${styles.deviceCard} ${
                      selectedDevice?.id === device.id ? styles.selected : ''
                    }`}
                    onClick={() => onDeviceChange(device)}
                    title={`${device.width}×${device.height}`}
                  >
                    <div className={styles.iconWrap}>
                      <DeviceIcon device={device} />
                    </div>
                    <span className={styles.deviceName}>{device.name}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

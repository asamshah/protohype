const devices = [
  // iPhone
  {
    id: 'iphone-14', name: 'iPhone 14', icon: '14', iconType: 'phone',
    width: 390, height: 844, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 47, bezel: 12, frameColor: '#1b1b1f', frameRadius: 55,
    notch: 'notch', sideButtons: 'iphone',
  },
  {
    id: 'iphone-14-pro', name: 'iPhone 14 Pro', icon: '14\nPro', iconType: 'phone',
    width: 393, height: 852, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 5, frameColor: '#2c2c31', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone',
  },
  {
    id: 'iphone-15', name: 'iPhone 15', icon: '15', iconType: 'phone',
    width: 393, height: 852, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 5, frameColor: '#1b1b1f', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone',
  },
  {
    id: 'iphone-15-pro', name: 'iPhone 15 Pro', icon: '15\nPro', iconType: 'phone',
    width: 393, height: 852, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 5, frameColor: '#3a3a3f', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone-action',
  },
  {
    id: 'iphone-16', name: 'iPhone 16', icon: '16', iconType: 'phone',
    width: 393, height: 852, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 5, frameColor: '#1b1b1f', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone-action',
  },
  {
    id: 'iphone-16-pro', name: 'iPhone 16 Pro', icon: '16\nPro', iconType: 'phone',
    width: 402, height: 874, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 4, frameColor: '#3a3a3f', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone-action',
  },
  {
    id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', icon: '16\nPro\nMax', iconType: 'phone',
    width: 440, height: 956, pixelRatio: 3,
    category: 'mobile', brand: 'Apple',
    screenRadius: 55, bezel: 4, frameColor: '#3a3a3f', frameRadius: 58,
    notch: 'dynamic-island', sideButtons: 'iphone-action',
  },

  // iPad
  {
    id: 'ipad-pro-11', name: 'iPad Pro 11"', icon: 'Pro\n11', iconType: 'tablet',
    width: 834, height: 1194, pixelRatio: 2,
    category: 'mobile', brand: 'Apple',
    screenRadius: 18, bezel: 18, frameColor: '#2c2c31', frameRadius: 24,
    notch: 'none', sideButtons: 'ipad',
  },
  {
    id: 'ipad-pro-13', name: 'iPad Pro 13"', icon: 'Pro\n13', iconType: 'tablet',
    width: 1024, height: 1366, pixelRatio: 2,
    category: 'mobile', brand: 'Apple',
    screenRadius: 18, bezel: 20, frameColor: '#2c2c31', frameRadius: 26,
    notch: 'none', sideButtons: 'ipad',
  },
  {
    id: 'ipad-air', name: 'iPad Air', icon: 'Air', iconType: 'tablet',
    width: 820, height: 1180, pixelRatio: 2,
    category: 'mobile', brand: 'Apple',
    screenRadius: 18, bezel: 18, frameColor: '#3a3a3f', frameRadius: 24,
    notch: 'none', sideButtons: 'ipad',
  },
  {
    id: 'ipad-mini', name: 'iPad mini', icon: 'Mini', iconType: 'tablet',
    width: 744, height: 1133, pixelRatio: 2,
    category: 'mobile', brand: 'Apple',
    screenRadius: 18, bezel: 14, frameColor: '#3a3a3f', frameRadius: 22,
    notch: 'none', sideButtons: 'ipad',
  },

  // Samsung
  {
    id: 'galaxy-s23', name: 'Galaxy S23', icon: 'S23', iconType: 'phone',
    width: 360, height: 780, pixelRatio: 3,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 26, bezel: 4, frameColor: '#1a1a1e', frameRadius: 28,
    notch: 'punch-hole', sideButtons: 'android',
  },
  {
    id: 'galaxy-s24', name: 'Galaxy S24', icon: 'S24', iconType: 'phone',
    width: 360, height: 780, pixelRatio: 3,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 26, bezel: 4, frameColor: '#2a2a2e', frameRadius: 28,
    notch: 'punch-hole', sideButtons: 'android',
  },
  {
    id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra', icon: 'S24\nUltra', iconType: 'phone',
    width: 384, height: 824, pixelRatio: 3.75,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 14, bezel: 4, frameColor: '#3a3a3e', frameRadius: 16,
    notch: 'punch-hole', sideButtons: 'android',
  },
  {
    id: 'galaxy-z-fold-5', name: 'Galaxy Z Fold 5', icon: 'Fold\n5', iconType: 'fold',
    width: 768, height: 846, pixelRatio: 3,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 12, bezel: 5, frameColor: '#1a1a1e', frameRadius: 14,
    notch: 'punch-hole', sideButtons: 'android', fold: 'inner',
  },
  {
    id: 'galaxy-z-fold-6', name: 'Galaxy Z Fold 6', icon: 'Fold\n6', iconType: 'fold',
    width: 780, height: 856, pixelRatio: 3,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 14, bezel: 5, frameColor: '#2a2a2e', frameRadius: 16,
    notch: 'punch-hole', sideButtons: 'android', fold: 'inner',
  },
  {
    id: 'galaxy-z-flip-5', name: 'Galaxy Z Flip 5', icon: 'Flip\n5', iconType: 'phone',
    width: 360, height: 780, pixelRatio: 3,
    category: 'mobile', brand: 'Samsung',
    screenRadius: 26, bezel: 4, frameColor: '#2a2a2e', frameRadius: 28,
    notch: 'punch-hole', sideButtons: 'android',
  },

  // Google Pixel
  {
    id: 'pixel-7', name: 'Pixel 7', icon: '7', iconType: 'phone',
    width: 412, height: 915, pixelRatio: 2.625,
    category: 'mobile', brand: 'Google',
    screenRadius: 24, bezel: 5, frameColor: '#1a1a1e', frameRadius: 28,
    notch: 'punch-hole', sideButtons: 'pixel',
  },
  {
    id: 'pixel-8', name: 'Pixel 8', icon: '8', iconType: 'phone',
    width: 412, height: 915, pixelRatio: 2.625,
    category: 'mobile', brand: 'Google',
    screenRadius: 28, bezel: 5, frameColor: '#1e1e22', frameRadius: 32,
    notch: 'punch-hole', sideButtons: 'pixel',
  },
  {
    id: 'pixel-9', name: 'Pixel 9', icon: '9', iconType: 'phone',
    width: 412, height: 915, pixelRatio: 2.625,
    category: 'mobile', brand: 'Google',
    screenRadius: 32, bezel: 5, frameColor: '#222226', frameRadius: 36,
    notch: 'punch-hole', sideButtons: 'pixel',
  },
  {
    id: 'pixel-9-pro', name: 'Pixel 9 Pro', icon: '9\nPro', iconType: 'phone',
    width: 412, height: 915, pixelRatio: 2.625,
    category: 'mobile', brand: 'Google',
    screenRadius: 32, bezel: 5, frameColor: '#2a2a2e', frameRadius: 36,
    notch: 'punch-hole', sideButtons: 'pixel',
  },
  {
    id: 'pixel-fold', name: 'Pixel Fold', icon: 'Fold', iconType: 'fold',
    width: 756, height: 844, pixelRatio: 2.625,
    category: 'mobile', brand: 'Google',
    screenRadius: 16, bezel: 5, frameColor: '#1a1a1e', frameRadius: 18,
    notch: 'punch-hole', sideButtons: 'pixel', fold: 'inner',
  },

  // Desktop
  {
    id: 'macbook-pro-14', name: 'MacBook Pro 14"', icon: 'Pro\n14"', iconType: 'laptop',
    width: 1512, height: 982, pixelRatio: 2,
    category: 'desktop', brand: 'Apple',
    screenRadius: 0, bezel: 14, frameColor: '#2c2c31', frameRadius: 12,
    notch: 'macbook-notch', sideButtons: 'none',
  },
  {
    id: 'macbook-air-13', name: 'MacBook Air 13"', icon: 'Air\n13"', iconType: 'laptop',
    width: 1470, height: 956, pixelRatio: 2,
    category: 'desktop', brand: 'Apple',
    screenRadius: 0, bezel: 14, frameColor: '#3a3a3f', frameRadius: 12,
    notch: 'macbook-notch', sideButtons: 'none',
  },
  {
    id: 'generic-1080p', name: 'Generic 1080p', icon: '1080p', iconType: 'monitor',
    width: 1920, height: 1080, pixelRatio: 1,
    category: 'desktop', brand: 'Generic',
    screenRadius: 0, bezel: 16, frameColor: '#1a1a1e', frameRadius: 8,
    notch: 'none', sideButtons: 'none',
  },
  {
    id: 'generic-1440p', name: 'Generic 1440p', icon: '1440p', iconType: 'monitor',
    width: 2560, height: 1440, pixelRatio: 1,
    category: 'desktop', brand: 'Generic',
    screenRadius: 0, bezel: 16, frameColor: '#1a1a1e', frameRadius: 8,
    notch: 'none', sideButtons: 'none',
  },
];

export default devices;

export function getDevicesByCategory(category) {
  return devices.filter(d => d.category === category);
}

export function getDeviceById(id) {
  return devices.find(d => d.id === id);
}

export function getBrands(category) {
  const brands = [...new Set(devices.filter(d => d.category === category).map(d => d.brand))];
  return brands;
}

export const weatherThemeMap = {
  Clear: {
    label: '맑음',
    emoji: '☀️',
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.15)',
    background:
      'linear-gradient(145deg, #fef3c7 0%, #fffbeb 30%, #e0f2fe 70%, #f0f9ff 100%)',
    darkBackground:
      'linear-gradient(145deg, #0c1222 0%, #1a1f35 40%, #1e293b 100%)',
    cardGlow: 'rgba(251, 191, 36, 0.2)',
  },
  Clouds: {
    label: '흐림',
    emoji: '☁️',
    accent: '#64748b',
    accentSoft: 'rgba(100, 116, 139, 0.15)',
    background:
      'linear-gradient(145deg, #e2e8f0 0%, #f8fafc 40%, #e0e7ff 100%)',
    darkBackground:
      'linear-gradient(145deg, #0f1419 0%, #1e293b 50%, #1f2937 100%)',
    cardGlow: 'rgba(148, 163, 184, 0.15)',
  },
  Rain: {
    label: '비',
    emoji: '🌧️',
    accent: '#3b82f6',
    accentSoft: 'rgba(59, 130, 246, 0.15)',
    background:
      'linear-gradient(145deg, #dbeafe 0%, #eff6ff 35%, #e0e7ff 100%)',
    darkBackground:
      'linear-gradient(145deg, #0a1628 0%, #0f2744 45%, #1e293b 100%)',
    cardGlow: 'rgba(59, 130, 246, 0.2)',
  },
  Drizzle: {
    label: '이슬비',
    emoji: '🌦️',
    accent: '#6366f1',
    accentSoft: 'rgba(99, 102, 241, 0.15)',
    background:
      'linear-gradient(145deg, #e0e7ff 0%, #f8fafc 45%, #dbeafe 100%)',
    darkBackground:
      'linear-gradient(145deg, #0f1225 0%, #1e1b4b 40%, #1e293b 100%)',
    cardGlow: 'rgba(99, 102, 241, 0.18)',
  },
  Thunderstorm: {
    label: '천둥번개',
    emoji: '⛈️',
    accent: '#7c3aed',
    accentSoft: 'rgba(124, 58, 237, 0.15)',
    background:
      'linear-gradient(145deg, #cbd5e1 0%, #e2e8f0 40%, #c4b5fd 100%)',
    darkBackground:
      'linear-gradient(145deg, #020617 0%, #1e1b4b 50%, #312e81 100%)',
    cardGlow: 'rgba(124, 58, 237, 0.25)',
  },
  Snow: {
    label: '눈',
    emoji: '❄️',
    accent: '#38bdf8',
    accentSoft: 'rgba(56, 189, 248, 0.15)',
    background:
      'linear-gradient(145deg, #f0f9ff 0%, #ffffff 40%, #e0f2fe 100%)',
    darkBackground:
      'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardGlow: 'rgba(56, 189, 248, 0.15)',
  },
  Mist: {
    label: '안개',
    emoji: '🌫️',
    accent: '#94a3b8',
    accentSoft: 'rgba(148, 163, 184, 0.15)',
    background:
      'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
    darkBackground:
      'linear-gradient(145deg, #111827 0%, #1f2937 50%, #374151 100%)',
    cardGlow: 'rgba(148, 163, 184, 0.12)',
  },
  Fog: {
    label: '안개',
    emoji: '🌫️',
    accent: '#94a3b8',
    accentSoft: 'rgba(148, 163, 184, 0.15)',
    background:
      'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
    darkBackground:
      'linear-gradient(145deg, #111827 0%, #1f2937 50%, #374151 100%)',
    cardGlow: 'rgba(148, 163, 184, 0.12)',
  },
  Default: {
    label: '기본',
    emoji: '🌤️',
    accent: '#6366f1',
    accentSoft: 'rgba(99, 102, 241, 0.12)',
    background:
      'linear-gradient(145deg, #eef2ff 0%, #f8fafc 40%, #e0e7ff 100%)',
    darkBackground:
      'linear-gradient(145deg, #0f1225 0%, #1e1b4b 40%, #1e293b 100%)',
    cardGlow: 'rgba(99, 102, 241, 0.15)',
  },
};

export function getWeatherTheme(main, isDark = false) {
  const theme = weatherThemeMap[main] || weatherThemeMap.Default;

  return {
    ...theme,
    background: isDark ? theme.darkBackground : theme.background,
  };
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '좋은 밤이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후에요';
  return '좋은 저녁이에요';
}

export function formatTodayDate() {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
}

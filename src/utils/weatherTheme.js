export const weatherThemeMap = {
  Clear: {
    label: '맑음',
    emoji: '☀️',
    background:
      'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 45%, #fef9c3 100%)',
    darkBackground:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)',
  },
  Clouds: {
    label: '흐림',
    emoji: '☁️',
    background:
      'linear-gradient(135deg, #e5e7eb 0%, #f8fafc 45%, #dbeafe 100%)',
    darkBackground:
      'linear-gradient(135deg, #111827 0%, #1f2937 45%, #374151 100%)',
  },
  Rain: {
    label: '비',
    emoji: '🌧️',
    background:
      'linear-gradient(135deg, #dbeafe 0%, #eef2ff 45%, #cbd5e1 100%)',
    darkBackground:
      'linear-gradient(135deg, #0f172a 0%, #1e3a5f 45%, #1e293b 100%)',
  },
  Drizzle: {
    label: '이슬비',
    emoji: '🌦️',
    background:
      'linear-gradient(135deg, #dbeafe 0%, #f8fafc 50%, #e0e7ff 100%)',
    darkBackground:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
  },
  Thunderstorm: {
    label: '천둥번개',
    emoji: '⛈️',
    background:
      'linear-gradient(135deg, #cbd5e1 0%, #e2e8f0 50%, #94a3b8 100%)',
    darkBackground:
      'linear-gradient(135deg, #020617 0%, #1e293b 50%, #334155 100%)',
  },
  Snow: {
    label: '눈',
    emoji: '❄️',
    background:
      'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e2e8f0 100%)',
    darkBackground:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #475569 100%)',
  },
  Mist: {
    label: '안개',
    emoji: '🌫️',
    background:
      'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    darkBackground:
      'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
  },
  Fog: {
    label: '안개',
    emoji: '🌫️',
    background:
      'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    darkBackground:
      'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
  },
  Default: {
    label: '기본',
    emoji: '🌤️',
    background:
      'linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #dbeafe 100%)',
    darkBackground:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)',
  },
};

export function getWeatherTheme(main, isDark = false) {
  const theme = weatherThemeMap[main] || weatherThemeMap.Default;

  return {
    ...theme,
    background: isDark ? theme.darkBackground : theme.background,
  };
}

export const weatherThemeMap = {
  Clear: {
    label: '맑음',
    emoji: '☀️',
    background:
      'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 45%, #fef9c3 100%)',
  },
  Clouds: {
    label: '흐림',
    emoji: '☁️',
    background:
      'linear-gradient(135deg, #e5e7eb 0%, #f8fafc 45%, #dbeafe 100%)',
  },
  Rain: {
    label: '비',
    emoji: '🌧️',
    background:
      'linear-gradient(135deg, #dbeafe 0%, #eef2ff 45%, #cbd5e1 100%)',
  },
  Drizzle: {
    label: '이슬비',
    emoji: '🌦️',
    background:
      'linear-gradient(135deg, #dbeafe 0%, #f8fafc 50%, #e0e7ff 100%)',
  },
  Thunderstorm: {
    label: '천둥번개',
    emoji: '⛈️',
    background:
      'linear-gradient(135deg, #cbd5e1 0%, #e2e8f0 50%, #94a3b8 100%)',
  },
  Snow: {
    label: '눈',
    emoji: '❄️',
    background:
      'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e2e8f0 100%)',
  },
  Mist: {
    label: '안개',
    emoji: '🌫️',
    background:
      'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
  },
  Fog: {
    label: '안개',
    emoji: '🌫️',
    background:
      'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
  },
  Default: {
    label: '기본',
    emoji: '🌤️',
    background:
      'linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #dbeafe 100%)',
  },
};

export function getWeatherTheme(main) {
  return weatherThemeMap[main] || weatherThemeMap.Default;
}

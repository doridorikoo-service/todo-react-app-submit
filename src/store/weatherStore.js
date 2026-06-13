import { create } from 'zustand';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

const useWeatherStore = create((set) => ({
  weather: null,
  isLoading: false,
  error: null,
  lastCity: 'Seoul',

  fetchWeather: async (city) => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      set({ error: '도시명을 입력해 주세요.' });
      return;
    }

    if (!API_KEY) {
      set({
        weather: null,
        isLoading: false,
        error: '.env 파일에 OpenWeatherMap API 키를 입력해 주세요.',
        lastCity: trimmedCity,
      });
      return;
    }

    set({ isLoading: true, error: null, lastCity: trimmedCity });

    try {
      const params = new URLSearchParams({
        q: trimmedCity,
        units: 'metric',
        appid: API_KEY,
        lang: 'kr',
      });

      const response = await fetch(`${API_URL}?${params.toString()}`);

      if (!response.ok) {
        let message = `${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData?.message) {
            message = `${response.status} ${errorData.message}`;
          }
        } catch (_) {
          // JSON 형태가 아닌 오류 응답은 기본 메시지를 사용합니다.
        }

        throw new Error(message);
      }

      const data = await response.json();
      set({ weather: data, isLoading: false, error: null });
    } catch (error) {
      set({
        weather: null,
        isLoading: false,
        error: error.message || '날씨 정보를 불러오지 못했습니다.',
      });
    }
  },
}));

export default useWeatherStore;

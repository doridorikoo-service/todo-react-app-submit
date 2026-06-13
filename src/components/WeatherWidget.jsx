import { useEffect, useState } from 'react';
import {
  DEFAULT_WEATHER_CITY,
  getWeatherCityLabel,
  WEATHER_CITIES,
} from '../constants/weatherCities';
import useWeatherStore from '../store/weatherStore';
import { getWeatherTheme } from '../utils/weatherTheme';

function WeatherWidget() {
  const { weather, isLoading, error, fetchWeather, lastCity } =
    useWeatherStore();
  const [city, setCity] = useState(DEFAULT_WEATHER_CITY);

  useEffect(() => {
    fetchWeather(DEFAULT_WEATHER_CITY);
  }, [fetchWeather]);

  const handleCityChange = (event) => {
    const nextCity = event.target.value;
    setCity(nextCity);
    fetchWeather(nextCity);
  };

  const mainWeather = weather?.weather?.[0]?.main;
  const theme = getWeatherTheme(mainWeather);
  const selectedLabel = getWeatherCityLabel(lastCity || city);

  return (
    <aside className="w-full rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur lg:w-[360px] dark:border-slate-700/70 dark:bg-slate-900/85">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500 dark:text-blue-400">
            Weather
          </p>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            오늘의 날씨 {theme.emoji}
          </h2>
        </div>

        {weather && !isLoading && !error && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="h-14 w-14"
          />
        )}
      </div>

      <label
        htmlFor="weather-city"
        className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
      >
        지역 선택
      </label>
      <select
        id="weather-city"
        value={city}
        onChange={handleCityChange}
        disabled={isLoading}
        className="mb-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900/40"
      >
        {WEATHER_CITIES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          날씨 정보를 불러오는 중...
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          오류: {error}
        </div>
      )}

      {weather && !isLoading && !error && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {weather.name}, {weather.sys.country}
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <p className="font-bold capitalize text-slate-700 dark:text-slate-200">
                {weather.weather[0].description}
              </p>
              <p>체감 {Math.round(weather.main.feels_like)}°C</p>
              <p>습도 {weather.main.humidity}%</p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        선택 지역: {selectedLabel} · 배경 테마는 현재 날씨에 따라 바뀝니다.
      </p>
    </aside>
  );
}

export default WeatherWidget;

import { useEffect, useState } from 'react';
import {
  DEFAULT_WEATHER_CITY,
  getWeatherCityLabel,
  WEATHER_CITIES,
} from '../constants/weatherCities';
import useWeatherStore from '../store/weatherStore';
import { getWeatherTheme } from '../utils/weatherTheme';
import { DropletIcon, WindIcon } from './Icons';

function WeatherWidget({ accentColor }) {
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
  const accent = accentColor || theme.accent;

  return (
    <aside
      className="animate-fade-up-delay-2 min-w-0 overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${theme.accentSoft} 0%, var(--color-surface-elevated) 60%)`,
        boxShadow: `0 12px 40px ${theme.cardGlow}, var(--shadow-soft)`,
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              오늘의 날씨
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
              {theme.label} {theme.emoji}
            </h2>
          </div>

          {weather && !isLoading && !error && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="-mr-2 -mt-2 h-[72px] w-[72px] drop-shadow-sm"
            />
          )}
        </div>

        <label className="sr-only" htmlFor="weather-city">
          지역 선택
        </label>
        <select
          id="weather-city"
          value={city}
          onChange={handleCityChange}
          disabled={isLoading}
          className="mt-4 w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:ring-4 disabled:cursor-wait disabled:opacity-60 dark:border-slate-600/40 dark:bg-slate-800/50 dark:text-slate-200"
          style={{ '--tw-ring-color': `${accent}33` }}
        >
          {WEATHER_CITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {isLoading && (
          <div className="mt-4 space-y-3">
            <div className="skeleton h-10 rounded-xl" />
            <div className="skeleton h-16 rounded-xl" />
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-4 rounded-xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {weather && !isLoading && !error && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {weather.name}, {weather.sys.country}
            </p>
            <div className="mt-1 flex items-end gap-1">
              <span
                className="text-5xl font-black tracking-tight"
                style={{ color: accent }}
              >
                {Math.round(weather.main.temp)}
              </span>
              <span className="mb-2 text-2xl font-light text-slate-400">°C</span>
            </div>
            <p className="mt-1 text-sm font-medium capitalize text-slate-600 dark:text-slate-300">
              {weather.weather[0].description}
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/50 px-3 py-2.5 dark:bg-slate-800/40">
                <WindIcon className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-medium text-slate-400">
                    체감
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {Math.round(weather.main.feels_like)}°
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/50 px-3 py-2.5 dark:bg-slate-800/40">
                <DropletIcon className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-medium text-slate-400">
                    습도
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
          {selectedLabel} · 배경이 날씨에 맞게 변합니다
        </p>
      </div>
    </aside>
  );
}

export default WeatherWidget;

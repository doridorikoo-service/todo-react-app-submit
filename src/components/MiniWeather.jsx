import useWeatherStore from '../store/weatherStore';
import { getWeatherTheme } from '../utils/weatherTheme';

function MiniWeather({ accentColor, onClick }) {
  const { weather, isLoading, error } = useWeatherStore();
  const mainWeather = weather?.weather?.[0]?.main;
  const theme = getWeatherTheme(mainWeather);
  const accent = accentColor || theme.accent;

  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition hover:shadow-md active:scale-95 md:hidden"
      aria-label="오늘의 날씨 보기"
    >
      {isLoading && (
        <span className="skeleton h-5 w-14 rounded-md" aria-hidden="true" />
      )}

      {!isLoading && error && (
        <>
          <span className="text-base" aria-hidden="true">
            🌤️
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            날씨
          </span>
        </>
      )}

      {!isLoading && !error && weather && (
        <>
          {weather.weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt=""
              className="h-7 w-7"
              aria-hidden="true"
            />
          )}
          <span
            className="text-sm font-black tabular-nums"
            style={{ color: accent }}
          >
            {Math.round(weather.main.temp)}°
          </span>
        </>
      )}

      {!isLoading && !error && !weather && (
        <>
          <span className="text-base" aria-hidden="true">
            {theme.emoji}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">날씨</span>
        </>
      )}
    </button>
  );
}

export default MiniWeather;

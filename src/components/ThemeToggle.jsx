import useThemeStore from '../store/themeStore';
import { MoonIcon, SunIcon } from './Icons';

function ThemeToggle({ className = '' }) {
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '밝은 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '밝은 모드' : '다크 모드'}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white/60 text-slate-600 transition hover:bg-white hover:shadow-sm active:scale-95 dark:border-slate-600/60 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800 ${className}`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeToggle;

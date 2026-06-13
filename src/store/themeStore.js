import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function applyThemeClass(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'light',

      toggleTheme: () => {
        const next = get().mode === 'light' ? 'dark' : 'light';
        applyThemeClass(next);
        set({ mode: next });
      },
    }),
    {
      name: 'todo-theme-mode',
      onRehydrateStorage: () => (state) => {
        if (state?.mode) applyThemeClass(state.mode);
      },
    }
  )
);

export default useThemeStore;

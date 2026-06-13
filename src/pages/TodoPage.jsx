import { useEffect, useMemo, useState } from 'react';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import TodoToolbar from '../components/TodoToolbar';
import WeatherWidget from '../components/WeatherWidget';
import ThemeToggle from '../components/ThemeToggle';
import useThemeStore from '../store/themeStore';
import useTodoStore from '../store/todoStore';
import useWeatherStore from '../store/weatherStore';
import { getWeatherTheme } from '../utils/weatherTheme';

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const priorityDiff =
      (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);

    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function TodoPage() {
  const todos = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const weather = useWeatherStore((state) => state.weather);
  const themeMode = useThemeStore((state) => state.mode);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const pendingCount = useMemo(
    () => todos.filter((todo) => !todo.done).length,
    [todos]
  );
  const filteredTodos = useMemo(() => {
    const lowerSearchText = searchText.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(lowerSearchText);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && !todo.done) ||
        (filter === 'completed' && todo.done);

      return matchesSearch && matchesFilter;
    });
  }, [filter, searchText, todos]);

  const pendingTodos = sortTodos(filteredTodos.filter((todo) => !todo.done));
  const completedTodos = sortTodos(filteredTodos.filter((todo) => todo.done));
  const theme = getWeatherTheme(weather?.weather?.[0]?.main, themeMode === 'dark');

  return (
    <main
      className="min-h-screen px-4 py-6 transition-all duration-500 sm:px-6 lg:px-8"
      style={{ background: theme.background }}
    >
      <ThemeToggle />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1fr_380px] lg:items-start">
        <section className="mx-auto w-full max-w-2xl space-y-5">
          <header className="rounded-[2rem] border border-white/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
            <p className="text-sm font-bold text-blue-500 dark:text-blue-400">
              React + Zustand + Supabase + Weather API
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                My Tasks
              </h1>

              {pendingCount > 0 ? (
                <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
                  남은 할 일 {pendingCount}개
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  모두 완료!
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              추가, 수정, 완료 구분, 검색/필터, 우선순위, 마감일, 날씨 테마까지
              적용한 Todo 앱입니다.
            </p>
          </header>

          <AddTodo />

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              DB 오류: {error}
            </div>
          )}

          <TodoToolbar
            searchText={searchText}
            onSearchChange={setSearchText}
            filter={filter}
            onFilterChange={setFilter}
          />

          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                진행 중인 할 일
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                우선순위 높은 순으로 정렬
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm font-semibold text-slate-400 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-500">
                Supabase에서 할 일을 불러오는 중...
              </div>
            ) : pendingTodos.length > 0 ? (
              pendingTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm font-semibold text-slate-400 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-500">
                {searchText || filter !== 'all'
                  ? '조건에 맞는 미완료 항목이 없습니다.'
                  : '등록된 할 일이 없습니다.'}
              </div>
            )}
          </section>

          {completedTodos.length > 0 && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
                <p className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-500 shadow-sm dark:bg-slate-800/80 dark:text-slate-300">
                  완료된 항목 {completedTodos.length}개
                </p>
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                >
                  완료 항목 정리
                </button>
              </div>

              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </section>
          )}
        </section>

        <div className="lg:sticky lg:top-6">
          <WeatherWidget />

          <section className="mt-4 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              구현 기능 체크
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>✅ Todo 추가 / 완료 토글 / 삭제</li>
              <li>✅ 더블클릭 인라인 편집</li>
              <li>✅ 완료 항목 구분 표시</li>
              <li>✅ 남은 할 일 카운트 배지</li>
              <li>✅ 검색 및 전체/미완료/완료 필터</li>
              <li>✅ 우선순위·마감일 강조</li>
              <li>✅ Supabase DB 연동</li>
              <li>✅ OpenWeatherMap API 연동</li>
              <li>✅ 밝은/다크 모드 전환</li>
              <li>✅ 날씨별 배경 테마</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

export default TodoPage;

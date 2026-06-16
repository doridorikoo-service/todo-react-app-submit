import { useEffect, useMemo, useState } from 'react';
import AddTodo from '../components/AddTodo';
import EmptyState from '../components/EmptyState';
import { ChevronIcon, ClipboardIcon } from '../components/Icons';
import TodoItem from '../components/TodoItem';
import TodoToolbar from '../components/TodoToolbar';
import WeatherWidget from '../components/WeatherWidget';
import ThemeToggle from '../components/ThemeToggle';
import useThemeStore from '../store/themeStore';
import useTodoStore from '../store/todoStore';
import useWeatherStore from '../store/weatherStore';
import {
  formatTodayDate,
  getGreeting,
  getWeatherTheme,
} from '../utils/weatherTheme';

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
  none: 3,
};

function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const priorityDiff =
      (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);

    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function ProgressRing({ percent, accent }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
        {percent}%
      </span>
    </div>
  );
}

function SectionHeader({ title, count, expanded, onToggle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 items-center gap-2 text-left"
        aria-expanded={expanded}
      >
        <ChevronIcon expanded={expanded} className="text-slate-400" />
        <h2 className="truncate text-sm font-bold text-slate-700 dark:text-slate-200">
          {title}
          <span className="ml-1.5 font-medium text-slate-400">{count}</span>
        </h2>
      </button>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
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
  const [isPendingExpanded, setIsPendingExpanded] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const pendingCount = useMemo(
    () => todos.filter((todo) => !todo.done).length,
    [todos]
  );
  const completedCount = todos.length - pendingCount;
  const completionPercent =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

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

  const pendingTodos = sortTodos(todos.filter((todo) => !todo.done));
  const completedTodos = sortTodos(todos.filter((todo) => todo.done));
  const searchResults = sortTodos(filteredTodos);

  const handleClearCompleted = () => {
    if (completedTodos.length === 0) return;

    const confirmed = window.confirm(
      `완료된 할 일 ${completedTodos.length}개를 모두 삭제할까요?`
    );

    if (confirmed) {
      clearCompleted();
    }
  };

  const theme = getWeatherTheme(
    weather?.weather?.[0]?.main,
    themeMode === 'dark'
  );

  const loadingSkeleton = (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-[72px] rounded-2xl" />
      ))}
    </div>
  );

  return (
    <main
      className="relative min-h-screen w-full overflow-x-clip transition-all duration-700"
      style={{ background: theme.background }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${theme.accentSoft}, transparent)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
        <header className="animate-fade-up mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {formatTodayDate()}
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
              {getGreeting()}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {pendingCount > 0
                ? `오늘 ${pendingCount}개의 할 일이 남았어요`
                : todos.length > 0
                  ? '모든 할 일을 완료했어요!'
                  : '첫 번째 할 일을 추가해 보세요'}
            </p>
          </div>

          <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
            {todos.length > 0 && (
              <div className="glass-panel flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-2 sm:flex-initial sm:px-4">
                <ProgressRing
                  percent={completionPercent}
                  accent={theme.accent}
                />
                <div className="text-left">
                  <p className="text-[11px] font-medium text-slate-400">
                    진행률
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {completedCount}/{todos.length} 완료
                  </p>
                </div>
              </div>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_min(100%,320px)] xl:items-start xl:gap-8">
          <section className="min-w-0 space-y-4 sm:space-y-5">
            <AddTodo />

            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <div className="space-y-3">
              <SectionHeader
                title="진행 중"
                count={pendingTodos.length}
                expanded={isPendingExpanded}
                onToggle={() => setIsPendingExpanded((prev) => !prev)}
              />

              {isPendingExpanded &&
                (isLoading ? (
                  loadingSkeleton
                ) : pendingTodos.length > 0 ? (
                  <div className="space-y-2.5">
                    {pendingTodos.map((todo, index) => (
                      <div
                        key={todo.id}
                        className="animate-fade-up"
                        style={{ animationDelay: `${index * 0.04}s` }}
                      >
                        <TodoItem todo={todo} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ClipboardIcon}
                    title="진행 중인 할 일이 없어요"
                    description="위 입력창에서 새로운 할 일을 추가해 보세요"
                  />
                ))}
            </div>

            {completedTodos.length > 0 && (
              <div className="space-y-3 pt-2">
                <SectionHeader
                  title="완료됨"
                  count={completedTodos.length}
                  expanded={isCompletedExpanded}
                  onToggle={() => setIsCompletedExpanded((prev) => !prev)}
                  action={
                    <button
                      type="button"
                      onClick={handleClearCompleted}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      전체 삭제
                    </button>
                  }
                />

                {isCompletedExpanded && (
                  <div className="space-y-2.5">
                    {completedTodos.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>

          <aside className="min-w-0 space-y-4 xl:sticky xl:top-8">
            <WeatherWidget accentColor={theme.accent} />
            <TodoToolbar
              searchText={searchText}
              onSearchChange={setSearchText}
              filter={filter}
              onFilterChange={setFilter}
              results={searchResults}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TodoPage;

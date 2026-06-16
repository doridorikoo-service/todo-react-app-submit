import { useEffect, useMemo, useRef, useState } from 'react';
import AddTodo from '../components/AddTodo';
import EmptyState from '../components/EmptyState';
import { ChevronIcon, ClipboardIcon, SearchIcon } from '../components/Icons';
import TodoItem from '../components/TodoItem';
import TodoToolbar from '../components/TodoToolbar';
import WeatherWidget from '../components/WeatherWidget';
import MiniWeather from '../components/MiniWeather';
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

function ProgressRing({ percent, accent, compact = false }) {
  const radius = compact ? 13 : 18;
  const viewSize = compact ? 36 : 44;
  const ringClass = compact ? 'h-9 w-9' : 'h-12 w-12';
  const labelClass = compact
    ? 'text-[9px] font-bold text-slate-600 dark:text-slate-300'
    : 'text-[10px] font-bold text-slate-600 dark:text-slate-300';
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const center = viewSize / 2;

  return (
    <div className={`relative shrink-0 ${ringClass}`}>
      <svg
        className={`${ringClass} -rotate-90`}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={compact ? 2.5 : 3}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={compact ? 2.5 : 3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center ${labelClass}`}
      >
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
  const resultsRef = useRef(null);
  const weatherRef = useRef(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (!searchText.trim()) return;

    const timer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchText]);

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  const scrollToWeather = () => {
    weatherRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const isFiltering = searchText.trim() !== '' || filter !== 'all';

  const pendingTodos = useMemo(
    () => sortTodos(filteredTodos.filter((todo) => !todo.done)),
    [filteredTodos]
  );
  const completedTodos = useMemo(
    () => sortTodos(filteredTodos.filter((todo) => todo.done)),
    [filteredTodos]
  );
  const searchResults = filteredTodos;

  const showPendingSection = filter !== 'completed';
  const showCompletedSection = filter !== 'pending';

  const pendingEmptyTitle = isFiltering
    ? '조건에 맞는 진행 중인 할 일이 없어요'
    : '진행 중인 할 일이 없어요';
  const pendingEmptyDescription = isFiltering
    ? '검색어나 필터를 변경해 보세요'
    : '위 입력창에서 새로운 할 일을 추가해 보세요';

  const allCompletedCount = useMemo(
    () => todos.filter((todo) => todo.done).length,
    [todos]
  );

  const handleClearCompleted = () => {
    if (allCompletedCount === 0) return;

    const confirmed = window.confirm(
      `완료된 할 일 ${allCompletedCount}개를 모두 삭제할까요?`
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
            <div className="mt-1 flex items-center justify-between gap-3">
              <h1 className="min-w-0 text-xl font-black tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                {getGreeting()}
              </h1>
              <MiniWeather accentColor={theme.accent} onClick={scrollToWeather} />
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {pendingCount > 0
                ? `오늘 ${pendingCount}개의 할 일이 남았어요`
                : todos.length > 0
                  ? '모든 할 일을 완료했어요!'
                  : '첫 번째 할 일을 추가해 보세요'}
            </p>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 md:w-auto md:gap-3">
            {todos.length > 0 && (
              <>
                <div className="glass-panel flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 md:hidden">
                  <ProgressRing
                    percent={completionPercent}
                    accent={theme.accent}
                    compact
                  />
                  <span className="shrink-0 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {completedCount}/{todos.length}
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={searchText}
                      onChange={(event) => handleSearchChange(event.target.value)}
                      placeholder="검색"
                      className="w-full min-w-0 rounded-lg border border-slate-200/60 bg-white/50 py-1.5 pl-7 pr-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-600/60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                      aria-label="할 일 검색"
                    />
                  </div>
                </div>

                <div className="glass-panel hidden min-w-0 items-center gap-3 rounded-2xl px-4 py-2 md:flex">
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
              </>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_min(100%,320px)] xl:items-start xl:gap-8">
          <section ref={resultsRef} className="min-w-0 scroll-mt-4 space-y-4 sm:space-y-5">
            <AddTodo />

            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </div>
            )}

            {isFiltering && (
              <p className="rounded-xl bg-indigo-50/80 px-3 py-2 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                검색·필터 적용 중 · {filteredTodos.length}개 표시
              </p>
            )}

            {showPendingSection && (
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
                    title={pendingEmptyTitle}
                    description={pendingEmptyDescription}
                  />
                ))}
            </div>
            )}

            {showCompletedSection && (completedTodos.length > 0 || (isFiltering && filter === 'completed')) && (
              <div className="space-y-3 pt-2">
                <SectionHeader
                  title="완료됨"
                  count={completedTodos.length}
                  expanded={isCompletedExpanded}
                  onToggle={() => setIsCompletedExpanded((prev) => !prev)}
                  action={
                    completedTodos.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleClearCompleted}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      전체 삭제
                    </button>
                    ) : null
                  }
                />

                {isCompletedExpanded &&
                  (completedTodos.length > 0 ? (
                  <div className="space-y-2.5">
                    {completedTodos.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                  ) : (
                    <EmptyState
                      icon={ClipboardIcon}
                      title="조건에 맞는 완료 항목이 없어요"
                      description="검색어나 필터를 변경해 보세요"
                    />
                  ))}
              </div>
            )}

          </section>

          <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-8">
            <div className="order-1 xl:order-2">
              <TodoToolbar
                searchText={searchText}
                onSearchChange={handleSearchChange}
                filter={filter}
                onFilterChange={setFilter}
                results={searchResults}
                hideSearchOnMobile
              />
            </div>
            <div
              ref={weatherRef}
              className="order-2 scroll-mt-4 xl:order-1"
            >
              <WeatherWidget accentColor={theme.accent} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TodoPage;

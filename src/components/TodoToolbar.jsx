import { SearchIcon } from './Icons';

const filterTabs = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '진행' },
  { value: 'completed', label: '완료' },
];

const priorityLabel = {
  none: '없음',
  high: '높음',
  medium: '중간',
  low: '낮음',
};

const priorityDotClass = {
  none: 'bg-slate-400',
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

function scrollToTodo(id) {
  document.getElementById(`todo-${id}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

function TodoToolbar({
  searchText,
  onSearchChange,
  filter,
  onFilterChange,
  results = [],
  hideSearchOnMobile = false,
}) {
  return (
    <section className="glass-panel animate-fade-up-delay-3 min-w-0 rounded-2xl p-4 sm:p-5">
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
        검색 & 필터
      </h2>

      <div
        className={`relative mt-4 ${hideSearchOnMobile ? 'hidden md:block' : ''}`}
      >
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="todo-search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="할 일 검색..."
          className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-600/80 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          aria-label="할 일 검색"
        />
      </div>

      <div className="segmented-control mt-4" role="tablist" aria-label="상태 필터">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filter === tab.value}
            data-active={filter === tab.value ? 'true' : 'false'}
            onClick={() => onFilterChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            검색 결과
          </p>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
            {results.length}
          </span>
        </div>

        {results.length > 0 ? (
          <ul className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
            {results.map((todo) => (
              <li key={todo.id}>
                <button
                  type="button"
                  onClick={() => scrollToTodo(todo.id)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      todo.done
                        ? 'bg-slate-300 dark:bg-slate-600'
                        : priorityDotClass[todo.priority] ||
                          priorityDotClass.none
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-xs font-medium ${
                        todo.done
                          ? 'text-slate-400 line-through dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {todo.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                      <span>{priorityLabel[todo.priority] || '없음'}</span>
                      {todo.dueDate && <span>{todo.dueDate}</span>}
                      <span>{todo.done ? '완료' : '진행 중'}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-slate-50/80 px-4 py-6 text-center text-xs text-slate-400 dark:bg-slate-800/40 dark:text-slate-500">
            {filter !== 'all' || searchText.trim()
              ? '조건에 맞는 할 일이 없습니다'
              : '등록된 할 일이 없습니다'}
          </p>
        )}
      </div>
    </section>
  );
}

export default TodoToolbar;

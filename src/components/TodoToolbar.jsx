const filterTabs = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '미완료' },
  { value: 'completed', label: '완료' },
];

const priorityLabel = {
  none: '없음',
  high: '높음',
  medium: '중간',
  low: '낮음',
};

const priorityBadgeClass = {
  none: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
  high: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
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
}) {
  return (
    <section className="mt-4 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
        검색 · 필터
      </h2>

      <label
        htmlFor="todo-search"
        className="mt-3 block text-xs font-semibold text-slate-500 dark:text-slate-400"
      >
        할 일 검색
      </label>
      <input
        id="todo-search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="제목으로 검색하기"
        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
      />

      <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        상태 필터
      </p>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onFilterChange(tab.value)}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            검색 결과
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {results.length}개
          </span>
        </div>

        {results.length > 0 ? (
          <ul className="space-y-1.5">
            {results.map((todo) => (
              <li key={todo.id}>
                <button
                  type="button"
                  onClick={() => scrollToTodo(todo.id)}
                  className="flex w-full items-start gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-2.5 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:bg-slate-800/80 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      todo.done ? 'bg-slate-300 dark:bg-slate-600' : 'bg-blue-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-xs font-semibold ${
                        todo.done
                          ? 'text-slate-400 line-through dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {todo.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-1">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          priorityBadgeClass[todo.priority] ||
                          priorityBadgeClass.none
                        }`}
                      >
                        {priorityLabel[todo.priority] || '없음'}
                      </span>
                      {todo.dueDate && (
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          {todo.dueDate}
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        {todo.done ? '완료' : '진행'}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs font-medium text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
            {filter !== 'all' || searchText.trim()
              ? '조건에 맞는 할 일이 없습니다.'
              : '등록된 할 일이 없습니다.'}
          </p>
        )}
      </div>
    </section>
  );
}

export default TodoToolbar;

const filterTabs = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '미완료' },
  { value: 'completed', label: '완료' },
];

function TodoToolbar({ searchText, onSearchChange, filter, onFilterChange }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <label className="sr-only" htmlFor="todo-search">
        할 일 검색
      </label>
      <input
        id="todo-search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="제목으로 검색하기"
        className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
      />

      <div className="grid grid-cols-3 gap-2">
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
    </section>
  );
}

export default TodoToolbar;

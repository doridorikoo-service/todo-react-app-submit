import { useState } from 'react';
import useTodoStore from '../store/todoStore';
import { PlusIcon } from './Icons';

const priorityOptions = [
  { value: 'none', label: '없음', dot: 'bg-slate-400' },
  { value: 'high', label: '높음', dot: 'bg-red-500' },
  { value: 'medium', label: '중간', dot: 'bg-amber-500' },
  { value: 'low', label: '낮음', dot: 'bg-emerald-500' },
];

const inputClassName =
  'w-full rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-600/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20';

function AddTodo() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('none');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const addTodo = useTodoStore((state) => state.addTodo);
  const isSaving = useTodoStore((state) => state.isSaving);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSaving) return;

    const success = await addTodo({ title: trimmedTitle, priority, dueDate });

    if (success) {
      setTitle('');
      setPriority('none');
      setDueDate('');
      setIsExpanded(false);
    }
  };

  const selectedPriority = priorityOptions.find((o) => o.value === priority);

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel-elevated animate-fade-up-delay-1 min-w-0 overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-2 p-2">
        <div className="relative min-w-0 flex-1">
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="새로운 할 일을 입력하세요"
            disabled={isSaving}
            className="w-full min-w-0 rounded-xl border-0 bg-transparent px-2 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 sm:px-3 dark:text-slate-100 dark:placeholder:text-slate-500"
            aria-label="할 일 내용"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || isSaving}
          aria-busy={isSaving}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none sm:h-11 sm:w-11 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          aria-label={isSaving ? '저장 중' : '할 일 추가'}
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <PlusIcon />
          )}
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isExpanded || priority !== 'none' || dueDate
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-3 border-t border-slate-200/60 px-3 py-3 sm:grid-cols-2 sm:px-4 dark:border-slate-700/60">
            <div className="min-w-0">
              <label
                htmlFor="todo-priority"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                우선순위
              </label>
              <div className="relative">
                <select
                  id="todo-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  disabled={isSaving}
                  className={`${inputClassName} appearance-none pr-8`}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span
                  className={`pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${selectedPriority?.dot}`}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="todo-due-date"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                마감일
              </label>
              <input
                id="todo-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={isSaving}
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddTodo;

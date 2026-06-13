import { useState } from 'react';
import useTodoStore from '../store/todoStore';

const priorityOptions = [
  { value: 'none', label: '없음' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '중간' },
  { value: 'low', label: '낮음' },
];

const fieldClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40';

const labelClassName =
  'text-xs font-semibold text-slate-500 dark:text-slate-400';

function AddTodo() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('none');
  const [dueDate, setDueDate] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    addTodo({ title: trimmedTitle, priority, dueDate });
    setTitle('');
    setPriority('none');
    setDueDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90"
    >
      <div className="flex flex-wrap items-end gap-3 lg:flex-nowrap">
        <div className="w-[6rem] shrink-0">
          <label htmlFor="todo-priority" className={labelClassName}>
            우선순위
          </label>
          <select
            id="todo-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className={`mt-1 ${fieldClassName}`}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[9.5rem] shrink-0">
          <label htmlFor="todo-due-date" className={labelClassName}>
            마감일
          </label>
          <input
            id="todo-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={`mt-1 ${fieldClassName}`}
          />
        </div>

        <div className="min-w-[140px] flex-1 basis-[180px]">
          <label htmlFor="todo-title" className={labelClassName}>
            할 일
          </label>
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="내용 입력"
            className={`mt-1 ${fieldClassName}`}
          />
        </div>

        <button
          type="submit"
          className="h-[42px] shrink-0 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          추가
        </button>
      </div>
    </form>
  );
}

export default AddTodo;

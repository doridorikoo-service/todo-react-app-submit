import { useRef, useState } from 'react';
import useTodoStore from '../store/todoStore';
import {
  CalendarIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from './Icons';

const priorityStyle = {
  none: {
    label: '없음',
    badge:
      'bg-slate-100 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300',
    dot: 'bg-slate-400',
    ring: 'ring-slate-200/60 dark:ring-slate-600/40',
  },
  high: {
    label: '높음',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    dot: 'bg-red-500',
    ring: 'ring-red-200/60 dark:ring-red-800/40',
  },
  medium: {
    label: '중간',
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200/60 dark:ring-amber-800/40',
  },
  low: {
    label: '낮음',
    badge:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200/60 dark:ring-emerald-800/40',
  },
};

function getLocalDate(dateText) {
  if (!dateText) return null;
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getDueInfo(dueDate, done) {
  if (!dueDate || done) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = getLocalDate(dueDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: '마감 초과',
      badge:
        'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
      urgent: true,
    };
  }

  if (diffDays === 0) {
    return {
      text: '오늘 마감',
      badge:
        'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
      urgent: true,
    };
  }

  if (diffDays <= 2) {
    return {
      text: `D-${diffDays}`,
      badge:
        'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      urgent: false,
    };
  }

  return {
    text: `${diffDays}일 남음`,
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    urgent: false,
  };
}

function TodoItem({ todo }) {
  const { toggleTodo, updateTodo, updatePriority, updateDueDate, deleteTodo } =
    useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const isCancelingRef = useRef(false);

  const currentPriority = priorityStyle[todo.priority] || priorityStyle.none;
  const dueInfo = getDueInfo(todo.dueDate, todo.done);

  const startEditing = () => {
    if (todo.done) return;
    setDraftTitle(todo.title);
    setIsEditing(true);
  };

  const commitEdit = () => {
    if (isCancelingRef.current) {
      isCancelingRef.current = false;
      return;
    }

    const nextTitle = draftTitle.trim();
    if (nextTitle && nextTitle !== todo.title) {
      updateTodo(todo.id, nextTitle);
    }
    setDraftTitle(nextTitle || todo.title);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    isCancelingRef.current = true;
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  return (
    <article
      id={`todo-${todo.id}`}
      className={`group glass-panel min-w-0 overflow-hidden rounded-2xl p-3.5 transition-all duration-200 sm:p-4 hover:shadow-md ${
        todo.done ? 'opacity-60' : ''
      } ${dueInfo?.urgent && !todo.done ? `ring-1 ${currentPriority.ring}` : ''}`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox mt-0.5"
          aria-label={`${todo.title} 완료 여부`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {isEditing ? (
              <input
                type="text"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={commitEdit}
                autoFocus
                className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 outline-none ring-4 ring-indigo-500/10 dark:border-indigo-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-indigo-500/20"
              />
            ) : (
              <button
                type="button"
                onDoubleClick={startEditing}
                title="더블클릭하여 수정"
                className={`flex min-w-0 flex-1 items-start gap-1.5 text-left text-sm font-medium leading-snug break-words sm:text-[15px] ${
                  todo.done
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className="min-w-0 flex-1">{todo.title}</span>
                {!todo.done && (
                  <PencilIcon className="mt-1 h-3 w-3 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
                )}
              </button>
            )}
          </div>

          <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1.5">
            <label className="sr-only" htmlFor={`todo-priority-${todo.id}`}>
              우선순위
            </label>
            <div className="relative inline-flex max-w-full items-center">
              <FlagIcon className="pointer-events-none absolute left-2.5 h-3 w-3 text-slate-400" />
              <select
                id={`todo-priority-${todo.id}`}
                value={todo.priority}
                onChange={(event) =>
                  updatePriority(todo.id, event.target.value)
                }
                className={`max-w-full cursor-pointer appearance-none rounded-lg py-1 pl-7 pr-6 text-[11px] font-semibold outline-none transition hover:opacity-80 ${currentPriority.badge}`}
                aria-label="우선순위 변경"
              >
                <option value="none">없음</option>
                <option value="high">높음</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
            </div>

            {!todo.done ? (
              <div className="order-last flex w-full items-center gap-1.5 border-t border-slate-200/60 pt-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0 dark:border-slate-700/60">
                <label className="sr-only" htmlFor={`todo-due-${todo.id}`}>
                  마감일
                </label>
                <div className="relative inline-flex min-w-0 flex-1 items-center sm:flex-initial">
                  <CalendarIcon className="pointer-events-none absolute left-2.5 h-3 w-3 text-slate-400" />
                  <input
                    id={`todo-due-${todo.id}`}
                    type="date"
                    value={todo.dueDate || ''}
                    onChange={(event) =>
                      updateDueDate(todo.id, event.target.value)
                    }
                    className="w-full min-w-0 cursor-pointer rounded-lg border-0 bg-slate-100/80 py-1 pl-7 pr-1 text-[11px] font-semibold text-slate-600 outline-none transition hover:bg-slate-200/80 focus:ring-2 focus:ring-indigo-500/20 sm:max-w-[9.5rem] dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700"
                    aria-label="마감일 변경"
                  />
                </div>
                {todo.dueDate && dueInfo && (
                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold ${dueInfo.badge}`}
                  >
                    {dueInfo.text}
                  </span>
                )}
              </div>
            ) : (
              todo.dueDate && (
                <span className="order-last w-full rounded-lg border-t border-slate-200/60 bg-transparent px-0 py-2 text-[11px] font-medium text-slate-500 sm:order-none sm:w-auto sm:border-0 sm:py-0 sm:px-2 sm:bg-slate-100 dark:border-slate-700/60 dark:sm:bg-slate-700 dark:text-slate-400">
                  {todo.dueDate}
                </span>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 sm:text-slate-300 sm:opacity-0 sm:group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          aria-label={`${todo.title} 삭제`}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

export default TodoItem;

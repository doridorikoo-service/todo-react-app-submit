import { useRef, useState } from 'react';
import { formatDueDateLabel } from '../constants/todoMeta';
import useTodoStore from '../store/todoStore';
import { ChevronIcon, PencilIcon, TrashIcon } from './Icons';

const metaChipClass = 'todo-meta-chip shrink-0';

const priorityStyle = {
  none: {
    label: '없음',
    badge:
      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    ring: 'ring-slate-200/60 dark:ring-slate-600/40',
  },
  high: {
    label: '높음',
    badge:
      'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
    ring: 'ring-red-200/60 dark:ring-red-800/40',
  },
  medium: {
    label: '중간',
    badge:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    ring: 'ring-amber-200/60 dark:ring-amber-800/40',
  },
  low: {
    label: '낮음',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    ring: 'ring-emerald-200/60 dark:ring-emerald-800/40',
  },
};

const dateChipClass =
  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';

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

function PrioritySelect({ id, value, onChange, badgeClass, label }) {
  return (
    <div className={`relative shrink-0 ${metaChipClass} ${badgeClass} pr-4`}>
      <span className="pointer-events-none">{label}</span>
      <ChevronIcon
        expanded
        className="pointer-events-none absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 opacity-40"
      />
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="우선순위 변경"
      >
        <option value="none">없음</option>
        <option value="high">높음</option>
        <option value="medium">중간</option>
        <option value="low">낮음</option>
      </select>
    </div>
  );
}

function DueDateControl({ id, value, onChange, done }) {
  const label = formatDueDateLabel(value);

  if (done) {
    return (
      <span className={`${metaChipClass} ${dateChipClass}`}>{label}</span>
    );
  }

  return (
    <div
      className={`relative shrink-0 ${metaChipClass} ${dateChipClass} ${value ? 'todo-meta-date max-w-[7.25rem]' : ''}`}
    >
      <span className="pointer-events-none">{label}</span>
      <input
        id={id}
        type="date"
        value={value || ''}
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="마감일 변경"
      />
    </div>
  );
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

  const handleDelete = () => {
    const confirmed = window.confirm(`"${todo.title}" 할 일을 삭제할까요?`);

    if (confirmed) {
      deleteTodo(todo.id);
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
          <div className="flex items-start gap-1.5 sm:gap-2">
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
              <>
                <button
                  type="button"
                  onDoubleClick={startEditing}
                  className={`min-w-0 flex-1 text-left text-sm font-medium leading-snug break-words sm:text-[15px] ${
                    todo.done
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {todo.title}
                </button>
                {!todo.done && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                    aria-label={`${todo.title} 수정`}
                    title="수정"
                  >
                    <PencilIcon />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-2 flex flex-nowrap items-center gap-1.5 overflow-x-auto">
            <label className="sr-only" htmlFor={`todo-priority-${todo.id}`}>
              우선순위
            </label>
            <PrioritySelect
              id={`todo-priority-${todo.id}`}
              value={todo.priority}
              onChange={(event) => updatePriority(todo.id, event.target.value)}
              badgeClass={currentPriority.badge}
              label={currentPriority.label}
            />

            {!todo.done ? (
              <>
                <DueDateControl
                  id={`todo-due-${todo.id}`}
                  value={todo.dueDate}
                  onChange={(event) =>
                    updateDueDate(todo.id, event.target.value)
                  }
                  done={false}
                />
                {todo.dueDate && dueInfo && (
                  <span className={`${metaChipClass} ${dueInfo.badge}`}>
                    {dueInfo.text}
                  </span>
                )}
              </>
            ) : (
              <DueDateControl
                id={`todo-due-done-${todo.id}`}
                value={todo.dueDate}
                onChange={() => {}}
                done
              />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
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

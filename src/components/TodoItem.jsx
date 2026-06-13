import { useRef, useState } from 'react';
import useTodoStore from '../store/todoStore';

const priorityStyle = {
  high: {
    label: '높음',
    badge: 'bg-red-50 text-red-600 border-red-100',
    border: 'border-l-red-400',
  },
  medium: {
    label: '보통',
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    border: 'border-l-blue-400',
  },
  low: {
    label: '낮음',
    badge: 'bg-slate-50 text-slate-500 border-slate-100',
    border: 'border-l-slate-300',
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
      className: 'border-red-200 bg-red-50/80',
      badge: 'bg-red-100 text-red-600',
    };
  }

  if (diffDays === 0) {
    return {
      text: '오늘 마감',
      className: 'border-amber-200 bg-amber-50/80',
      badge: 'bg-amber-100 text-amber-700',
    };
  }

  if (diffDays <= 2) {
    return {
      text: `${diffDays}일 남음`,
      className: 'border-yellow-200 bg-yellow-50/70',
      badge: 'bg-yellow-100 text-yellow-700',
    };
  }

  return {
    text: `${diffDays}일 남음`,
    className: 'border-slate-200 bg-white/90',
    badge: 'bg-slate-100 text-slate-500',
  };
}

function TodoItem({ todo }) {
  const { toggleTodo, updateTodo, updatePriority, deleteTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const isCancelingRef = useRef(false);

  const currentPriority = priorityStyle[todo.priority] || priorityStyle.medium;
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
      className={`rounded-3xl border border-l-4 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${currentPriority.border} ${
        dueInfo?.className || 'border-slate-200 bg-white/90'
      } ${todo.done ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          className="mt-1 h-5 w-5 rounded accent-blue-600"
          aria-label={`${todo.title} 완료 여부`}
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              autoFocus
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-4 ring-blue-50"
            />
          ) : (
            <button
              type="button"
              onDoubleClick={startEditing}
              title="더블클릭하면 수정할 수 있습니다."
              className={`w-full text-left text-sm font-semibold leading-6 ${
                todo.done
                  ? 'text-slate-400 line-through'
                  : 'text-slate-800 hover:text-blue-700'
              }`}
            >
              {todo.title}
            </button>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <select
              value={todo.priority}
              onChange={(event) => updatePriority(todo.id, event.target.value)}
              className={`rounded-full border px-2 py-1 text-xs font-semibold outline-none ${currentPriority.badge}`}
              aria-label="우선순위 변경"
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>

            {todo.dueDate && (
              <span
                className={`rounded-full px-2 py-1 font-semibold ${
                  dueInfo?.badge || 'bg-slate-100 text-slate-500'
                }`}
              >
                {todo.dueDate} · {dueInfo?.text || '완료됨'}
              </span>
            )}

            {!todo.done && (
              <span className="text-slate-400">더블클릭으로 수정</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="rounded-2xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label={`${todo.title} 삭제`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default TodoItem;

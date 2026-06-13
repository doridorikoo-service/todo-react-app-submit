import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTodos = [
  {
    id: 1,
    title: 'React Todo 프로젝트 요구사항 확인하기',
    done: false,
    priority: 'high',
    dueDate: '',
    createdAt: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 2,
    title: '날씨 API 키 .env에 입력하기',
    done: false,
    priority: 'medium',
    dueDate: '',
    createdAt: '2026-06-10T09:10:00.000Z',
  },
  {
    id: 3,
    title: '실행 화면 캡처해서 제출 파일 정리하기',
    done: true,
    priority: 'low',
    dueDate: '',
    createdAt: '2026-06-10T09:20:00.000Z',
  },
];

const createTodo = ({ title, priority = 'medium', dueDate = '' }) => ({
  id: Date.now(),
  title,
  done: false,
  priority,
  dueDate,
  createdAt: new Date().toISOString(),
});

const useTodoStore = create(
  persist(
    (set) => ({
      todos: initialTodos,

      addTodo: ({ title, priority, dueDate }) =>
        set((state) => ({
          todos: [...state.todos, createTodo({ title, priority, dueDate })],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
          ),
        })),

      updateTodo: (id, newTitle) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, title: newTitle } : todo
          ),
        })),

      updatePriority: (id, priority) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, priority } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.done),
        })),
    }),
    {
      name: 'todo-react-app-storage',
    }
  )
);

export default useTodoStore;

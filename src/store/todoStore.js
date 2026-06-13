import { create } from 'zustand';
import {
  createTodo as createTodoInDb,
  fetchTodos,
  patchTodo,
  removeCompletedTodos,
  removeTodo,
} from '../lib/todoApi';

const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });

    try {
      const todos = await fetchTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || '할 일 목록을 불러오지 못했습니다.',
      });
    }
  },

  addTodo: async ({ title, priority, dueDate }) => {
    set({ isSaving: true, error: null });

    try {
      const todo = await createTodoInDb({ title, priority, dueDate });
      set((state) => ({
        todos: [...state.todos, todo],
        isSaving: false,
      }));
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || '할 일을 추가하지 못했습니다.',
      });
    }
  },

  toggleTodo: async (id) => {
    const current = get().todos.find((todo) => todo.id === id);
    if (!current) return;

    set({ error: null });

    try {
      const updated = await patchTodo(id, { done: !current.done });
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
    } catch (error) {
      set({ error: error.message || '완료 상태를 변경하지 못했습니다.' });
    }
  },

  updateTodo: async (id, newTitle) => {
    set({ error: null });

    try {
      const updated = await patchTodo(id, { title: newTitle });
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
    } catch (error) {
      set({ error: error.message || '할 일을 수정하지 못했습니다.' });
    }
  },

  updatePriority: async (id, priority) => {
    set({ error: null });

    try {
      const updated = await patchTodo(id, { priority });
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
    } catch (error) {
      set({ error: error.message || '우선순위를 변경하지 못했습니다.' });
    }
  },

  updateDueDate: async (id, dueDate) => {
    set({ error: null });

    try {
      const updated = await patchTodo(id, { dueDate });
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
    } catch (error) {
      set({ error: error.message || '마감일을 변경하지 못했습니다.' });
    }
  },

  deleteTodo: async (id) => {
    set({ error: null });

    try {
      await removeTodo(id);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || '할 일을 삭제하지 못했습니다.' });
    }
  },

  clearCompleted: async () => {
    set({ error: null });

    try {
      await removeCompletedTodos();
      set((state) => ({
        todos: state.todos.filter((todo) => !todo.done),
      }));
    } catch (error) {
      set({ error: error.message || '완료 항목을 정리하지 못했습니다.' });
    }
  },
}));

export default useTodoStore;

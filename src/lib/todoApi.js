import { isSupabaseConfigured, supabase } from './supabase';

export function mapTodoRow(row) {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    priority: row.priority,
    dueDate: row.due_date ?? '',
    createdAt: row.created_at,
  };
}

function toDbTodo({ title, done = false, priority = 'medium', dueDate = '' }) {
  return {
    title,
    done,
    priority,
    due_date: dueDate || null,
  };
}

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      '.env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_PUBLISHABLE_KEY를 입력해 주세요.'
    );
  }
}

export async function fetchTodos() {
  assertSupabase();

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTodoRow);
}

export async function createTodo({ title, priority, dueDate }) {
  assertSupabase();

  const { data, error } = await supabase
    .from('todos')
    .insert(toDbTodo({ title, priority, dueDate }))
    .select('*')
    .single();

  if (error) throw error;

  return mapTodoRow(data);
}

export async function patchTodo(id, changes) {
  assertSupabase();

  const payload = {};

  if ('title' in changes) payload.title = changes.title;
  if ('done' in changes) payload.done = changes.done;
  if ('priority' in changes) payload.priority = changes.priority;
  if ('dueDate' in changes) payload.due_date = changes.dueDate || null;

  const { data, error } = await supabase
    .from('todos')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return mapTodoRow(data);
}

export async function removeTodo(id) {
  assertSupabase();

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) throw error;
}

export async function removeCompletedTodos() {
  assertSupabase();

  const { error } = await supabase.from('todos').delete().eq('done', true);

  if (error) throw error;
}

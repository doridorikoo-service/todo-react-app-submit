-- Supabase SQL Editor에서 실행하세요.
-- Table Editor > todos 테이블 생성 + RLS 정책

create extension if not exists "pgcrypto";

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  done boolean not null default false,
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  due_date date,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists todos_done_created_at_idx
  on public.todos (done, created_at desc);

alter table public.todos enable row level security;

drop policy if exists "todos_select_anon" on public.todos;
drop policy if exists "todos_insert_anon" on public.todos;
drop policy if exists "todos_update_anon" on public.todos;
drop policy if exists "todos_delete_anon" on public.todos;

create policy "todos_select_anon"
  on public.todos
  for select
  to anon, authenticated
  using (true);

create policy "todos_insert_anon"
  on public.todos
  for insert
  to anon, authenticated
  with check (true);

create policy "todos_update_anon"
  on public.todos
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "todos_delete_anon"
  on public.todos
  for delete
  to anon, authenticated
  using (true);

-- 샘플 데이터 (선택)
insert into public.todos (title, done, priority, due_date, created_at)
values
  (
    'React Todo 프로젝트 요구사항 확인하기',
    false,
    'high',
    current_date,
    timezone('utc', now()) - interval '3 days'
  ),
  (
    '날씨 API 키 .env에 입력하기',
    false,
    'medium',
    current_date + 2,
    timezone('utc', now()) - interval '2 days'
  ),
  (
    '실행 화면 캡처해서 제출 파일 정리하기',
    true,
    'low',
    null,
    timezone('utc', now()) - interval '1 day'
  );

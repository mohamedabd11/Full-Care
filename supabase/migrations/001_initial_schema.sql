-- ============================================================
-- فل كير — مخطط قاعدة البيانات الأولي
-- انسخي هذا الملف بالكامل وألصقيه في:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. جدول الملف الشخصي (يُنشأ تلقائياً عند التسجيل)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'مستخدمة',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- دالة تُنشئ ملفاً شخصياً تلقائياً عند تسجيل مستخدمة جديدة
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'مستخدمة'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. جدول إعدادات الحَبْسَة (سجل واحد لكل مستخدمة)
create table if not exists public.habsa_configs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  mode text not null check (mode in ('wedding_date', 'duration')),
  start_date_iso text not null,
  wedding_date_iso text,
  total_days integer,
  created_at_iso text not null,
  updated_at timestamptz not null default now()
);

alter table public.habsa_configs enable row level security;

create policy "users can manage own habsa config"
  on public.habsa_configs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. جدول سجلّ المهام المكتملة
create table if not exists public.completed_tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  date_iso text not null,
  task_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, date_iso)
);

alter table public.completed_tasks enable row level security;

create policy "users can manage own tasks"
  on public.completed_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. جدول الشارات المفتوحة
create table if not exists public.unlocked_badges (
  user_id uuid primary key references auth.users(id) on delete cascade,
  badge_ids jsonb not null default '[]'::jsonb,
  habsa_completed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.unlocked_badges enable row level security;

create policy "users can manage own badges"
  on public.unlocked_badges for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 応募（掲載応募・ラジオ出演応募）を1つの表で持つ。
-- 書き込みはサーバー（service_role）だけ。読み書きの画面は /admin で、admin_users に載ったログインユーザーだけ。

create type public.application_kind as enum (
  'listing',  -- 掲載応募（/）
  'radio'     -- ラジオ出演応募（/radio）
);

-- 応募ボード（knowledge/applications/_index.md）の段階と同じ並び
create type public.application_stage as enum (
  'received',     -- 受付
  'replied',      -- 返信済
  'scheduling',   -- 取材調整中
  'interviewed',  -- 取材実施
  'drafting',     -- ドラフト中
  'review',       -- 本人確認待ち
  'ready',        -- 公開準備
  'published',    -- 公開済
  'on_hold',      -- 保留
  'declined'      -- 辞退
);

create type public.radio_selection as enum (
  'pending',       -- 選考前
  'selected',      -- 出演
  'not_selected'   -- 出演なし
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  kind public.application_kind not null,
  band_name text not null check (char_length(band_name) between 1 and 200),
  contact_name text check (char_length(contact_name) <= 100),
  contact text check (char_length(contact) <= 500),   -- メールアドレス または SNS のURL
  purpose text check (char_length(purpose) <= 100),    -- 掲載応募の希望種別など
  details jsonb not null default '{}'::jsonb,           -- フォームごとの回答（ラジオの2問など）

  -- 運用（管理ページで更新する）
  stage public.application_stage not null default 'received',
  radio_selection public.radio_selection,
  next_action text,
  publish_date date,
  article_url text,
  memo text,

  source text not null default 'form' check (source in ('form', 'import'))
);

create index applications_created_at_idx on public.applications (created_at desc);
create index applications_kind_stage_idx on public.applications (kind, stage);

create function public.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

-- 管理ページにログインできる人
create table public.admin_users (
  email text primary key
);

create function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.applications enable row level security;
alter table public.admin_users enable row level security;

-- anon には何も許可しない（応募の書き込みはサーバーの service_role が行う）
revoke all on public.applications from anon;
revoke all on public.admin_users from anon, authenticated;

create policy "admins read applications"
  on public.applications for select
  to authenticated
  using (public.is_admin());

create policy "admins update applications"
  on public.applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.admin_users (email) values ('simple.records.2022@gmail.com');

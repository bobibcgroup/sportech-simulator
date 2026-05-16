create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  club_name   text not null,
  sport       text not null,
  region      text not null,
  fan_base    bigint not null,
  adoption    numeric not null,
  premium_mix numeric not null,
  games       int not null,
  spend_level text not null,
  name        text not null,
  email       text not null,
  role        text not null,
  website     text,
  year1_rev   numeric not null,
  year5_total numeric not null,
  valuation   numeric not null
);

create table if not exists funnel_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  session_id  text not null,
  step        int not null
);

-- Enable RLS
alter table leads enable row level security;
alter table funnel_events enable row level security;

-- Service role can do everything (used by API routes)
create policy "service role full access leads"
  on leads for all using (true);

create policy "service role full access funnel"
  on funnel_events for all using (true);

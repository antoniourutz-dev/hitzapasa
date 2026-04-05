do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('matches', 'match_players')
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      policy_row.policyname,
      policy_row.tablename
    );
  end loop;
end
$$;

create or replace function public.is_match_participant(target_match_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.match_players mp
    where mp.match_id = target_match_id
      and mp.player_id = auth.uid()
  );
$$;

revoke all on function public.is_match_participant(uuid) from public;
grant execute on function public.is_match_participant(uuid) to authenticated;

alter table public.matches enable row level security;
alter table public.match_players enable row level security;

create policy matches_select_participants
on public.matches
for select
to authenticated
using (
  created_by = auth.uid()
  or public.is_match_participant(id)
);

create policy match_players_select_participants
on public.match_players
for select
to authenticated
using (
  public.is_match_participant(match_id)
);

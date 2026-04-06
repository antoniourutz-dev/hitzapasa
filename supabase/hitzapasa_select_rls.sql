-- hitzapasa: irakurketa publikoa (anon) jokoarentzat, RLS gaituta badago.
-- Exekutatu Supabase → SQL Editor (proiektuko supererabiltzailea).
--
-- Sintoma: REST bidez 0 lerro edo galderak kargatu ezin (Nahasketa barne),
-- baina SQL editoretik ikus daitezke datuak.

alter table public.hitzapasa enable row level security;

drop policy if exists hitzapasa_select_active_public on public.hitzapasa;

create policy hitzapasa_select_active_public
on public.hitzapasa
for select
to anon, authenticated
using (active = true);

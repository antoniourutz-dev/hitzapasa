# AGENTS.md

## Proyecto
Hitzapasa PWA en euskera.

## Fase actual online
Implementar:
- set_ready
- lobby realtime
- transición automática a siguiente estado online

## Backend
Usar exclusivamente Supabase.

Edge Functions relevantes:
- create_match
- join_match
- set_ready

Tablas relevantes:
- matches
- match_players
- match_events

## Reglas
- No hacer inserts críticos directos en matches ni match_players desde el cliente
- Reutilizar el lobby compartido ya existente
- Toda la UI visible debe estar en euskera
- No implementar todavía submit_answer ni pass_turn
- No implementar todavía la partida online completa

## Done
- Prest nago funciona
- El lobby se actualiza con realtime
- Ambos jugadores ven estados sincronizados
- Si ambos están listos, la app pasa automáticamente al siguiente estado


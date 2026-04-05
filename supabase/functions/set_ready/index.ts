import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'
import {
  erregistratuMatchEvent,
  jsonResponse,
  lortuPartida,
  lortuPartidakoJokalariak,
} from '../_shared/online-game.ts'

type SetReadyBody = {
  matchId?: string
  roomCode?: string
  isReady?: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Metodo ez onartua' }, 405)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Autentifikazioa behar da' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey =
      Deno.env.get('SUPABASE_ANON_KEY') ??
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
    const serviceRoleKey =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? supabaseAnonKey

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return jsonResponse(
        { error: 'Supabase ingurune-aldagaiak falta dira' },
        500
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })
    const admin = createClient(supabaseUrl, serviceRoleKey)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return jsonResponse({ error: 'Erabiltzailea ez da baliozkoa' }, 401)
    }

    const body = (await req.json()) as SetReadyBody
    const matchId = `${body.matchId ?? ''}`.trim()
    const roomCode = `${body.roomCode ?? ''}`.trim().toUpperCase()
    const isReady = Boolean(body.isReady)

    if (!matchId || !roomCode) {
      return jsonResponse({ error: 'Datuak falta dira' }, 400)
    }

    const match = await lortuPartida(admin, matchId, roomCode)
    if (!match) {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 404)
    }

    if (match.room_code !== roomCode) {
      return jsonResponse({ error: 'Gelaren kodea ez dator bat' }, 400)
    }

    if (!['waiting', 'ready'].includes(match.status)) {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 400)
    }

    const players = await lortuPartidakoJokalariak(admin, match.id)
    const player = players.find((item) => item.player_id === user.id)

    if (!player) {
      return jsonResponse({ error: 'Ez zaude partida honetan' }, 403)
    }

    const { error: updateError } = await admin
      .from('match_players')
      .update({ is_ready: isReady })
      .eq('match_id', match.id)
      .eq('player_id', user.id)

    if (updateError) {
      return jsonResponse({ error: 'Ezin izan da prest egoera gorde' }, 500)
    }

    const refreshedPlayers = await lortuPartidakoJokalariak(admin, match.id)
    const bothReady =
      refreshedPlayers.length === 2 &&
      refreshedPlayers.every((item) => item.is_ready === true)

    await erregistratuMatchEvent(admin, {
      matchId: match.id,
      playerId: user.id,
      seat: player.seat,
      eventType: 'player_ready',
      eventPayload: {
        isReady,
        bothReady,
      },
    })

    return jsonResponse({
      success: true,
      message: bothReady ? 'Bi jokalariak prest daude' : 'Jokalaria prest dago',
      match: {
        id: match.id,
        room_code: match.room_code,
        status: match.status,
        topic: match.topic,
        level: match.level,
        created_at: match.created_at ?? null,
        game_state: match.game_state ?? null,
      },
      player: {
        seat: player.seat,
        player_id: player.player_id,
        is_ready: isReady,
      },
      players: refreshedPlayers.map((item) => ({
        seat: item.seat,
        player_id: item.player_id,
        is_ready: item.is_ready,
        is_connected: Boolean(item.is_connected),
        rosco: item.rosco ?? null,
        time_remaining_ms: Number(item.time_remaining_ms ?? 150000),
        hits: Number(item.hits ?? 0),
        errors: Number(item.errors ?? 0),
        unanswered: Number(item.unanswered ?? 25),
        letters_state: Array.isArray(item.letters_state) ? item.letters_state : [],
      })),
      bothReady,
    })
  } catch (error) {
    return jsonResponse(
      {
        error: 'Barneko errorea',
        details: error instanceof Error ? error.message : String(error),
      },
      500
    )
  }
})

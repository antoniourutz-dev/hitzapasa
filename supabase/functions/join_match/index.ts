import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'
import {
  erregistratuMatchEvent,
  jsonResponse,
  lortuPartida,
  lortuPartidakoJokalariak,
} from '../_shared/online-game.ts'

type JoinMatchBody = {
  roomCode?: string
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

    await ziurtatuProfila(admin, user.id)

    const body = (await req.json()) as JoinMatchBody
    const roomCode = `${body.roomCode ?? ''}`.trim().toUpperCase()

    if (!roomCode) {
      return jsonResponse({ error: 'Gelaren kodea derrigorrezkoa da' }, 400)
    }

    const match = await lortuPartida(admin, '', roomCode)

    if (!match) {
      return jsonResponse({ error: 'Kode hori ez da baliozkoa' }, 404)
    }

    if (!['waiting', 'ready'].includes(match.status)) {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 400)
    }

    const existingPlayers = await lortuPartidakoJokalariak(admin, match.id)
    const alreadyIn = existingPlayers.find((player) => player.player_id === user.id)

    if (alreadyIn) {
      return jsonResponse({
        success: true,
        message: 'Partidan sartu zara',
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
          seat: alreadyIn.seat,
          player_id: alreadyIn.player_id,
          is_ready: alreadyIn.is_ready,
        },
        players: existingPlayers.map((player) => ({
          seat: player.seat,
          player_id: player.player_id,
          is_ready: player.is_ready,
          is_connected: Boolean(player.is_connected),
          rosco: player.rosco ?? null,
          time_remaining_ms: Number(player.time_remaining_ms ?? 300000),
          hits: Number(player.hits ?? 0),
          errors: Number(player.errors ?? 0),
          unanswered: Number(player.unanswered ?? 25),
          letters_state: Array.isArray(player.letters_state) ? player.letters_state : [],
        })),
      })
    }

    if (existingPlayers.length >= 2) {
      return jsonResponse({ error: 'Gela beteta dago' }, 400)
    }

    const { data: insertedPlayer, error: playerError } = await admin
      .from('match_players')
      .insert({
        match_id: match.id,
        player_id: user.id,
        seat: 2,
        topic: match.topic,
        level: match.level,
        rosco: null,
        time_remaining_ms: 300000,
        hits: 0,
        errors: 0,
        unanswered: 25,
        is_connected: true,
        is_ready: false,
        letters_state: [],
      })
      .select(
        'match_id, player_id, seat, is_ready, is_connected, rosco, time_remaining_ms, hits, errors, unanswered, letters_state'
      )
      .single()

    if (playerError || !insertedPlayer) {
      return jsonResponse({ error: 'Ezin izan da partidan sartu' }, 500)
    }

    const { data: updatedMatch, error: matchError } = await admin
      .from('matches')
      .update({ status: 'ready' })
      .eq('id', match.id)
      .select('id, room_code, status, topic, level, created_at, game_state')
      .single()

    if (matchError || !updatedMatch) {
      return jsonResponse({ error: 'Ezin izan da partida eguneratu' }, 500)
    }

    const refreshedPlayers = await lortuPartidakoJokalariak(admin, match.id)

    await erregistratuMatchEvent(admin, {
      matchId: match.id,
      playerId: user.id,
      seat: 2,
      eventType: 'player_joined',
      eventPayload: {
        roomCode,
      },
    })

    return jsonResponse({
      success: true,
      message: 'Partidan sartu zara',
      match: {
        id: updatedMatch.id,
        room_code: updatedMatch.room_code,
        status: updatedMatch.status,
        topic: updatedMatch.topic,
        level: updatedMatch.level,
        created_at: updatedMatch.created_at ?? null,
        game_state: updatedMatch.game_state ?? null,
      },
      player: {
        seat: insertedPlayer.seat,
        player_id: insertedPlayer.player_id,
        is_ready: insertedPlayer.is_ready,
      },
      players: refreshedPlayers.map((player) => ({
        seat: player.seat,
        player_id: player.player_id,
        is_ready: player.is_ready,
        is_connected: Boolean(player.is_connected),
        rosco: player.rosco ?? null,
        time_remaining_ms: Number(player.time_remaining_ms ?? 300000),
        hits: Number(player.hits ?? 0),
        errors: Number(player.errors ?? 0),
        unanswered: Number(player.unanswered ?? 25),
        letters_state: Array.isArray(player.letters_state) ? player.letters_state : [],
      })),
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

async function ziurtatuProfila(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
    },
    {
      onConflict: 'id',
      ignoreDuplicates: true,
    }
  )

  if (!error) {
    return
  }

  const mezua = `${error.message ?? ''}`.toLowerCase()

  if (
    mezua.includes('column') ||
    mezua.includes('does not exist') ||
    mezua.includes('no existe')
  ) {
    return
  }

  throw new Error(error.message)
}

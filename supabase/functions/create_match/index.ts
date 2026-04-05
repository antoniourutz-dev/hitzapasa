import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'

type CreateMatchBody = {
  topic?: string
  level?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse(
        { error: 'Metodo ez onartua' },
        405
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse(
        { error: 'Autentifikazioa behar da' },
        401
      )
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
      return jsonResponse(
        { error: 'Erabiltzailea ez da baliozkoa' },
        401
      )
    }

    await ziurtatuProfila(admin, user.id)

    const body = (await req.json()) as CreateMatchBody
    const topic = (body.topic ?? '').trim()
    const level = `${body.level ?? ''}`.trim()

    if (!topic) {
      return jsonResponse(
        { error: 'Gaia derrigorrezkoa da' },
        400
      )
    }

    if (!level) {
      return jsonResponse(
        { error: 'Maila ez da baliozkoa' },
        400
      )
    }

    const roomCode = await generateUniqueRoomCode(admin)

    const { data: match, error: matchError } = await admin
      .from('matches')
      .insert({
        room_code: roomCode,
        status: 'waiting',
        topic,
        level,
        created_by: user.id,
        game_state: {
          phase: 'waiting',
          topic,
          level,
          turnPlayerSeat: null,
          turnPlayerId: null,
          turnStartedAt: null,
          startedAt: null,
          finishedAt: null,
          winnerSeat: null,
          reason: null,
          player1: null,
          player2: null,
        },
      })
      .select()
      .single()

    if (matchError || !match) {
      return jsonResponse(
        {
          error: 'Ezin izan da partida sortu',
          details: matchError?.message ?? null,
        },
        500
      )
    }

    const initialLettersState = '[]'

    const { data: playerRow, error: playerError } = await admin
      .from('match_players')
      .insert({
        match_id: match.id,
        player_id: user.id,
        seat: 1,
        topic,
        level,
        rosco: null,
        time_remaining_ms: 150000,
        hits: 0,
        errors: 0,
        unanswered: 25,
        is_connected: true,
        is_ready: false,
        letters_state: JSON.parse(initialLettersState),
      })
      .select()
      .single()

    if (playerError || !playerRow) {
      await admin.from('matches').delete().eq('id', match.id)

      return jsonResponse(
        {
          error: 'Ezin izan da jokalaria partidan sartu',
          details: playerError?.message ?? null,
        },
        500
      )
    }

    const { error: eventError } = await admin
      .from('match_events')
      .insert({
        match_id: match.id,
        player_id: user.id,
        seat: 1,
        event_type: 'match_created',
        payload: {
          topic,
          level,
          roomCode,
          createdBy: user.id,
        },
      })

    if (eventError) {
      return jsonResponse(
        {
          error: 'Partida sortu da, baina ezin izan da gertaera erregistratu',
          match,
          player: playerRow,
          details: eventError.message,
        },
        200
      )
    }

    return jsonResponse(
      {
        success: true,
        message: 'Partida sortu da',
        match: {
          id: match.id,
          room_code: match.room_code,
          status: match.status,
          topic: match.topic,
          level: match.level,
          created_at: match.created_at,
        },
        player: {
          seat: playerRow.seat,
          player_id: playerRow.player_id,
          is_ready: playerRow.is_ready,
        },
      },
      200
    )
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

async function generateUniqueRoomCode(
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  const maxAttempts = 10

  for (let i = 0; i < maxAttempts; i++) {
    const { data, error } = await supabase.rpc('generate_room_code', {
      code_length: 6,
    })

    if (error || !data) {
      throw new Error('Ezin izan da room code sortu')
    }

    const code = String(data)

    const { data: existing, error: existingError } = await supabase
      .from('matches')
      .select('id')
      .eq('room_code', code)
      .maybeSingle()

    if (existingError) {
      throw new Error(existingError.message)
    }

    if (!existing) {
      return code
    }
  }

  throw new Error('Ezin izan da room code bakarra sortu')
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

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

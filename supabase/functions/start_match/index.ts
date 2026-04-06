import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'

type StartMatchBody = {
  matchId?: string
  roomCode?: string
}

type MatchRow = {
  id: string
  room_code: string
  status: string
  topic: string
  level: string
  created_at?: string
  game_state?: Record<string, unknown> | null
}

type MatchPlayerRow = {
  match_id: string
  player_id: string
  seat: number
  is_ready: boolean
  is_connected?: boolean | null
  rosco?: string | null
}

type QuestionRow = {
  slot_order: number
  letter: string
  clue: string
  answer: string
  accepted_answers?: string[]
}

type PlayerState = {
  seat: number
  rosco: string
  currentSlotOrder: number
  hits: number
  errors: number
  unanswered: number
  timeRemainingMs: number
  letters: Array<{
    slotOrder: number
    letter: string
    status: 'pending'
  }>
}

function normalizatuAcceptedAnswers(rawValue: unknown): string[] {
  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item) => `${item ?? ''}`.trim())
      .filter(Boolean)
  }

  if (typeof rawValue === 'string') {
    const testua = rawValue.trim()

    if (!testua) {
      return []
    }

    if (testua.startsWith('[')) {
      try {
        const parsed = JSON.parse(testua)
        return normalizatuAcceptedAnswers(parsed)
      } catch (_error) {
        // Jarraitu beheko banaketarekin.
      }
    }

    return testua
      .split(/[|;\n]+/u)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
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

    const body = (await req.json()) as StartMatchBody
    const matchId = (body.matchId ?? '').trim()
    const roomCode = (body.roomCode ?? '').trim().toUpperCase()

    if (!matchId && !roomCode) {
      return jsonResponse({ error: 'Partida identifikatzailea falta da' }, 400)
    }

    const match = await loadMatch(admin, matchId, roomCode)
    if (!match) {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 404)
    }

    const players = await loadPlayers(admin, match.id)
    const requester = players.find((player) => player.player_id === user.id)

    if (!requester) {
      return jsonResponse({ error: 'Ez zaude partida honetan' }, 403)
    }

    if (match.status === 'playing' && match.game_state) {
      return jsonResponse({
        success: true,
        message: 'Partida hasi da',
        match,
        players: players.map(toClientPlayer),
        bothReady: players.every((player) => player.is_ready),
      })
    }

    if (match.status === 'finished') {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 400)
    }

    if (players.length !== 2) {
      return jsonResponse({ error: 'Bi jokalari behar dira partida hasteko' }, 400)
    }

    if (!players.every((player) => player.is_ready)) {
      return jsonResponse({ error: 'Bi jokalariak prest egon behar dira' }, 400)
    }

    if (match.status !== 'ready' && match.status !== 'waiting') {
      return jsonResponse({ error: 'Partida ez dago hasteko prest' }, 400)
    }

    const [seat1, seat2] = [...players].sort((a, b) => a.seat - b.seat)
    const [rosco1, rosco2] = await pickTwoDistinctRoscos(admin, match.topic, match.level)

    if (!rosco1 || !rosco2 || rosco1 === rosco2) {
      return jsonResponse({ error: 'Ez dago nahikoa erroskarik' }, 400)
    }

    const [questions1, questions2] = await Promise.all([
      loadRoscoQuestions(admin, match.topic, match.level, rosco1),
      loadRoscoQuestions(admin, match.topic, match.level, rosco2),
    ])

    validateQuestions(questions1)
    validateQuestions(questions2)

    const startedAt = new Date().toISOString()
    const player1State = buildPlayerState(seat1.seat, rosco1, questions1)
    const player2State = buildPlayerState(seat2.seat, rosco2, questions2)
    const gameState =
      (await tryInitializeMatchGameStateRpc(admin, {
        matchId: match.id,
        topic: match.topic,
        level: match.level,
        startedAt,
        turnPlayerSeat: 1,
        player1: player1State,
        player2: player2State,
      })) ??
      buildInitialGameState(match, seat1.player_id, player1State, player2State, startedAt)

    const updatedPlayers = await updateMatchPlayers(admin, match.id, [
      {
        player: seat1,
        rosco: rosco1,
        letters: player1State.letters,
      },
      {
        player: seat2,
        rosco: rosco2,
        letters: player2State.letters,
      },
    ])

    const matchUpdatePayload = {
      status: 'playing',
      game_state: gameState,
      current_turn_seat: gameState.turnPlayerSeat,
      current_turn_player_id: gameState.turnPlayerId,
      turn_started_at: gameState.turnStartedAt,
      started_at: gameState.startedAt,
      finished_at: gameState.finishedAt,
      winner_seat: gameState.winnerSeat,
      finish_reason: gameState.reason,
    }

    let { data: updatedMatch, error: matchUpdateError } = await admin
      .from('matches')
      .update(matchUpdatePayload)
      .eq('id', match.id)
      .select('id, room_code, status, topic, level, created_at, game_state')
      .single()

    if (matchUpdateError || !updatedMatch) {
      const fallback = await admin
        .from('matches')
        .update({
          status: 'playing',
          game_state: gameState,
        })
        .eq('id', match.id)
        .select('id, room_code, status, topic, level, created_at, game_state')
        .single()

      updatedMatch = fallback.data
      matchUpdateError = fallback.error
    }

    if (matchUpdateError || !updatedMatch) {
      return jsonResponse(
        {
          error: 'Ezin izan da partida hasi',
          details: matchUpdateError?.message ?? null,
        },
        500
      )
    }

    await admin.from('match_events').insert({
      match_id: match.id,
      player_id: requester.player_id,
      seat: requester.seat,
      event_type: 'match_started',
      payload: {
        topic: match.topic,
        level: match.level,
        roomCode: match.room_code,
        player1Rosco: rosco1,
        player2Rosco: rosco2,
      },
    })

    return jsonResponse({
      success: true,
      message: 'Partida hasi da',
      match: updatedMatch,
      players: updatedPlayers.map(toClientPlayer),
      bothReady: true,
      game_state: gameState,
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

async function loadMatch(
  supabase: ReturnType<typeof createClient>,
  matchId: string,
  roomCode: string
): Promise<MatchRow | null> {
  const kontsulta = supabase
    .from('matches')
    .select('id, room_code, status, topic, level, created_at, game_state')

  const iragazita = matchId
    ? kontsulta.eq('id', matchId)
    : kontsulta.eq('room_code', roomCode)

  const { data, error } = await iragazita.maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as MatchRow | null) ?? null
}

async function loadPlayers(
  supabase: ReturnType<typeof createClient>,
  matchId: string
): Promise<MatchPlayerRow[]> {
  const { data, error } = await supabase
    .from('match_players')
    .select('match_id, player_id, seat, is_ready, is_connected, rosco')
    .eq('match_id', matchId)
    .order('seat', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data as MatchPlayerRow[] | null) ?? []
}

async function pickTwoDistinctRoscos(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  level: string
): Promise<[string, string]> {
  const aukera = await tryPickTwoDistinctRoscosRpc(supabase, topic, level)
  const roscos = aukera ?? (await fallbackPickTwoDistinctRoscos(supabase, topic, level))

  if (!Array.isArray(roscos) || roscos.length < 2) {
    throw new Error('Ez dago nahikoa erroskarik')
  }

  return [roscos[0], roscos[1]]
}

async function tryPickTwoDistinctRoscosRpc(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  level: string
): Promise<string[] | null> {
  const aldaerak = [
    { topic, level },
    { p_topic: topic, p_level: level },
    { match_topic: topic, match_level: level },
    { selected_topic: topic, selected_level: level },
    { selectedTopic: topic, selectedLevel: level },
  ]

  for (const parametroak of aldaerak) {
    const { data, error } = await supabase.rpc('pick_two_distinct_roscos', parametroak)

    if (error || !data) {
      continue
    }

    const roscos = parseRoscosResponse(data)
    if (roscos.length >= 2) {
      return roscos.slice(0, 2)
    }
  }

  return null
}

async function fallbackPickTwoDistinctRoscos(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  level: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('hitzapasa')
    .select('rosco, slot_order, letter, clue, answer, accepted_answers')
    .eq('topic', topic)
    .eq('level', level)
    .eq('active', true)
    .order('rosco', { ascending: true })
    .order('slot_order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const grouped = new Map<string, QuestionRow[]>()

  for (const row of data ?? []) {
    const rosco = String(row.rosco ?? '').trim()
    if (!rosco) {
      continue
    }

    const bucket = grouped.get(rosco) ?? []
    bucket.push({
      slot_order: Number(row.slot_order ?? 0),
      letter: String(row.letter ?? '').trim(),
      clue: String(row.clue ?? '').trim(),
      answer: String(row.answer ?? '').trim(),
      accepted_answers: normalizatuAcceptedAnswers(row.accepted_answers),
    })
    grouped.set(rosco, bucket)
  }

  return [...grouped.entries()]
    .filter(([, rows]) => isValidQuestionSet(rows))
    .map(([rosco]) => rosco)
    .slice(0, 2)
}

function parseRoscosResponse(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim()
        }

        if (item && typeof item === 'object') {
          const row = item as Record<string, unknown>
          return String(
            row.rosco ??
              row.value ??
              row.first ??
              row.second ??
              row.player1_rosco ??
              row.player2_rosco ??
              ''
          ).trim()
        }

        return ''
      })
      .filter(Boolean)
  }

  if (data && typeof data === 'object') {
    const row = data as Record<string, unknown>
    return [
      row.rosco1,
      row.rosco2,
      row.player1_rosco,
      row.player2_rosco,
      row.first,
      row.second,
    ]
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
  }

  return []
}

async function loadRoscoQuestions(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  level: string,
  rosco: string
): Promise<QuestionRow[]> {
  const { data, error } = await supabase
    .from('hitzapasa')
    .select('slot_order, letter, clue, answer, accepted_answers')
    .eq('topic', topic)
    .eq('level', level)
    .eq('rosco', rosco)
    .eq('active', true)
    .order('slot_order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => ({
    slot_order: Number(row.slot_order ?? 0),
    letter: String(row.letter ?? '').trim(),
    clue: String(row.clue ?? '').trim(),
    answer: String(row.answer ?? '').trim(),
    accepted_answers: normalizatuAcceptedAnswers(row.accepted_answers),
  }))
}

function validateQuestions(rows: QuestionRow[]) {
  if (!isValidQuestionSet(rows)) {
    throw new Error('Erroska bakoitzak 25 galdera baliodun behar ditu')
  }
}

function isValidQuestionSet(rows: QuestionRow[]) {
  if (!Array.isArray(rows) || rows.length !== 25) {
    return false
  }

  const seenLetters = new Set<string>()

  return rows.every((row) => {
    const letter = row.letter.trim().toUpperCase()
    if (!row.slot_order || !letter || !row.clue || !row.answer) {
      return false
    }

    if (seenLetters.has(letter)) {
      return false
    }

    seenLetters.add(letter)
    return true
  })
}

function buildPlayerState(
  seat: number,
  rosco: string,
  questions: QuestionRow[]
): PlayerState {
  return {
    seat,
    rosco,
    currentSlotOrder: Number(questions[0]?.slot_order ?? 1),
    hits: 0,
    errors: 0,
    unanswered: 25,
    timeRemainingMs: 300000,
    letters: questions.map((question) => ({
      slotOrder: Number(question.slot_order),
      letter: question.letter.trim().toUpperCase(),
      status: 'pending' as const,
    })),
  }
}

async function tryInitializeMatchGameStateRpc(
  supabase: ReturnType<typeof createClient>,
  input: {
    matchId: string
    topic: string
    level: string
    startedAt: string
    turnPlayerSeat: number
    player1: PlayerState
    player2: PlayerState
  }
) {
  const aldaerak = [
    {
      match_id: input.matchId,
      topic: input.topic,
      level: input.level,
      started_at: input.startedAt,
      turn_player_seat: input.turnPlayerSeat,
      player1: input.player1,
      player2: input.player2,
    },
    {
      p_match_id: input.matchId,
      p_topic: input.topic,
      p_level: input.level,
      p_started_at: input.startedAt,
      p_turn_player_seat: input.turnPlayerSeat,
      p_player1: input.player1,
      p_player2: input.player2,
    },
    {
      matchId: input.matchId,
      topic: input.topic,
      level: input.level,
      startedAt: input.startedAt,
      turnPlayerSeat: input.turnPlayerSeat,
      player1: input.player1,
      player2: input.player2,
    },
  ]

  for (const parametroak of aldaerak) {
    const { data, error } = await supabase.rpc('initialize_match_game_state', parametroak)

    if (error || !data) {
      continue
    }

    if (data && typeof data === 'object') {
      const payload = data as Record<string, unknown>

      if (payload.game_state && typeof payload.game_state === 'object') {
        return payload.game_state
      }

      if (payload.player1 && payload.player2) {
        return payload
      }
    }
  }

  return null
}

function buildInitialGameState(
  match: MatchRow,
  turnPlayerId: string,
  player1: PlayerState,
  player2: PlayerState,
  startedAt: string
) {
  return {
    phase: 'playing',
    topic: match.topic,
    level: match.level,
    turnPlayerSeat: 1,
    turnPlayerId,
    turnStartedAt: startedAt,
    startedAt,
    finishedAt: null,
    winnerSeat: null,
    reason: null,
    player1,
    player2,
  }
}

async function updateMatchPlayers(
  supabase: ReturnType<typeof createClient>,
  matchId: string,
  updates: Array<{
    player: MatchPlayerRow
    rosco: string
    letters: PlayerState['letters']
  }>
) {
  const updatedRows: MatchPlayerRow[] = []

  for (const update of updates) {
    const { data, error } = await supabase
      .from('match_players')
      .update({
        rosco: update.rosco,
        time_remaining_ms: 300000,
        hits: 0,
        errors: 0,
        unanswered: 25,
        letters_state: update.letters,
      })
      .eq('match_id', matchId)
      .eq('seat', update.player.seat)
      .select(
        'match_id, player_id, seat, is_ready, is_connected, rosco'
      )
      .single()

    if (error || !data) {
      throw new Error(error?.message ?? 'Ezin izan da jokalariaren erroska eguneratu')
    }

    updatedRows.push(data as MatchPlayerRow)
  }

  return updatedRows
}

function toClientPlayer(player: MatchPlayerRow) {
  return {
    seat: player.seat,
    player_id: player.player_id,
    is_ready: player.is_ready,
    is_connected: Boolean(player.is_connected),
    rosco: player.rosco ?? null,
  }
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

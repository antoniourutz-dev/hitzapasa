import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'

const HASIERAKO_DENBORA_MS = 300000

export type MatchRow = {
  id: string
  room_code: string
  status: string
  topic: string
  level: string
  created_at?: string
  game_state?: GameState | Record<string, unknown> | null
}

export type MatchPlayerRow = {
  match_id: string
  player_id: string
  seat: number
  is_ready: boolean
  is_connected?: boolean | null
  rosco?: string | null
  time_remaining_ms?: number | null
  hits?: number | null
  errors?: number | null
  unanswered?: number | null
  letters_state?: GameLetterState[] | null
}

export type QuestionRow = {
  slot_order: number
  letter: string
  clue?: string
  answer: string
  accepted_answers?: string[]
}

export type GameLetterState = {
  slotOrder: number
  letter: string
  status: 'pending' | 'correct' | 'wrong'
}

export type GamePlayerState = {
  seat: number
  rosco: string
  currentSlotOrder: number | null
  hits: number
  errors: number
  unanswered: number
  timeRemainingMs: number
  letters: GameLetterState[]
}

export type GameState = {
  phase: string
  topic: string
  level: string
  turnPlayerSeat: number | null
  turnPlayerId: string | null
  turnStartedAt: string | null
  startedAt: string | null
  finishedAt: string | null
  winnerSeat: number | null
  reason: string | null
  player1: GamePlayerState
  player2: GamePlayerState
}

type SupabaseAdminClient = any

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

export function normalizatuErantzuna(testua: string) {
  return testua
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function normalizatuAcceptedAnswers(rawValue: unknown): string[] {
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

export function erantzunaBaliozkoaDa(answer: string, galdera: QuestionRow) {
  const erantzunArrunta = normalizatuErantzuna(answer)
  const baliozkoak = [
    `${galdera.answer ?? ''}`.trim(),
    ...normalizatuAcceptedAnswers(galdera.accepted_answers ?? []),
  ].filter(Boolean)

  return baliozkoak.some(
    (baliozkoa) => normalizatuErantzuna(baliozkoa) === erantzunArrunta
  )
}

export async function lortuPartida(
  supabase: SupabaseAdminClient,
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

export async function lortuPartidakoJokalariak(
  supabase: SupabaseAdminClient,
  matchId: string
): Promise<MatchPlayerRow[]> {
  const { data, error } = await supabase
    .from('match_players')
    .select(
      'match_id, player_id, seat, is_ready, is_connected, rosco, time_remaining_ms, hits, errors, unanswered, letters_state'
    )
    .eq('match_id', matchId)
    .order('seat', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data as MatchPlayerRow[] | null) ?? []
}

export function lortuGameState(partida: MatchRow): GameState {
  const gameState = partida.game_state

  if (!gameState || typeof gameState !== 'object') {
    throw new Error('Partidaren egoera ez dago prest')
  }

  const maybeState = gameState as Partial<GameState>
  if (!maybeState.player1 || !maybeState.player2) {
    throw new Error('Partidaren egoera ez dago prest')
  }

  return {
    phase: `${maybeState.phase ?? 'playing'}`.trim() || 'playing',
    topic: `${maybeState.topic ?? partida.topic}`.trim(),
    level: `${maybeState.level ?? partida.level}`.trim(),
    turnPlayerSeat: Number(maybeState.turnPlayerSeat ?? 0) || null,
    turnPlayerId: `${maybeState.turnPlayerId ?? ''}`.trim() || null,
    turnStartedAt: `${maybeState.turnStartedAt ?? ''}`.trim() || null,
    startedAt: `${maybeState.startedAt ?? ''}`.trim() || null,
    finishedAt: `${maybeState.finishedAt ?? ''}`.trim() || null,
    winnerSeat: Number(maybeState.winnerSeat ?? 0) || null,
    reason: `${maybeState.reason ?? ''}`.trim() || null,
    player1: normalizatuGameStateJokalaria(maybeState.player1, 1),
    player2: normalizatuGameStateJokalaria(maybeState.player2, 2),
  }
}

function normalizatuGameStateJokalaria(
  jokalaria: Partial<GamePlayerState>,
  seat: number
): GamePlayerState {
  const letters = Array.isArray(jokalaria.letters)
    ? jokalaria.letters.map((letter, index) => ({
        slotOrder: Number(letter.slotOrder ?? index + 1),
        letter: `${letter.letter ?? ''}`.trim().toUpperCase(),
        status:
          letter.status === 'correct' || letter.status === 'wrong'
            ? letter.status
            : 'pending',
      }))
    : []

  const stats = kalkulatuJokalariEstatistikak(letters)
  const currentSlotOrder =
    Number(jokalaria.currentSlotOrder ?? bilatuHurrengoPendingSlot(letters, null, true) ?? 0) ||
    null

  return {
    seat,
    rosco: `${jokalaria.rosco ?? ''}`.trim(),
    currentSlotOrder,
    hits: Number(jokalaria.hits ?? stats.hits),
    errors: Number(jokalaria.errors ?? stats.errors),
    unanswered: Number(jokalaria.unanswered ?? stats.unanswered),
    timeRemainingMs: Number(jokalaria.timeRemainingMs ?? HASIERAKO_DENBORA_MS),
    letters,
  }
}

export function lortuGameStateJokalaria(gameState: GameState, seat: number) {
  if (seat === 1) {
    return kopiatuGameStateJokalaria(gameState.player1)
  }

  return kopiatuGameStateJokalaria(gameState.player2)
}

export function kopiatuGameStateJokalaria(jokalaria: GamePlayerState): GamePlayerState {
  return {
    ...jokalaria,
    letters: jokalaria.letters.map((letter) => ({ ...letter })),
  }
}

export function gordeGameStateJokalaria(
  gameState: GameState,
  seat: number,
  jokalaria: GamePlayerState
) {
  if (seat === 1) {
    gameState.player1 = jokalaria
    return
  }

  gameState.player2 = jokalaria
}

export function lortuBesteSeat(seat: number) {
  return seat === 1 ? 2 : 1
}

export function bilatuHurrengoPendingSlot(
  letters: GameLetterState[],
  currentSlotOrder: number | null,
  unekoaBarne = false
) {
  if (!Array.isArray(letters) || letters.length === 0) {
    return null
  }

  const ordenatuta = [...letters].sort((a, b) => a.slotOrder - b.slotOrder)
  const hasierakoIndizea =
    currentSlotOrder === null
      ? -1
      : ordenatuta.findIndex((letter) => letter.slotOrder === currentSlotOrder)

  const lehenPausoa = unekoaBarne ? 0 : 1
  const gehienez = ordenatuta.length

  for (let pausoa = lehenPausoa; pausoa <= gehienez; pausoa += 1) {
    const indizea =
      hasierakoIndizea === -1
        ? pausoa - lehenPausoa
        : (hasierakoIndizea + pausoa + ordenatuta.length) % ordenatuta.length
    const letter = ordenatuta[indizea]

    if (letter?.status === 'pending') {
      return letter.slotOrder
    }
  }

  return null
}

export function kalkulatuJokalariEstatistikak(letters: GameLetterState[]) {
  const hits = letters.filter((letter) => letter.status === 'correct').length
  const errors = letters.filter((letter) => letter.status === 'wrong').length
  const unanswered = letters.filter((letter) => letter.status === 'pending').length

  return { hits, errors, unanswered }
}

export function eguneratuJokalariaErantzunarekin(
  jokalaria: GamePlayerState,
  zuzena: boolean
) {
  if (!jokalaria.currentSlotOrder) {
    throw new Error('Ez dago letra pendienterik')
  }

  const letters = jokalaria.letters.map((letter) => {
    if (letter.slotOrder !== jokalaria.currentSlotOrder) {
      return { ...letter }
    }

    return {
      ...letter,
      status: zuzena ? 'correct' : 'wrong',
    }
  })

  const stats = kalkulatuJokalariEstatistikak(letters)

  return {
    ...jokalaria,
    hits: stats.hits,
    errors: stats.errors,
    unanswered: stats.unanswered,
    currentSlotOrder: bilatuHurrengoPendingSlot(letters, jokalaria.currentSlotOrder, false),
    letters,
  }
}

export function eguneratuJokalariaPasapalabrarekin(jokalaria: GamePlayerState) {
  if (!jokalaria.currentSlotOrder) {
    throw new Error('Ez dago letra pendienterik')
  }

  return {
    ...jokalaria,
    letters: jokalaria.letters.map((letter) => ({ ...letter })),
    currentSlotOrder: bilatuHurrengoPendingSlot(jokalaria.letters, jokalaria.currentSlotOrder, false),
  }
}

export function jokalariaJolastekoPrestDago(jokalaria: GamePlayerState) {
  return (
    jokalaria.timeRemainingMs > 0 &&
    jokalaria.unanswered > 0 &&
    jokalaria.currentSlotOrder !== null
  )
}

export function jokalariaRoskoaOsatutaDago(jokalaria: GamePlayerState) {
  return (
    jokalaria.unanswered <= 0 ||
    bilatuHurrengoPendingSlot(jokalaria.letters, jokalaria.currentSlotOrder, true) === null
  )
}

export function kalkulatuIragandakoDenboraMs(
  gameState: GameState,
  now = new Date()
) {
  if (!gameState.turnStartedAt) {
    return 0
  }

  const hasiera = Date.parse(gameState.turnStartedAt)
  if (!Number.isFinite(hasiera)) {
    return 0
  }

  return Math.max(0, now.getTime() - hasiera)
}

export function aplikatuTxandarenDenbora(
  jokalaria: GamePlayerState,
  elapsedMs: number
) {
  const kontsumoa = Math.max(0, Math.floor(elapsedMs))
  const hasierakoa = Math.max(0, Number(jokalaria.timeRemainingMs ?? HASIERAKO_DENBORA_MS))
  const amaierakoa = Math.max(0, hasierakoa - kontsumoa)

  return {
    jokalaria: {
      ...jokalaria,
      timeRemainingMs: amaierakoa,
    },
    consumedMs: Math.min(kontsumoa, hasierakoa),
    timedOut: amaierakoa === 0,
  }
}

export function erabakiHurrengoTxanda(
  emaitza: 'correct' | 'wrong' | 'passed' | 'timeout',
  aktoreSeat: number,
  aktorea: GamePlayerState,
  bestea: GamePlayerState
) {
  const aktoreakJolastuDezake = jokalariaJolastekoPrestDago(aktorea)
  const besteakJolastuDezake = jokalariaJolastekoPrestDago(bestea)

  if (emaitza === 'correct') {
    if (aktoreakJolastuDezake) {
      return aktoreSeat
    }

    if (besteakJolastuDezake) {
      return lortuBesteSeat(aktoreSeat)
    }

    return null
  }

  if (besteakJolastuDezake) {
    return lortuBesteSeat(aktoreSeat)
  }

  if (aktoreakJolastuDezake) {
    return aktoreSeat
  }

  return null
}

export function eguneratuGameStateTxanda(
  gameState: GameState,
  nextSeat: number | null,
  players: MatchPlayerRow[],
  nowIso = new Date().toISOString()
) {
  const turnPlayer = nextSeat
    ? players.find((player) => player.seat === nextSeat) ?? null
    : null

  return {
    ...gameState,
    phase: 'playing',
    turnPlayerSeat: nextSeat,
    turnPlayerId: turnPlayer?.player_id ?? null,
    turnStartedAt: nextSeat ? nowIso : null,
  }
}

export function kalkulatuIrabazlea(gameState: GameState) {
  const jokalari1 = gameState.player1
  const jokalari2 = gameState.player2

  if (jokalari1.hits > jokalari2.hits) {
    return 1
  }

  if (jokalari2.hits > jokalari1.hits) {
    return 2
  }

  if (jokalari1.errors < jokalari2.errors) {
    return 1
  }

  if (jokalari2.errors < jokalari1.errors) {
    return 2
  }

  return null
}

export function ebatziPartidarenAmaiera(
  gameState: GameState,
  nowIso = new Date().toISOString()
) {
  const roskoaOsatuta =
    jokalariaRoskoaOsatutaDago(gameState.player1) ||
    jokalariaRoskoaOsatutaDago(gameState.player2)
  const denboraAgortuta =
    gameState.player1.timeRemainingMs <= 0 && gameState.player2.timeRemainingMs <= 0

  if (!roskoaOsatuta && !denboraAgortuta) {
    return {
      finished: false,
      gameState,
      status: 'playing' as const,
    }
  }

  const winnerSeat = kalkulatuIrabazlea(gameState)
  const reason = winnerSeat === null ? 'draw' : roskoaOsatuta ? 'completed_rosco' : 'time_expired'

  return {
    finished: true,
    status: 'finished' as const,
    gameState: {
      ...gameState,
      phase: 'finished',
      turnPlayerSeat: null,
      turnPlayerId: null,
      turnStartedAt: null,
      finishedAt: nowIso,
      winnerSeat,
      reason,
    },
  }
}

export async function lortuUnekoGaldera(
  supabase: SupabaseAdminClient,
  partida: MatchRow,
  jokalaria: GamePlayerState
): Promise<QuestionRow> {
  if (!jokalaria.currentSlotOrder || !jokalaria.rosco) {
    throw new Error('Ez dago letra pendienterik')
  }

  const { data, error } = await supabase
    .from('hitzapasa')
    .select('slot_order, letter, clue, answer, accepted_answers')
    .eq('topic', partida.topic)
    .eq('level', partida.level)
    .eq('rosco', jokalaria.rosco)
    .eq('active', true)
    .eq('slot_order', jokalaria.currentSlotOrder)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Ezin izan da uneko galdera aurkitu')
  }

  return {
    slot_order: Number(data.slot_order ?? 0),
    letter: `${data.letter ?? ''}`.trim().toUpperCase(),
    clue: `${data.clue ?? ''}`.trim(),
    answer: `${data.answer ?? ''}`.trim(),
    accepted_answers: normalizatuAcceptedAnswers(data.accepted_answers),
  }
}

async function eguneratuPartidaLerroNagusia(
  supabase: SupabaseAdminClient,
  partida: MatchRow,
  gameState: GameState,
  status: 'playing' | 'finished'
) {
  const payloadOsoa = {
    status,
    game_state: gameState,
    current_turn_seat: gameState.turnPlayerSeat,
    current_turn_player_id: gameState.turnPlayerId,
    turn_started_at: gameState.turnStartedAt,
    started_at: gameState.startedAt,
    finished_at: gameState.finishedAt,
    winner_seat: gameState.winnerSeat,
    finish_reason: gameState.reason,
  }

  const { error } = await supabase
    .from('matches')
    .update(payloadOsoa)
    .eq('id', partida.id)

  if (!error) {
    return
  }

  const { error: fallbackError } = await supabase
    .from('matches')
    .update({
      status,
      game_state: gameState,
    })
    .eq('id', partida.id)

  if (fallbackError) {
    throw new Error(fallbackError.message)
  }
}

export async function gordePartidarenEgoera(
  supabase: SupabaseAdminClient,
  partida: MatchRow,
  players: MatchPlayerRow[],
  gameState: GameState
) {
  const status = gameState.phase === 'finished' ? 'finished' : 'playing'

  await eguneratuPartidaLerroNagusia(supabase, partida, gameState, status)

  for (const player of players) {
    const gamePlayer = lortuGameStateJokalaria(gameState, player.seat)
    const { error: jokalariErrorea } = await supabase
      .from('match_players')
      .update({
        rosco: gamePlayer.rosco,
        time_remaining_ms: gamePlayer.timeRemainingMs,
        hits: gamePlayer.hits,
        errors: gamePlayer.errors,
        unanswered: gamePlayer.unanswered,
        letters_state: gamePlayer.letters,
      })
      .eq('match_id', partida.id)
      .eq('seat', player.seat)

    if (jokalariErrorea) {
      throw new Error(jokalariErrorea.message)
    }
  }
}

export async function erregistratuMatchEvent(
  supabase: SupabaseAdminClient,
  payload: {
    matchId: string
    playerId: string
    seat: number
    eventType: string
    eventPayload: Record<string, unknown>
  }
) {
  await supabase.from('match_events').insert({
    match_id: payload.matchId,
    player_id: payload.playerId,
    seat: payload.seat,
    event_type: payload.eventType,
    payload: payload.eventPayload,
  })
}

export function clienterakoPartida(partida: MatchRow, gameState: GameState) {
  return {
    id: partida.id,
    room_code: partida.room_code,
    status: gameState.phase === 'finished' ? 'finished' : 'playing',
    topic: partida.topic,
    level: partida.level,
    created_at: partida.created_at ?? null,
    game_state: gameState,
  }
}

export function clienterakoJokalariak(players: MatchPlayerRow[], gameState: GameState) {
  return players.map((player) => {
    const gamePlayer = lortuGameStateJokalaria(gameState, player.seat)
    return {
      seat: player.seat,
      player_id: player.player_id,
      is_ready: player.is_ready,
      is_connected: Boolean(player.is_connected),
      rosco: gamePlayer.rosco,
      time_remaining_ms: gamePlayer.timeRemainingMs,
      hits: gamePlayer.hits,
      errors: gamePlayer.errors,
      unanswered: gamePlayer.unanswered,
      letters_state: gamePlayer.letters,
    }
  })
}

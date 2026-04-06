import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors'
import {
  aplikatuTxandarenDenbora,
  clienterakoJokalariak,
  clienterakoPartida,
  ebatziPartidarenAmaiera,
  eguneratuGameStateTxanda,
  eguneratuJokalariaErantzunarekin,
  erabakiHurrengoTxanda,
  erregistratuMatchEvent,
  gordeGameStateJokalaria,
  gordePartidarenEgoera,
  jsonResponse,
  kalkulatuIragandakoDenboraMs,
  lortuBesteSeat,
  lortuGameState,
  lortuGameStateJokalaria,
  lortuPartida,
  lortuPartidakoJokalariak,
  lortuUnekoGaldera,
  erantzunaBaliozkoaDa,
} from '../_shared/online-game.ts'

type SubmitAnswerBody = {
  matchId?: string
  roomCode?: string
  answer?: string
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

    const body = (await req.json()) as SubmitAnswerBody
    const matchId = `${body.matchId ?? ''}`.trim()
    const roomCode = `${body.roomCode ?? ''}`.trim().toUpperCase()
    const answer = `${body.answer ?? ''}`.trim()

    if (!matchId || !roomCode) {
      return jsonResponse({ error: 'Partida identifikatzailea falta da' }, 400)
    }

    if (!answer) {
      return jsonResponse({ error: 'Erantzuna behar da' }, 400)
    }

    const partida = await lortuPartida(admin, matchId, roomCode)
    if (!partida) {
      return jsonResponse({ error: 'Partida ez dago erabilgarri' }, 404)
    }

    if (partida.status !== 'playing') {
      return jsonResponse({ error: 'Partida ez dago martxan' }, 400)
    }

    const players = await lortuPartidakoJokalariak(admin, partida.id)
    const requester = players.find((player) => player.player_id === user.id)

    if (!requester) {
      return jsonResponse({ error: 'Ez zaude partida honetan' }, 403)
    }

    const now = new Date()
    const nowIso = now.toISOString()
    const gameState = lortuGameState(partida)
    if (Number(gameState.turnPlayerSeat ?? 0) !== requester.seat) {
      return jsonResponse({ error: 'Ez da zure txanda' }, 403)
    }

    const aktoreaHasieran = lortuGameStateJokalaria(gameState, requester.seat)
    const bestea = lortuGameStateJokalaria(gameState, lortuBesteSeat(requester.seat))
    const elapsedMs = kalkulatuIragandakoDenboraMs(gameState, now)
    const denboraEbazpena = aplikatuTxandarenDenbora(aktoreaHasieran, elapsedMs)
    const aktoreaDenborarekin = denboraEbazpena.jokalaria

    gordeGameStateJokalaria(gameState, requester.seat, aktoreaDenborarekin)

    if (denboraEbazpena.timedOut) {
      const hurrengoSeat = erabakiHurrengoTxanda(
        'timeout',
        requester.seat,
        aktoreaDenborarekin,
        bestea
      )
      const txandaEgoera = eguneratuGameStateTxanda(gameState, hurrengoSeat, players, nowIso)
      const amaiera = ebatziPartidarenAmaiera(txandaEgoera, nowIso)

      await gordePartidarenEgoera(admin, partida, players, amaiera.gameState)
      await erregistratuMatchEvent(admin, {
        matchId: partida.id,
        playerId: requester.player_id,
        seat: requester.seat,
        eventType: 'time_expired',
        eventPayload: {
          elapsedMs: denboraEbazpena.consumedMs,
          turnPlayerSeat: requester.seat,
        },
      })

      return jsonResponse({
        success: true,
        result: 'timeout',
        matchStatus: amaiera.status,
        turnPlayerSeat: amaiera.gameState.turnPlayerSeat,
        gameState: amaiera.gameState,
        match: clienterakoPartida(partida, amaiera.gameState),
        players: clienterakoJokalariak(players, amaiera.gameState),
      })
    }

    if (!aktoreaDenborarekin.currentSlotOrder) {
      return jsonResponse({ error: 'Ez dago letra pendienterik' }, 400)
    }

    const galdera = await lortuUnekoGaldera(admin, partida, aktoreaDenborarekin)
    const zuzena = erantzunaBaliozkoaDa(answer, galdera)
    const emaitza = zuzena ? 'correct' : 'wrong'
    const aktoreEguneratua = eguneratuJokalariaErantzunarekin(
      aktoreaDenborarekin,
      zuzena
    )
    const hurrengoSeat = erabakiHurrengoTxanda(
      emaitza,
      requester.seat,
      aktoreEguneratua,
      bestea
    )

    gordeGameStateJokalaria(gameState, requester.seat, aktoreEguneratua)
    const txandaEgoera = eguneratuGameStateTxanda(gameState, hurrengoSeat, players, nowIso)
    const amaiera = ebatziPartidarenAmaiera(txandaEgoera, nowIso)

    await gordePartidarenEgoera(admin, partida, players, amaiera.gameState)
    await erregistratuMatchEvent(admin, {
      matchId: partida.id,
      playerId: requester.player_id,
      seat: requester.seat,
      eventType: 'answer_submitted',
      eventPayload: {
        slotOrder: galdera.slot_order,
        letter: galdera.letter,
        result: emaitza,
        elapsedMs: denboraEbazpena.consumedMs,
      },
    })

    return jsonResponse({
      success: true,
      result: emaitza,
      correctAnswer: !zuzena ? galdera.answer : null,
      matchStatus: amaiera.status,
      turnPlayerSeat: amaiera.gameState.turnPlayerSeat,
      gameState: amaiera.gameState,
      match: clienterakoPartida(partida, amaiera.gameState),
      players: clienterakoJokalariak(players, amaiera.gameState),
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

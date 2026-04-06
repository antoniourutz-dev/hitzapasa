import {
  SUPABASE_URL,
  lortuSupabaseHeaders,
  supabase,
  supabaseKonfiguratutaDago,
} from "./supabaseClient.js";

const HASIERAKO_DENBORA = 300;
const FEEDBACK_IKUSGAI_DENBORA_MS = 5000;
const GORDE_GAKOA = "hitzapasa-egoera-v10";
const SUPABASE_HEADERS = lortuSupabaseHeaders();
const JOKO_MODUA_GABE = "";
const JOKO_MODUA_BAKARKA = "bakarka";
const JOKO_MODUA_BINAKA = "binaka";
const GAIA_NAHASKETA = "nahasketa";
const NAHASKETA_ROSKO_AURREZKIA = "nahasketa::";
const GAIEN_TXIP_ETIKETAK = {
  nahasketa: "Nahasketa",
  eskola_eta_kultura: "Eskola + kultura",
  gorputza_eta_osasuna: "Gorputza + osasuna",
  herria_gizartea_teknologia: "Herria + tekno",
};

const dom = {
  aplikazioa: document.querySelector(".aplikazioa"),
  hasieraPantaila: document.getElementById("hasieraPantaila"),
  jokoPantaila: document.getElementById("jokoPantaila"),
  egoeraSarea: document.querySelector("#jokoPantaila .egoera-sarea"),
  aldaketaPantaila: document.getElementById("aldaketaPantaila"),
  amaieraPantaila: document.getElementById("amaieraPantaila"),
  onlineLobbyPantaila: document.getElementById("onlineLobbyPantaila"),
  onlinePrestPantaila: document.getElementById("onlinePrestPantaila"),
  onlineJokoPantaila: document.getElementById("onlineJokoPantaila"),
  hasieraFormulario: document.getElementById("hasieraFormulario"),
  onlineJoinFormulario: document.getElementById("onlineJoinFormulario"),
  onlineTolesBotoia: document.getElementById("onlineTolesBotoia"),
  onlineJoinEdukia: document.getElementById("onlineJoinEdukia"),
  onlineTolesAzalpena: document.getElementById("onlineTolesAzalpena"),
  gaiaTxipak: document.getElementById("gaiaTxipak"),
  gaiaSelect: document.getElementById("gaiaSelect"),
  mailaEremua: document.getElementById("mailaEremua"),
  mailaSelect: document.getElementById("mailaSelect"),
  hasieraMezua: document.getElementById("hasieraMezua"),
  onlineJoinMezua: document.getElementById("onlineJoinMezua"),
  jokoLokalaAzalpena: document.getElementById("jokoLokalaAzalpena"),
  jokoModuaBakarka: document.getElementById("jokoModuaBakarka"),
  jokoModuaBinaka: document.getElementById("jokoModuaBinaka"),
  jokalari1Eremua: document.getElementById("jokalari1Eremua"),
  jokalari1Label: document.getElementById("jokalari1Label"),
  jokalari2Eremua: document.getElementById("jokalari2Eremua"),
  jokalari1Izena: document.getElementById("jokalari1Izena"),
  jokalari2Izena: document.getElementById("jokalari2Izena"),
  jokalariTxartela0: document.getElementById("jokalariTxartela0"),
  jokalariTxartela1: document.getElementById("jokalariTxartela1"),
  txandaAdierazlea: document.getElementById("txandaAdierazlea"),
  denboraErakusgailua: document.getElementById("denboraErakusgailua"),
  denboraErakusgailuaGoiburua: document.getElementById("denboraErakusgailuaGoiburua"),
  uneanJokalaria: document.getElementById("uneanJokalaria"),
  roskoa: document.getElementById("roskoa"),
  galderaLetra: document.getElementById("galderaLetra"),
  galderaPista: document.getElementById("galderaPista"),
  erantzunFormulario: document.getElementById("erantzunFormulario"),
  erantzunaInput: document.getElementById("erantzunaInput"),
  pasapalabraBotoia: document.getElementById("pasapalabraBotoia"),
  feedbackMezua: document.getElementById("feedbackMezua"),
  berrabiaraziBotoia: document.getElementById("berrabiaraziBotoia"),
  aldaketaIzenburua: document.getElementById("aldaketaIzenburua"),
  aldaketaAzalpena: document.getElementById("aldaketaAzalpena"),
  aldaketaLaburpena: document.getElementById("aldaketaLaburpena"),
  hurrengoTxandaBotoia: document.getElementById("hurrengoTxandaBotoia"),
  aldaketaBerrabiaraziBotoia: document.getElementById("aldaketaBerrabiaraziBotoia"),
  irabazleaIzenburua: document.getElementById("irabazleaIzenburua"),
  azkenEmaitzak: document.getElementById("azkenEmaitzak"),
  amaieraBerrabiaraziBotoia: document.getElementById("amaieraBerrabiaraziBotoia"),
  hasiJokoaBotoia: document.getElementById("hasiJokoaBotoia"),
  onlineSortuBotoia: document.getElementById("onlineSortuBotoia"),
  onlineSaioEgoera: document.getElementById("onlineSaioEgoera"),
  onlineSaioBotoia: document.getElementById("onlineSaioBotoia"),
  onlineSaioaItxiBotoia: document.getElementById("onlineSaioaItxiBotoia"),
  onlineRoomCodeInput: document.getElementById("onlineRoomCodeInput"),
  onlineSartuBotoia: document.getElementById("onlineSartuBotoia"),
  onlineLobbyIzenburua: document.getElementById("onlineLobbyIzenburua"),
  onlineLobbyAzalpena: document.getElementById("onlineLobbyAzalpena"),
  onlineRoomCode: document.getElementById("onlineRoomCode"),
  onlineTopic: document.getElementById("onlineTopic"),
  onlineLevel: document.getElementById("onlineLevel"),
  onlineStatus: document.getElementById("onlineStatus"),
  onlineSeat: document.getElementById("onlineSeat"),
  onlineLobbyMessage: document.getElementById("onlineLobbyMessage"),
  onlineJokalariTxartela1: document.getElementById("onlineJokalariTxartela1"),
  onlineJokalariTxartela2: document.getElementById("onlineJokalariTxartela2"),
  onlineJokalariEgoera1: document.getElementById("onlineJokalariEgoera1"),
  onlineJokalariEgoera2: document.getElementById("onlineJokalariEgoera2"),
  onlineLobbyFeedback: document.getElementById("onlineLobbyFeedback"),
  onlinePrestBotoia: document.getElementById("onlinePrestBotoia"),
  onlineEguneratuBotoia: document.getElementById("onlineEguneratuBotoia"),
  onlineLobbyBerrabiaraziBotoia: document.getElementById("onlineLobbyBerrabiaraziBotoia"),
  onlinePrestIzenburua: document.getElementById("onlinePrestIzenburua"),
  onlinePrestAzalpena: document.getElementById("onlinePrestAzalpena"),
  onlinePrestRoomCode: document.getElementById("onlinePrestRoomCode"),
  onlinePrestTopic: document.getElementById("onlinePrestTopic"),
  onlinePrestLevel: document.getElementById("onlinePrestLevel"),
  onlinePrestStatus: document.getElementById("onlinePrestStatus"),
  onlinePrestTxartela1: document.getElementById("onlinePrestTxartela1"),
  onlinePrestTxartela2: document.getElementById("onlinePrestTxartela2"),
  onlinePrestJokalari1: document.getElementById("onlinePrestJokalari1"),
  onlinePrestJokalari2: document.getElementById("onlinePrestJokalari2"),
  onlinePrestFeedback: document.getElementById("onlinePrestFeedback"),
  onlinePrestHasieraraBotoia: document.getElementById("onlinePrestHasieraraBotoia"),
  onlineJokoRoomCode: document.getElementById("onlineJokoRoomCode"),
  onlineJokoSeat: document.getElementById("onlineJokoSeat"),
  onlineJokoRosco: document.getElementById("onlineJokoRosco"),
  onlineJokoTxanda: document.getElementById("onlineJokoTxanda"),
  onlineJokoDenbora: document.getElementById("onlineJokoDenbora"),
  onlineJokoNireLaburpena: document.getElementById("onlineJokoNireLaburpena"),
  onlineJokoAurkariLaburpena: document.getElementById("onlineJokoAurkariLaburpena"),
  onlineJokoPista: document.getElementById("onlineJokoPista"),
  onlineJokoMezua: document.getElementById("onlineJokoMezua"),
  onlineJokoRoskoa: document.getElementById("onlineJokoRoskoa"),
  onlineJokoGalderaLetra: document.getElementById("onlineJokoGalderaLetra"),
  onlineJokoFormulario: document.getElementById("onlineJokoFormulario"),
  onlineJokoErantzunaInput: document.getElementById("onlineJokoErantzunaInput"),
  onlineJokoPasapalabraBotoia: document.getElementById("onlineJokoPasapalabraBotoia"),
  onlineJokoBerrabiaraziBotoia: document.getElementById("onlineJokoBerrabiaraziBotoia"),
  onlineAmaieraPantaila: document.getElementById("onlineAmaieraPantaila"),
  onlineAmaieraIzenburua: document.getElementById("onlineAmaieraIzenburua"),
  onlineAmaieraAzalpena: document.getElementById("onlineAmaieraAzalpena"),
  onlineAmaieraRoomCode: document.getElementById("onlineAmaieraRoomCode"),
  onlineAmaieraTopic: document.getElementById("onlineAmaieraTopic"),
  onlineAmaieraLevel: document.getElementById("onlineAmaieraLevel"),
  onlineAmaieraIrabazlea: document.getElementById("onlineAmaieraIrabazlea"),
  onlineAmaieraArrazoia: document.getElementById("onlineAmaieraArrazoia"),
  onlineAmaieraEmaitzak: document.getElementById("onlineAmaieraEmaitzak"),
  onlineAmaieraFeedback: document.getElementById("onlineAmaieraFeedback"),
  onlineAmaieraBerrabiaraziBotoia: document.getElementById("onlineAmaieraBerrabiaraziBotoia"),
};

function sortuLobbyJokalariak(lerroak = []) {
  const mapak = new Map(
    lerroak
      .filter((lerroa) => Number(lerroa?.seat))
      .map((lerroa) => [
        Number(lerroa.seat),
        {
          seat: Number(lerroa.seat),
          player_id: lerroa.player_id ?? null,
          is_ready: Boolean(lerroa.is_ready),
          is_connected: Boolean(lerroa.is_connected),
          rosco: lerroa.rosco ?? null,
          topic: lerroa.topic ?? null,
          level: lerroa.level ?? null,
          time_remaining_ms: Number(lerroa.time_remaining_ms ?? HASIERAKO_DENBORA * 1000),
          hits: Number(lerroa.hits ?? 0),
          errors: Number(lerroa.errors ?? 0),
          unanswered: Number(lerroa.unanswered ?? 25),
          letters_state: Array.isArray(lerroa.letters_state) ? lerroa.letters_state : [],
          present: true,
        },
      ]),
  );

  return [1, 2].map((seat) => {
    const jokalaria = mapak.get(seat);
    return (
      jokalaria ?? {
        seat,
        player_id: null,
        is_ready: false,
        is_connected: false,
        rosco: null,
        topic: null,
        level: null,
        time_remaining_ms: HASIERAKO_DENBORA * 1000,
        hits: 0,
        errors: 0,
        unanswered: 25,
        letters_state: [],
        present: false,
      }
    );
  });
}

function sortuOnlineEgoera() {
  return {
    flow: "",
    loadingCreate: false,
    loadingJoin: false,
    loadingAuth: false,
    loadingSetReady: false,
    loadingStartMatch: false,
    loadingLobby: false,
    loadingGameData: false,
    loadingSubmitAnswer: false,
    loadingPassTurn: false,
    loadingTimeout: false,
    errorCreate: "",
    errorJoin: "",
    errorAuth: "",
    errorSetReady: "",
    errorStartMatch: "",
    errorLobby: "",
    errorGameData: "",
    errorOnlineMove: "",
    errorOnlineFinish: "",
    enteredRoomCode: "",
    authReady: false,
    authUserId: "",
    onlineAnswer: "",
    onlineMatch: null,
    onlinePlayer: null,
    onlinePlayersState: sortuLobbyJokalariak(),
    lobbyMessage: "",
    onlineMoveMessage: "",
    onlineReadyToStart: false,
    onlineRealtimeConnected: false,
    onlinePanelExpanded: false,
    onlinePanelTouched: false,
    onlineLatestEvent: null,
    onlineGameState: null,
    onlineGameQuestions: [],
    onlineGameRosco: "",
    onlineTimerDisplay: `${HASIERAKO_DENBORA}s`,
    onlineFinishedResult: null,
  };
}

const egoera = {
  pantaila: "hasiera",
  jokoModua: JOKO_MODUA_GABE,
  konfigurazioa: {
    topic: "",
    level: "",
  },
  aukerak: {
    topics: [],
    levels: [],
    roscos: [],
  },
  kargatzen: {
    topics: false,
    levels: false,
    roscos: false,
    questions: false,
  },
  hasieraMezua: "",
  hasieraMezuMota: "oharra",
  online: sortuOnlineEgoera(),
  jokalariak: [],
  unekoJokalaria: 0,
  hurrengoJokalaria: null,
  aurrekoJokalaria: null,
  feedback: "",
  feedbackMota: "oharra",
  aldaketaArrazoia: "",
  amaieraArrazoia: "",
  denboraMuga: null,
  erlojuaId: null,
};

let onlineRealtimeKanala = null;
let onlineRealtimeMatchId = "";
let onlineEguneratzeTimeoutId = null;
let onlineHasieraTimeoutId = null;
let onlinePrestEguneratzeTimeoutId = null;
let onlineJokoEguneratzeTimeoutId = null;
let onlineStartEskatutakoMatchId = "";
let onlineRealtimeKanalZenbakia = 0;
let onlineGameKargatutakoMatchId = "";
let onlineKontagailuaId = null;
let onlineTimeoutEskatutakoGakoa = "";
let onlineAuthHarpidetza = null;
let feedbackGarbitzeTimeoutId = null;
let onlineMugimenduMezuGarbitzeTimeoutId = null;

function lortuEgoerarenBiltegia() {
  try {
    return window.sessionStorage;
  } catch (_errorea) {
    return window.localStorage;
  }
}

function bakarkakoJokoaDa(jokoModua = egoera.jokoModua) {
  return jokoModua === JOKO_MODUA_BAKARKA;
}

function binakakoJokoaDa(jokoModua = egoera.jokoModua) {
  return jokoModua === JOKO_MODUA_BINAKA;
}

function jokoModuaAukeratutaDago(jokoModua = egoera.jokoModua) {
  return bakarkakoJokoaDa(jokoModua) || binakakoJokoaDa(jokoModua);
}

function beharrezkoRoskoKopurua(jokoModua = egoera.jokoModua) {
  return bakarkakoJokoaDa(jokoModua) ? 1 : 2;
}

function itzuliRoskoEskakizunMezua(jokoModua = egoera.jokoModua) {
  if (!jokoModuaAukeratutaDago(jokoModua)) {
    return "Ez dago erroska erabilgarririk";
  }

  return bakarkakoJokoaDa(jokoModua)
    ? "Ez dago erroska erabilgarririk"
    : "Ez dago nahikoa erroskarik";
}

function jokoModuaJokalariKopurutik(jokalariKopurua) {
  if (jokalariKopurua === 1) {
    return JOKO_MODUA_BAKARKA;
  }

  if (jokalariKopurua === 2) {
    return JOKO_MODUA_BINAKA;
  }

  return JOKO_MODUA_GABE;
}

function eguneratuRoskoEskuragarritasunMezua() {
  const mezuAldagarriak = new Set([
    "",
    "Ez dago erroska erabilgarririk",
    "Ez dago nahikoa erroskarik",
  ]);

  if (
    !mezuAldagarriak.has(egoera.hasieraMezua) ||
    hautapenakKargatzenDira() ||
    !egoera.konfigurazioa.topic ||
    !egoera.konfigurazioa.level
  ) {
    return;
  }

  if (!jokoModuaAukeratutaDago()) {
    if (egoera.aukerak.roscos.length === 0) {
      ezarriHasieraMezua("Ez dago erroska erabilgarririk", "okerra");
    } else {
      ezarriHasieraMezua("", "oharra");
    }
    return;
  }

  if (egoera.aukerak.roscos.length < beharrezkoRoskoKopurua()) {
    ezarriHasieraMezua(itzuliRoskoEskakizunMezua(), "okerra");
    return;
  }

  ezarriHasieraMezua("", "oharra");
}

function ezarriJokoModua(jokoModua) {
  egoera.jokoModua =
    jokoModua === JOKO_MODUA_BAKARKA
      ? JOKO_MODUA_BAKARKA
      : jokoModua === JOKO_MODUA_BINAKA
        ? JOKO_MODUA_BINAKA
        : JOKO_MODUA_GABE;
  eguneratuRoskoEskuragarritasunMezua();
}

function gordeBiltegian(gakoa, balioa) {
  lortuEgoerarenBiltegia().setItem(gakoa, balioa);
}

function irakurriBiltegitik(gakoa) {
  return lortuEgoerarenBiltegia().getItem(gakoa);
}

function ezabatuBiltegitik(gakoa) {
  lortuEgoerarenBiltegia().removeItem(gakoa);
}

function garbituFeedbackProgramazioa() {
  if (feedbackGarbitzeTimeoutId) {
    window.clearTimeout(feedbackGarbitzeTimeoutId);
    feedbackGarbitzeTimeoutId = null;
  }
}

function programatuFeedbackGarbitzea() {
  garbituFeedbackProgramazioa();
  feedbackGarbitzeTimeoutId = window.setTimeout(() => {
    feedbackGarbitzeTimeoutId = null;
    egoera.feedback = "";
    egoera.feedbackMota = "oharra";
    egoera.aldaketaArrazoia = "";

    if (egoera.pantaila === "jokoa") {
      renderGameScreen();
    }

    gordeEgoera();
  }, FEEDBACK_IKUSGAI_DENBORA_MS);
}

function garbituOnlineMugimenduMezuProgramazioa() {
  if (onlineMugimenduMezuGarbitzeTimeoutId) {
    window.clearTimeout(onlineMugimenduMezuGarbitzeTimeoutId);
    onlineMugimenduMezuGarbitzeTimeoutId = null;
  }
}

function programatuOnlineMugimenduMezuaGarbitzea() {
  garbituOnlineMugimenduMezuProgramazioa();
  onlineMugimenduMezuGarbitzeTimeoutId = window.setTimeout(() => {
    onlineMugimenduMezuGarbitzeTimeoutId = null;
    egoera.online.onlineMoveMessage = "";

    if (egoera.pantaila === "online-jokoa") {
      renderOnlineGameScreen();
    }

    gordeEgoera();
  }, FEEDBACK_IKUSGAI_DENBORA_MS);
}

function onlineSaioaEtaEserlekuaBatDatoz() {
  const authUserId = `${egoera.online.authUserId ?? ""}`.trim();
  const playerId = `${egoera.online.onlinePlayer?.player_id ?? ""}`.trim();

  if (!authUserId || !playerId) {
    return true;
  }

  return authUserId === playerId;
}

function balioaGalderaLerrorako(lerroa, gakoak) {
  for (const gakoa of gakoak) {
    if (lerroa[gakoa] !== undefined && lerroa[gakoa] !== null && `${lerroa[gakoa]}`.trim()) {
      return `${lerroa[gakoa]}`.trim();
    }
  }

  return "";
}

function normalizatuAcceptedAnswers(rawValue) {
  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item) => `${item ?? ""}`.trim())
      .filter(Boolean);
  }

  if (typeof rawValue === "string") {
    const testua = rawValue.trim();

    if (!testua) {
      return [];
    }

    if (testua.startsWith("[")) {
      try {
        const parsed = JSON.parse(testua);
        return normalizatuAcceptedAnswers(parsed);
      } catch (_errorea) {
        // Jarraitu beheko banaketan.
      }
    }

    return testua
      .split(/[|;\n]+/u)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function lortuGalderaErantzunBaliozkoak(galdera) {
  return [
    `${galdera?.answer ?? ""}`.trim(),
    ...normalizatuAcceptedAnswers(galdera?.acceptedAnswers ?? galdera?.accepted_answers),
  ].filter(Boolean);
}

function galderarenErantzunaZuzenaDa(erantzuna, galdera) {
  const erantzunArrunta = normalizatuErantzuna(`${erantzuna ?? ""}`);

  return lortuGalderaErantzunBaliozkoak(galdera).some(
    (baliozkoa) => normalizatuErantzuna(baliozkoa) === erantzunArrunta,
  );
}

function normalizatuGalderaLerroa(lerroa) {
  const letter = balioaGalderaLerrorako(lerroa, ["letter"]).toUpperCase();
  const clue = balioaGalderaLerrorako(lerroa, ["clue"]);
  const answer = balioaGalderaLerrorako(lerroa, ["answer"]);
  const acceptedAnswers = normalizatuAcceptedAnswers(
    lerroa.accepted_answers ?? lerroa.acceptedAnswers,
  );
  const modeBalioa = balioaGalderaLerrorako(lerroa, ["mode", "rule"]);
  const letraArrunta = letter.toLowerCase();
  const erantzunArrunta = answer.toLowerCase();
  const mode = modeBalioa || (erantzunArrunta.startsWith(letraArrunta) ? "hasiera" : "barruan");

  return {
    id: lerroa.id ?? null,
    rosco: balioaGalderaLerrorako(lerroa, ["rosco"]),
    topic: balioaGalderaLerrorako(lerroa, ["topic"]),
    level: balioaGalderaLerrorako(lerroa, ["level"]),
    slotOrder: Number(lerroa.slot_order ?? 0),
    letter,
    clue,
    answer,
    acceptedAnswers,
    mode,
    sourceTopic: balioaGalderaLerrorako(lerroa, ["sourceTopic", "source_topic"]),
    sourceRosco: balioaGalderaLerrorako(lerroa, ["sourceRosco", "source_rosco"]),
  };
}

function egiaztatuGalderak(galderak) {
  if (!Array.isArray(galderak) || galderak.length !== 25) {
    throw new Error("Galdera kopuruak 25 izan behar du.");
  }

  const ikusiak = new Set();

  galderak.forEach((galdera) => {
    if (!galdera.letter || !galdera.clue || !galdera.answer) {
      throw new Error("Galdera guztiak osorik egon behar dira.");
    }

    if (ikusiak.has(galdera.letter)) {
      throw new Error("Letra errepikatuak ez dira onartzen.");
    }

    ikusiak.add(galdera.letter);
  });
}

function egiaztatuJokalarienRoskak(jokalariak, konfigurazioa) {
  const jokoModua = jokoModuaJokalariKopurutik(jokalariak?.length ?? 0);
  const jokalariKopurua = beharrezkoRoskoKopurua(jokoModua);

  if (!Array.isArray(jokalariak) || jokalariak.length !== jokalariKopurua) {
    throw new Error(
      bakarkakoJokoaDa(jokoModua)
        ? "Jokalari bakarra behar da."
        : "Bi jokalari behar dira.",
    );
  }

  if (bakarkakoJokoaDa(jokoModua)) {
    if (!jokalariak[0]?.rosco) {
      throw new Error("Jokalariak erroska bat behar du.");
    }
  } else {
    const [bat, bi] = jokalariak;

    if (!bat.rosco || !bi.rosco || bat.rosco === bi.rosco) {
      throw new Error("Jokalariek erroska bana eta desberdina behar dute.");
    }
  }

  jokalariak.forEach((jokalaria) => {
    egiaztatuGalderak(jokalaria.galderak);

    if (
      jokalaria.galderak.some(
        (galdera) =>
          galdera.topic !== konfigurazioa.topic ||
          galdera.level !== konfigurazioa.level ||
          galdera.rosco !== jokalaria.rosco,
      )
    ) {
      throw new Error("Erroskaren datuak ez datoz bat.");
    }
  });
}

function garbituKatea(balioa) {
  return `${balioa ?? ""}`.trim();
}

function gaiaNahasketaDa(gaia = egoera.konfigurazioa.topic) {
  return garbituKatea(gaia).toLowerCase() === GAIA_NAHASKETA;
}

function nahastuAusaz(zerrenda) {
  const kopia = [...zerrenda];

  for (let indizea = kopia.length - 1; indizea > 0; indizea -= 1) {
    const ausazkoa = Math.floor(Math.random() * (indizea + 1));
    [kopia[indizea], kopia[ausazkoa]] = [kopia[ausazkoa], kopia[indizea]];
  }

  return kopia;
}

function sortuNahasketaRoskoId() {
  const ausazkoZatia = Math.random().toString(36).slice(2, 8);
  return `${NAHASKETA_ROSKO_AURREZKIA}${Date.now().toString(36)}-${ausazkoZatia}`;
}

function normalizatuNahasketaGaldera(galdera, level, rosco) {
  return {
    ...galdera,
    topic: GAIA_NAHASKETA,
    level,
    rosco,
    acceptedAnswers: normalizatuAcceptedAnswers(
      galdera.acceptedAnswers ?? galdera.accepted_answers,
    ),
    sourceTopic: galdera.sourceTopic || galdera.topic,
    sourceRosco: galdera.sourceRosco || galdera.rosco,
  };
}


async function kargatuNahasketaIturriak(level) {
  const datuak = await eginSupabaseEskaera("*", { active: true, level }, "topic");
  return datuak
    .map(normalizatuGalderaLerroa)
    .filter((g) => g.topic && g.rosco && g.level === level && !gaiaNahasketaDa(g.topic) && g.letter && g.clue && g.answer);
}

function sortuNahastutakoGalderak(galderaGuztiak, level, rosco = sortuNahasketaRoskoId()) {
  if (!Array.isArray(galderaGuztiak) || galderaGuztiak.length === 0) {
    throw new Error("rosko-gutxiegi");
  }

  // Bilatu 25 letretako erreferentzia-multzoa lehen rosco osoaren bidez
  const roskoakLetraka = new Map();
  galderaGuztiak.forEach((galdera) => {
    if (!galdera.letter) return;
    const rosko = `${galdera.topic}::${galdera.rosco}`;
    const zerrenda = roskoakLetraka.get(rosko) ?? [];
    zerrenda.push(galdera.letter);
    roskoakLetraka.set(rosko, zerrenda);
  });

  const errefLetrak = [...roskoakLetraka.values()].find((letrak) => letrak.length === 25);

  if (!errefLetrak) {
    throw new Error("rosko-gutxiegi");
  }

  // Taldekatu letra bakoitzeko galdera guztiak (25 letra erreferentziazkoekin soilik)
  const letrakMultzoa = new Set(errefLetrak);
  const galderakLetraka = new Map();
  galderaGuztiak.forEach((galdera) => {
    if (!galdera.letter || !letrakMultzoa.has(galdera.letter)) return;
    const zerrenda = galderakLetraka.get(galdera.letter) ?? [];
    zerrenda.push(galdera);
    galderakLetraka.set(galdera.letter, zerrenda);
  });

  if (galderakLetraka.size < 25) {
    throw new Error("rosko-gutxiegi");
  }

  // Letra bakoitzeko ausazko galdera bat hautatu
  const galderak = errefLetrak.map((letter) => {
    const aukeragarriak = galderakLetraka.get(letter);
    const hautatua = nahastuAusaz(aukeragarriak)[0];
    return normalizatuNahasketaGaldera(hautatua, level, rosco);
  });

  egiaztatuGalderak(galderak);
  return { rosco, galderak };
}

function lortuOnlineAzkenGertaerarenPayloada(gertaera) {
  if (!gertaera || typeof gertaera !== "object") {
    return {};
  }

  if (gertaera.payload && typeof gertaera.payload === "object") {
    return gertaera.payload;
  }

  return {};
}

function normalizatuOnlineLetraEgoera(letters = []) {
  if (!Array.isArray(letters)) {
    return [];
  }

  return letters.map((letter, index) => {
    const status = garbituKatea(letter?.status ?? letter?.state) || "pending";
    return {
      slotOrder: Number(letter?.slotOrder ?? letter?.slot_order ?? index + 1) || index + 1,
      letter: garbituKatea(letter?.letter).toUpperCase(),
      status:
        status === "correct" || status === "wrong"
          ? status
          : "pending",
    };
  });
}

function kalkulatuOnlineJokalariEstatistikak(letters = []) {
  const zuzenak = letters.filter((letter) => letter.status === "correct").length;
  const okerrak = letters.filter((letter) => letter.status === "wrong").length;
  const erantzunGabeak = letters.filter((letter) => letter.status === "pending").length;

  return {
    hits: zuzenak,
    errors: okerrak,
    unanswered: erantzunGabeak,
  };
}

function bilatuOnlineHurrengoPendingSlot(letters = [], currentSlotOrder = null, unekoaBarne = false) {
  if (!Array.isArray(letters) || letters.length === 0) {
    return null;
  }

  const ordenatuta = [...letters].sort((bat, bi) => bat.slotOrder - bi.slotOrder);
  const hasierakoIndizea =
    currentSlotOrder === null
      ? -1
      : ordenatuta.findIndex((letter) => letter.slotOrder === currentSlotOrder);
  const lehenPausoa = unekoaBarne ? 0 : 1;

  for (let pausoa = lehenPausoa; pausoa <= ordenatuta.length; pausoa += 1) {
    const indizea =
      hasierakoIndizea === -1
        ? pausoa - lehenPausoa
        : (hasierakoIndizea + pausoa + ordenatuta.length) % ordenatuta.length;
    const letter = ordenatuta[indizea];

    if (letter?.status === "pending") {
      return letter.slotOrder;
    }
  }

  return null;
}

function normalizatuOnlineGameStateJokalaria(jokalaria, seat, lobbyJokalaria = null) {
  const lettersIturria = Array.isArray(jokalaria?.letters)
    ? jokalaria.letters
    : Array.isArray(jokalaria?.letters_state)
      ? jokalaria.letters_state
      : Array.isArray(lobbyJokalaria?.letters_state)
        ? lobbyJokalaria.letters_state
        : [];
  const letters = normalizatuOnlineLetraEgoera(lettersIturria);
  const stats = kalkulatuOnlineJokalariEstatistikak(letters);
  const questions = Array.isArray(jokalaria?.questions)
    ? jokalaria.questions.map(normalizatuGalderaLerroa)
    : [];
  const rawCurrentSlotOrder = Number(
    jokalaria?.currentSlotOrder ??
      jokalaria?.current_slot_order ??
      bilatuOnlineHurrengoPendingSlot(letters, null, true) ??
      0,
  );

  return {
    seat,
    rosco: garbituKatea(jokalaria?.rosco ?? lobbyJokalaria?.rosco),
    currentSlotOrder: rawCurrentSlotOrder || null,
    hits: Number(jokalaria?.hits ?? lobbyJokalaria?.hits ?? stats.hits),
    errors: Number(jokalaria?.errors ?? lobbyJokalaria?.errors ?? stats.errors),
    unanswered: Number(jokalaria?.unanswered ?? lobbyJokalaria?.unanswered ?? stats.unanswered),
    timeRemainingMs: Number(
      jokalaria?.timeRemainingMs ??
        jokalaria?.time_remaining_ms ??
        lobbyJokalaria?.time_remaining_ms ??
        HASIERAKO_DENBORA * 1000,
    ),
    letters,
    questions,
  };
}

function onlineJokalariaJolastekoPrestDago(jokalaria) {
  if (!jokalaria || typeof jokalaria !== "object") {
    return false;
  }

  const letters = normalizatuOnlineLetraEgoera(
    jokalaria.letters ?? jokalaria.letters_state ?? [],
  );
  const stats = kalkulatuOnlineJokalariEstatistikak(letters);
  const currentSlotOrder = Number(
    jokalaria.currentSlotOrder ??
      jokalaria.current_slot_order ??
      bilatuOnlineHurrengoPendingSlot(letters, null, true) ??
      0,
  );
  const unanswered = Number(jokalaria.unanswered ?? stats.unanswered);
  const timeRemainingMs = Number(
    jokalaria.timeRemainingMs ??
      jokalaria.time_remaining_ms ??
      HASIERAKO_DENBORA * 1000,
  );

  return timeRemainingMs > 0 && unanswered > 0 && Boolean(currentSlotOrder);
}

function kalkulatuOnlineTxandaAzkenGertaeratik(gertaera, player1, player2) {
  const mota = garbituKatea(gertaera?.event_type);
  const aktoreSeat = Number(gertaera?.seat ?? 0) || null;
  const createdAt = garbituKatea(gertaera?.created_at) || null;

  if (!mota) {
    return {
      turnPlayerSeat: null,
      turnStartedAt: null,
    };
  }

  if (mota === "match_started") {
    return {
      turnPlayerSeat: 1,
      turnStartedAt: createdAt,
    };
  }

  if (!aktoreSeat) {
    return {
      turnPlayerSeat: null,
      turnStartedAt: null,
    };
  }

  const besteSeat = aktoreSeat === 1 ? 2 : 1;
  const aktorea = aktoreSeat === 1 ? player1 : player2;
  const bestea = besteSeat === 1 ? player1 : player2;
  const aktoreaPrest = onlineJokalariaJolastekoPrestDago(aktorea);
  const besteaPrest = onlineJokalariaJolastekoPrestDago(bestea);
  const payloada = lortuOnlineAzkenGertaerarenPayloada(gertaera);

  if (mota === "pasapalabra") {
    return {
      turnPlayerSeat: besteaPrest ? besteSeat : aktoreaPrest ? aktoreSeat : null,
      turnStartedAt: createdAt,
    };
  }

  if (mota === "answer_submitted") {
    const emaitza = garbituKatea(payloada.result);
    const turnPlayerSeat =
      emaitza === "correct"
        ? aktoreaPrest
          ? aktoreSeat
          : besteaPrest
            ? besteSeat
            : null
        : besteaPrest
          ? besteSeat
          : aktoreaPrest
            ? aktoreSeat
            : null;

    return {
      turnPlayerSeat,
      turnStartedAt: createdAt,
    };
  }

  if (mota === "time_expired") {
    return {
      turnPlayerSeat: besteaPrest ? besteSeat : null,
      turnStartedAt: createdAt,
    };
  }

  return {
    turnPlayerSeat: null,
    turnStartedAt: null,
  };
}

function normalizatuOnlineGameState(rawGameState, partida = egoera.online.onlineMatch) {
  const jokalariak = Array.isArray(egoera.online.onlinePlayersState)
    ? egoera.online.onlinePlayersState
    : [];
  const player1Lobby = jokalariak.find((jokalaria) => jokalaria.seat === 1) ?? null;
  const player2Lobby = jokalariak.find((jokalaria) => jokalaria.seat === 2) ?? null;
  const player1Raw = rawGameState?.player1 ?? rawGameState?.player_1 ?? null;
  const player2Raw = rawGameState?.player2 ?? rawGameState?.player_2 ?? null;
  const phase =
    garbituKatea(rawGameState?.phase) ||
    (partida?.status === "finished"
      ? "finished"
      : partida?.status === "playing" || partida?.status === "in_progress"
        ? "playing"
        : garbituKatea(partida?.status));
  const turnPlayerSeat = Number(
    rawGameState?.turnPlayerSeat ??
      rawGameState?.turn_player_seat ??
      partida?.current_turn_seat ??
      0,
  );
  const turnPlayerId =
    garbituKatea(rawGameState?.turnPlayerId ?? rawGameState?.turn_player_id) ||
    garbituKatea(partida?.current_turn_player_id) ||
    null;
  const turnStartedAt =
    garbituKatea(rawGameState?.turnStartedAt ?? rawGameState?.turn_started_at) ||
    garbituKatea(partida?.turn_started_at) ||
    null;
  const startedAt =
    garbituKatea(rawGameState?.startedAt ?? rawGameState?.started_at) ||
    garbituKatea(partida?.started_at) ||
    null;
  const finishedAt =
    garbituKatea(rawGameState?.finishedAt ?? rawGameState?.finished_at) ||
    garbituKatea(partida?.finished_at) ||
    null;
  const winnerSeat = Number(
    rawGameState?.winnerSeat ??
      rawGameState?.winner_seat ??
      partida?.winner_seat ??
      0,
  );
  const reason =
    garbituKatea(rawGameState?.reason ?? rawGameState?.finish_reason) ||
    garbituKatea(partida?.finish_reason) ||
    null;
  const player1 = normalizatuOnlineGameStateJokalaria(player1Raw, 1, player1Lobby);
  const player2 = normalizatuOnlineGameStateJokalaria(player2Raw, 2, player2Lobby);
  const txandaAzkenGertaeratik = kalkulatuOnlineTxandaAzkenGertaeratik(
    egoera.online.onlineLatestEvent,
    player1,
    player2,
  );
  const txandaMota = garbituKatea(egoera.online.onlineLatestEvent?.event_type);
  const txandaGertaeratikErabili =
    phase === "playing" &&
    (txandaMota === "match_started" ||
      txandaMota === "pasapalabra" ||
      txandaMota === "answer_submitted" ||
      txandaMota === "time_expired") &&
    txandaAzkenGertaeratik.turnPlayerSeat !== null;

  if (
    !phase &&
    !turnPlayerSeat &&
    !player1.rosco &&
    !player2.rosco &&
    player1.letters.length === 0 &&
    player2.letters.length === 0
  ) {
    return null;
  }

  return {
    phase: phase || "waiting",
    topic: garbituKatea(rawGameState?.topic ?? partida?.topic),
    level: garbituKatea(rawGameState?.level ?? partida?.level),
    turnPlayerSeat: txandaGertaeratikErabili
      ? txandaAzkenGertaeratik.turnPlayerSeat
      : turnPlayerSeat || null,
    turnPlayerId,
    turnStartedAt: txandaGertaeratikErabili
      ? txandaAzkenGertaeratik.turnStartedAt ?? turnStartedAt
      : turnStartedAt,
    startedAt,
    finishedAt,
    winnerSeat: winnerSeat || null,
    reason,
    player1,
    player2,
  };
}

function eraikiSupabaseParametroak(select, filtroak = {}, orderBy) {
  const parametroak = new URLSearchParams();
  parametroak.set("select", select);

  Object.entries(filtroak).forEach(([gakoa, balioa]) => {
    if (balioa === undefined || balioa === null || balioa === "") {
      return;
    }

    if (typeof balioa === "boolean") {
      parametroak.set(gakoa, `eq.${balioa ? "true" : "false"}`);
      return;
    }

    parametroak.set(gakoa, `eq.${balioa}`);
  });

  if (orderBy) {
    parametroak.set("order", `${orderBy}.asc`);
  }

  return parametroak.toString();
}

async function eginSupabaseEskaera(select, filtroak = {}, orderBy) {
  if (!supabaseKonfiguratutaDago()) {
    throw new Error("supabase-konfiguratu-gabe");
  }

  const parametroak = eraikiSupabaseParametroak(select, filtroak, orderBy);
  const erantzuna = await fetch(`${SUPABASE_URL}/rest/v1/hitzapasa?${parametroak}`, {
    headers: SUPABASE_HEADERS,
  });

  if (!erantzuna.ok) {
    throw new Error("supabase");
  }

  return erantzuna.json();
}

function aukerakBakarrik(lerroak, gakoa) {
  const ikusiak = new Set();

  return lerroak
    .map((lerroa) => `${lerroa[gakoa] ?? ""}`.trim())
    .filter((balioa) => {
      if (!balioa || ikusiak.has(balioa)) {
        return false;
      }

      ikusiak.add(balioa);
      return true;
    });
}

function hautatutakoBalioaMantendu(aukerak, balioa) {
  return aukerak.includes(balioa) ? balioa : "";
}

function konfigurazioaOsatuta() {
  return Boolean(egoera.konfigurazioa.topic && egoera.konfigurazioa.level);
}

function hautapenakKargatzenDira() {
  return Object.values(egoera.kargatzen).some(Boolean);
}

function onlineSortzekoKargatzenDa() {
  return egoera.online.loadingCreate;
}

function onlineSartzekoKargatzenDa() {
  return egoera.online.loadingJoin;
}

function onlineSaioaKargatzenDa() {
  return egoera.online.loadingAuth;
}

function onlinePrestatzekoKargatzenDa() {
  return egoera.online.loadingSetReady;
}

function onlineHastekoKargatzenDa() {
  return egoera.online.loadingStartMatch;
}

function onlineLobbyKargatzenDa() {
  return egoera.online.loadingLobby;
}

function onlineJokoaKargatzenDa() {
  return egoera.online.loadingGameData;
}

function onlineErantzunaBidaltzenDa() {
  return egoera.online.loadingSubmitAnswer;
}

function onlinePasapalabraBidaltzenDa() {
  return egoera.online.loadingPassTurn;
}

function onlineTimeoutKargatzenDa() {
  return egoera.online.loadingTimeout;
}

function onlineKargatzenDa() {
  return (
    onlineSortzekoKargatzenDa() ||
    onlineSartzekoKargatzenDa() ||
    onlineSaioaKargatzenDa() ||
    onlinePrestatzekoKargatzenDa() ||
    onlineHastekoKargatzenDa() ||
    onlineLobbyKargatzenDa() ||
    onlineJokoaKargatzenDa() ||
    onlineErantzunaBidaltzenDa() ||
    onlinePasapalabraBidaltzenDa() ||
    onlineTimeoutKargatzenDa()
  );
}

function onlineSaioaPrestDago() {
  return Boolean(egoera.online.authReady && egoera.online.authUserId);
}

function ezarriHasieraMezua(mezua, mota = "oharra") {
  egoera.hasieraMezua = mezua;
  egoera.hasieraMezuMota = mota;
}

function ezarriOnlineErrorea(mota, mezua = "") {
  if (mota === "create") {
    egoera.online.errorCreate = mezua;
    return;
  }

  egoera.online.errorJoin = mezua;
}

function garbituOnlineErroreak() {
  egoera.online.errorCreate = "";
  egoera.online.errorJoin = "";
  egoera.online.errorAuth = "";
  egoera.online.errorSetReady = "";
  egoera.online.errorStartMatch = "";
  egoera.online.errorLobby = "";
  egoera.online.errorGameData = "";
  egoera.online.errorOnlineMove = "";
  egoera.online.errorOnlineFinish = "";
}

function normalizatuRoomCode(testua) {
  return `${testua ?? ""}`
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function itzuliOnlineErrorea(mota, mezua = "") {
  const arrunta = normalizatuErantzuna(`${mezua ?? ""}`);

  if (!arrunta) {
    if (mota === "sortu") {
      return "Ezin izan da partida sortu";
    }

    if (mota === "hasi") {
      return "Ezin izan da partida hasi";
    }

    if (mota === "prest") {
      return "Ezin izan da prest egoera gorde";
    }

    if (mota === "jokaldia") {
      return "Ezin izan da jokaldia bidali";
    }

    return "Ezin izan da partidan sartu";
  }

  if (
    arrunta.includes("saioa") ||
    arrunta.includes("session") ||
    arrunta.includes("auth") ||
    arrunta.includes("jwt") ||
    arrunta.includes("token") ||
    arrunta.includes("login")
  ) {
    return "Saioa hasi behar duzu online partidarako";
  }

  if (
    arrunta.includes("kode") ||
    arrunta.includes("roomcode") ||
    arrunta.includes("room code") ||
    arrunta.includes("invalid") ||
    arrunta.includes("balioz")
  ) {
    return "Kode hori ez da baliozkoa";
  }

  if (arrunta.includes("beteta") || arrunta.includes("full")) {
    return "Gela beteta dago";
  }

  if (
    arrunta.includes("hutsik") ||
    arrunta.includes("empty answer") ||
    arrunta.includes("erantzuna behar") ||
    arrunta.includes("answer required")
  ) {
    return "Ezin duzu hutsik bidali";
  }

  if (
    arrunta.includes("zure txanda") ||
    arrunta.includes("turn") ||
    arrunta.includes("not your turn")
  ) {
    return "Beste jokalariaren txanda";
  }

  if (
    arrunta.includes("playing") ||
    arrunta.includes("martxan") ||
    arrunta.includes("ez dago martxan")
  ) {
    return "Partida ez dago martxan";
  }

  if (
    arrunta.includes("finished") ||
    arrunta.includes("amaituta") ||
    arrunta.includes("amaiera")
  ) {
    return "Partida amaitu da";
  }

  if (
    arrunta.includes("timeout") ||
    arrunta.includes("time expired") ||
    arrunta.includes("denbora")
  ) {
    return "Denbora agortuta";
  }

  if (
    arrunta.includes("rosko") ||
    arrunta.includes("erroska") ||
    arrunta.includes("nahikoa") ||
    arrunta.includes("25 galdera") ||
    arrunta.includes("question count")
  ) {
    return "Ez dago nahikoa erroskarik";
  }

  if (
    arrunta.includes("erabilgarri") ||
    arrunta.includes("unavailable") ||
    arrunta.includes("not found") ||
    arrunta.includes("not available") ||
    arrunta.includes("closed")
  ) {
    return "Partida ez dago erabilgarri";
  }

  if (mota === "sortu") {
    return "Ezin izan da partida sortu";
  }

  if (mota === "hasi") {
    return "Ezin izan da partida hasi";
  }

  if (mota === "prest") {
    return "Ezin izan da prest egoera gorde";
  }

  if (mota === "jokaldia") {
    return "Ezin izan da jokaldia bidali";
  }

  if (mota === "amaiera") {
    return "Ezin izan da partida amaiera eguneratu";
  }

  return "Ezin izan da partidan sartu";
}

function itzuliOnlineAuthErrorea(mezua = "") {
  const arrunta = normalizatuErantzuna(`${mezua ?? ""}`);

  if (
    arrunta.includes("anonymous_provider_disabled") ||
    arrunta.includes("anonymous sign-ins are disabled") ||
    arrunta.includes("anonymous signups are disabled")
  ) {
    return "Saio anonimoa desgaituta dago Supabase-n";
  }

  if (
    arrunta.includes("signup") ||
    arrunta.includes("sign up") ||
    arrunta.includes("not allowed")
  ) {
    return "Saio berriak ez daude baimenduta";
  }

  return "Ezin izan da online saioa hasi";
}

function onlineLobbyPrestDago() {
  return Boolean(egoera.online.onlineMatch?.id && egoera.online.onlinePlayer?.seat);
}

function lortuOnlineLobbyJokalaria(seat) {
  return egoera.online.onlinePlayersState.find((jokalaria) => jokalaria.seat === seat);
}

function sinkronizatuUnekoOnlineJokalaria() {
  const seat = egoera.online.onlinePlayer?.seat;

  if (!seat) {
    return;
  }

  const jokalaria = lortuOnlineLobbyJokalaria(seat);

  if (!jokalaria?.present) {
    return;
  }

  egoera.online.onlinePlayer = {
    ...(egoera.online.onlinePlayer ?? {}),
    ...jokalaria,
  };
}

function eguneratuLobbyPrestEgoera() {
  egoera.online.onlineReadyToStart = egoera.online.onlinePlayersState.every(
    (jokalaria) => jokalaria.present && jokalaria.is_ready,
  );
}

function garbituOnlineEguneratzeProgramazioa() {
  if (onlineEguneratzeTimeoutId) {
    window.clearTimeout(onlineEguneratzeTimeoutId);
    onlineEguneratzeTimeoutId = null;
  }
}

function garbituOnlineHasieraProgramazioa() {
  if (onlineHasieraTimeoutId) {
    window.clearTimeout(onlineHasieraTimeoutId);
    onlineHasieraTimeoutId = null;
  }
}

function garbituOnlinePrestEguneratzeProgramazioa() {
  if (onlinePrestEguneratzeTimeoutId) {
    window.clearTimeout(onlinePrestEguneratzeTimeoutId);
    onlinePrestEguneratzeTimeoutId = null;
  }
}

function garbituOnlineJokoEguneratzeProgramazioa() {
  if (onlineJokoEguneratzeTimeoutId) {
    window.clearTimeout(onlineJokoEguneratzeTimeoutId);
    onlineJokoEguneratzeTimeoutId = null;
  }
}

function programatuOnlineTrantsizioa() {
  if (!egoera.online.onlineReadyToStart) {
    garbituOnlineHasieraProgramazioa();
    return;
  }

  if (egoera.pantaila === "online-prest") {
    return;
  }

  garbituOnlineHasieraProgramazioa();
  onlineHasieraTimeoutId = window.setTimeout(() => {
    onlineHasieraTimeoutId = null;

    if (!egoera.online.onlineReadyToStart || !onlineLobbyPrestDago()) {
      return;
    }

    renderOnlinePrestScreen();
    gordeEgoera();
  }, 900);
}

function programatuOnlineLobbyEguneratzea() {
  if (!onlineLobbyPrestDago()) {
    return;
  }

  garbituOnlineEguneratzeProgramazioa();
  onlineEguneratzeTimeoutId = window.setTimeout(() => {
    onlineEguneratzeTimeoutId = null;
    void kargatuOnlineLobbyEgoera(true);
  }, 140);
}

async function garbituOnlineRealtimeHarpidetza() {
  garbituOnlineEguneratzeProgramazioa();
  garbituOnlineHasieraProgramazioa();
  garbituOnlinePrestEguneratzeProgramazioa();
  garbituOnlineJokoEguneratzeProgramazioa();
  egoera.online.onlineRealtimeConnected = false;

  if (!onlineRealtimeKanala || !supabase) {
    onlineRealtimeKanala = null;
    onlineRealtimeMatchId = "";
    return;
  }

  const kanala = onlineRealtimeKanala;
  onlineRealtimeKanala = null;
  onlineRealtimeMatchId = "";

  try {
    await supabase.removeChannel(kanala);
  } catch (_errorea) {
    // Ez dugu ezer egin behar hemen; irteteko garbiketa nahikoa da.
  }
}

async function ziurtatuOnlineRealtimeHarpidetza() {
  if (!onlineLobbyPrestDago() || !supabase) {
    return;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();

  if (!matchId) {
    return;
  }

  if (onlineRealtimeKanala && onlineRealtimeMatchId === matchId) {
    return;
  }

  await garbituOnlineRealtimeHarpidetza();

  egoera.online.onlineRealtimeConnected = false;
  onlineRealtimeMatchId = matchId;
  onlineRealtimeKanalZenbakia += 1;
  const kanalIzena = `online-lobby:${matchId}:${onlineRealtimeKanalZenbakia}`;
  onlineRealtimeKanala = supabase
    .channel(kanalIzena)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "matches",
        filter: `id=eq.${matchId}`,
      },
      () => {
        programatuOnlineLobbyEguneratzea();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "match_players",
        filter: `match_id=eq.${matchId}`,
      },
      () => {
        programatuOnlineLobbyEguneratzea();
      },
    )
    .subscribe((egoeraBerria) => {
      egoera.online.onlineRealtimeConnected = egoeraBerria === "SUBSCRIBED";

      if (egoera.online.onlineRealtimeConnected) {
        programatuOnlineLobbyEguneratzea();
      }

      if (
        egoera.pantaila === "online-lobby" ||
        egoera.pantaila === "online-prest" ||
        egoera.pantaila === "online-jokoa" ||
        egoera.pantaila === "online-amaiera"
      ) {
        renderOnlinePantailaAktiboa();
      }
    });
}

function gordeOnlineErantzuna(data, flow = egoera.online.flow) {
  if (flow) {
    egoera.online.flow = flow;
  }

  if (data.match) {
    egoera.online.onlineMatch = {
      ...(egoera.online.onlineMatch ?? {}),
      ...data.match,
    };
  }

  if (data.game_state && egoera.online.onlineMatch) {
    egoera.online.onlineMatch = {
      ...egoera.online.onlineMatch,
      game_state: data.game_state,
    };
  }

  if (data.player) {
    egoera.online.onlinePlayer = {
      ...(egoera.online.onlinePlayer ?? {}),
      ...data.player,
    };
  }

  if (Array.isArray(data.players) && data.players.length > 0) {
    egoera.online.onlinePlayersState = sortuLobbyJokalariak(data.players);
  } else if (egoera.online.onlinePlayer?.seat) {
    const unekoak = egoera.online.onlinePlayersState
      .filter((jokalaria) => jokalaria.present)
      .map((jokalaria) => ({
        seat: jokalaria.seat,
        player_id: jokalaria.player_id,
        is_ready: jokalaria.is_ready,
        is_connected: jokalaria.is_connected,
        rosco: jokalaria.rosco,
        topic: jokalaria.topic,
        level: jokalaria.level,
        time_remaining_ms: jokalaria.time_remaining_ms,
        hits: jokalaria.hits,
        errors: jokalaria.errors,
        unanswered: jokalaria.unanswered,
        letters_state: jokalaria.letters_state,
      }));

    const unekoa = {
      seat: egoera.online.onlinePlayer.seat,
      player_id: egoera.online.onlinePlayer.player_id ?? null,
      is_ready: Boolean(egoera.online.onlinePlayer.is_ready),
      is_connected: true,
      rosco: egoera.online.onlinePlayer.rosco ?? null,
      topic: egoera.online.onlinePlayer.topic ?? egoera.konfigurazioa.topic,
      level: egoera.online.onlinePlayer.level ?? egoera.konfigurazioa.level,
      time_remaining_ms:
        Number(egoera.online.onlinePlayer.time_remaining_ms ?? HASIERAKO_DENBORA * 1000),
      hits: Number(egoera.online.onlinePlayer.hits ?? 0),
      errors: Number(egoera.online.onlinePlayer.errors ?? 0),
      unanswered: Number(egoera.online.onlinePlayer.unanswered ?? 25),
      letters_state: Array.isArray(egoera.online.onlinePlayer.letters_state)
        ? egoera.online.onlinePlayer.letters_state
        : [],
    };

    egoera.online.onlinePlayersState = sortuLobbyJokalariak([
      ...unekoak.filter((jokalaria) => jokalaria.seat !== unekoa.seat),
      unekoa,
    ]);
  }

  if ("message" in data && `${data.message ?? ""}`.trim()) {
    egoera.online.lobbyMessage = `${data.message ?? ""}`.trim();
  }

  if ("gameState" in data && data.gameState && typeof data.gameState === "object") {
    egoera.online.onlineGameState = data.gameState;
  }

  if ("result" in data) {
    egoera.online.errorOnlineMove = "";
    if (data.result === "correct") {
      egoera.online.onlineMoveMessage = "Erantzun zuzena!";
    } else if (data.result === "wrong") {
      const erantzunZuzena = `${data.correctAnswer ?? ""}`.trim();
      egoera.online.onlineMoveMessage = erantzunZuzena
        ? `Erantzun okerra! Erantzun zuzena: ${erantzunZuzena}`
        : "Erantzun okerra!";
    } else if (data.result === "passed") {
      egoera.online.onlineMoveMessage = "Hitzapasa egin duzu";
    } else if (data.result === "timeout") {
      egoera.online.onlineMoveMessage = "Denbora agortuta";
    } else if (data.result === "synced") {
      egoera.online.onlineMoveMessage = "Denbora eguneratzen...";
    }

    if (egoera.online.onlineMoveMessage) {
      programatuOnlineMugimenduMezuaGarbitzea();
    } else {
      garbituOnlineMugimenduMezuProgramazioa();
    }
  }

  if (egoera.online.onlineMatch?.topic) {
    egoera.konfigurazioa.topic = `${egoera.online.onlineMatch.topic}`.trim();
  }

  if (egoera.online.onlineMatch?.level) {
    egoera.konfigurazioa.level = `${egoera.online.onlineMatch.level}`.trim();
  }

  if (egoera.online.onlineMatch?.game_state) {
    egoera.online.onlineGameState = egoera.online.onlineMatch.game_state;
  }

  sinkronizatuUnekoOnlineJokalaria();
  eguneratuLobbyPrestEgoera();

  if (data?.bothReady === true) {
    egoera.online.onlineReadyToStart = true;
  }

  if (egoera.online.onlineMatch?.status === "playing") {
    egoera.online.onlineReadyToStart = true;
  }

  eguneratuOnlineAmaieraEgoera();
  egoera.online.onlineTimerDisplay = formateatuOnlineDenbora(kalkulatuOnlineDenboraBisualaMs());

  if (egoera.online.onlineReadyToStart && egoera.online.onlineMatch) {
    egoera.online.onlineMatch = {
      ...egoera.online.onlineMatch,
      status:
        egoera.online.onlineMatch.status === "playing"
          ? "playing"
          : egoera.online.onlineMatch.status || "ready",
    };
  }

  const timeoutGakoa = sortuOnlineTimeoutGakoa();
  if (timeoutGakoa !== onlineTimeoutEskatutakoGakoa) {
    onlineTimeoutEskatutakoGakoa = "";
  }
}

function unekoOnlineJokalariaPrestDago() {
  const seat = egoera.online.onlinePlayer?.seat;

  if (!seat) {
    return false;
  }

  return Boolean(lortuOnlineLobbyJokalaria(seat)?.is_ready);
}

function itzuliLobbyJokalariEgoera(jokalaria) {
  if (!jokalaria?.present) {
    return "Jokalariaren zain";
  }

  return jokalaria.is_ready ? "Prest" : "Ez prest";
}

function itzuliLobbyOharra() {
  const seat = egoera.online.onlinePlayer?.seat ?? 0;
  const unekoa = lortuOnlineLobbyJokalaria(seat);
  const bestea = egoera.online.onlinePlayersState.find((jokalaria) => jokalaria.seat !== seat);

  if (egoera.online.onlineReadyToStart) {
    return "Bi jokalariak prest daude. Partida hasteko prest.";
  }

  if (!bestea?.present) {
    return "Bigarren jokalariaren zain";
  }

  if (unekoa?.is_ready) {
    return "Beste jokalaria prestatzeko zain";
  }

  return "Prest zaudenean, sakatu botoia";
}

function itzuliLobbyEgoera(status) {
  if (status === "waiting") {
    return "Bigarren jokalariaren zain";
  }

  if (status === "ready") {
    return "Prestatzeko prest";
  }

  if (status === "full") {
    return "Bi jokalariak barruan";
  }

  if (status === "in_progress" || status === "playing") {
    return "Partida martxan";
  }

  if (status === "finished") {
    return "Amaituta";
  }

  return "Ezezaguna";
}

function itzuliOnlineLobbyFeedbacka() {
  if (!onlineSaioaEtaEserlekuaBatDatoz()) {
    return {
      mezua: "Saio hau ez dator bat jokalari honekin. Erabili beste leiho edo nabigatzaile independente bat.",
      mota: "okerra",
    };
  }

  if (egoera.online.errorSetReady) {
    return {
      mezua: egoera.online.errorSetReady,
      mota: "okerra",
    };
  }

  if (egoera.online.errorStartMatch) {
    return {
      mezua: egoera.online.errorStartMatch,
      mota: "okerra",
    };
  }

  if (egoera.online.errorLobby) {
    return {
      mezua: egoera.online.errorLobby,
      mota: "okerra",
    };
  }

  if (onlinePrestatzekoKargatzenDa()) {
    return {
      mezua: "Kargatzen...",
      mota: "oharra",
    };
  }

  if (onlineHastekoKargatzenDa()) {
    return {
      mezua: "Partida abiarazten...",
      mota: "oharra",
    };
  }

  if (onlineLobbyKargatzenDa()) {
    return {
      mezua: "Egoera eguneratzen...",
      mota: "oharra",
    };
  }

  if (!egoera.online.onlineRealtimeConnected) {
    return {
      mezua: "Konexioa eguneratzen",
      mota: "oharra",
    };
  }

  return {
    mezua: "",
    mota: "oharra",
  };
}

function itzuliEserlekuEtiketa(seat) {
  return `${seat}. jokalaria`;
}

function onlinePartidaJolastenDago() {
  const partida = egoera.online.onlineMatch;
  const gameState = lortuOnlineGameState();

  if (!gameState) {
    return false;
  }

  if (partida?.status === "finished" || `${gameState?.phase ?? ""}` === "finished") {
    return false;
  }

  return partida?.status === "playing" || `${gameState?.phase ?? ""}` === "playing";
}

function onlinePartidaAmaitutaDago() {
  const partida = egoera.online.onlineMatch;
  const gameState = lortuOnlineGameState();

  return (
    partida?.status === "finished" ||
    `${gameState?.phase ?? ""}` === "finished" ||
    Boolean(gameState?.finishedAt)
  );
}

function lortuOnlineGameState() {
  return normalizatuOnlineGameState(
    egoera.online.onlineGameState ?? egoera.online.onlineMatch?.game_state ?? null,
    egoera.online.onlineMatch,
  );
}

function lortuOnlineGameStateJokalaria(seat = egoera.online.onlinePlayer?.seat) {
  if (!seat) {
    return null;
  }

  const gameState = lortuOnlineGameState();

  if (!gameState || typeof gameState !== "object") {
    return null;
  }

  return gameState[`player${seat}`] ?? null;
}

function lortuOnlineEsleitutakoRoskoa() {
  return (
    lortuOnlineGameStateJokalaria()?.rosco ??
    egoera.online.onlinePlayer?.rosco ??
    lortuOnlineLobbyJokalaria(egoera.online.onlinePlayer?.seat ?? 0)?.rosco ??
    ""
  );
}

function lortuOnlineEsleitutakoGalderak() {
  const galderak = lortuOnlineGameStateJokalaria()?.questions ?? [];
  return Array.isArray(galderak) ? galderak.map(normalizatuGalderaLerroa) : [];
}

function lortuOnlineTxandakoSeat() {
  return Number(lortuOnlineGameState()?.turnPlayerSeat ?? 0) || null;
}

function lortuOnlineTxandakoJokalaria() {
  const seat = lortuOnlineTxandakoSeat();

  if (!seat) {
    return null;
  }

  return lortuOnlineGameStateJokalaria(seat);
}

function kalkulatuOnlineJokalariDenboraBisualaMs(seat) {
  if (!seat) {
    return HASIERAKO_DENBORA * 1000;
  }

  const gameState = lortuOnlineGameState();
  const jokalaria = lortuOnlineGameStateJokalaria(seat);
  const oinarria = Number(
    jokalaria?.timeRemainingMs ??
      jokalaria?.time_remaining_ms ??
      HASIERAKO_DENBORA * 1000,
  );

  if (
    !onlinePartidaJolastenDago() ||
    !jokalaria ||
    Number(gameState?.turnPlayerSeat ?? 0) !== Number(seat) ||
    !gameState?.turnStartedAt
  ) {
    return Math.max(0, oinarria);
  }

  const hasiera = Date.parse(gameState.turnStartedAt);
  if (!Number.isFinite(hasiera)) {
    return Math.max(0, oinarria);
  }

  return Math.max(0, oinarria - (Date.now() - hasiera));
}

function lortuOnlineLetrenMapak(letters = []) {
  const slotMap = new Map();
  const letterMap = new Map();

  if (!Array.isArray(letters)) {
    return { slotMap, letterMap };
  }

  letters.forEach((sarrera, index) => {
    if (!sarrera || typeof sarrera !== "object") {
      return;
    }

    const slotOrder = Number(
      sarrera.slotOrder ?? sarrera.slot_order ?? sarrera.currentSlotOrder ?? index + 1,
    );
    const status = `${sarrera.status ?? sarrera.state ?? "pending"}`.trim() || "pending";
    const letter = `${sarrera.letter ?? ""}`.trim().toUpperCase();
    const balioa = {
      slotOrder,
      status,
      letter,
    };

    slotMap.set(slotOrder, balioa);

    if (letter) {
      letterMap.set(letter, balioa);
    }
  });

  return { slotMap, letterMap };
}

function lortuOnlineUnekoSlotOrder() {
  const jokalaria = lortuOnlineGameStateJokalaria();
  const galderak = egoera.online.onlineGameQuestions;

  if (!jokalaria || !Array.isArray(galderak) || galderak.length === 0) {
    return null;
  }

  const slotOrder = Number(jokalaria.currentSlotOrder ?? 0);

  if (!slotOrder) {
    return null;
  }

  return galderak.some((galdera) => galdera.slotOrder === slotOrder)
    ? slotOrder
    : null;
}

function lortuOnlineUnekoGaldera() {
  const galderak = egoera.online.onlineGameQuestions;

  if (!Array.isArray(galderak) || galderak.length === 0) {
    return null;
  }

  const slotOrder = lortuOnlineUnekoSlotOrder();
  if (!slotOrder) {
    return null;
  }
  return galderak.find((galdera) => galdera.slotOrder === slotOrder) ?? galderak[0];
}

function lortuOnlineUnekoDenbora() {
  if (egoera.online.onlineTimerDisplay) {
    return egoera.online.onlineTimerDisplay;
  }

  const milisegundoak = kalkulatuOnlineDenboraBisualaMs();
  return formateatuOnlineDenbora(milisegundoak);
}

function itzuliOnlineTxanda() {
  const gameState = lortuOnlineGameState();
  const txanda = Number(gameState?.turnPlayerSeat ?? 0);
  if (!txanda) {
    return "Txandarik ez";
  }
  return itzuliEserlekuEtiketa(txanda);
}

function nireOnlineTxandaDa() {
  const seat = egoera.online.onlinePlayer?.seat;
  const gameState = lortuOnlineGameState();

  return Boolean(
    seat &&
      onlinePartidaJolastenDago() &&
      Number(gameState?.turnPlayerSeat ?? 0) === Number(seat),
  );
}

function kalkulatuOnlineDenboraBisualaMs() {
  return kalkulatuOnlineJokalariDenboraBisualaMs(lortuOnlineTxandakoSeat());
}

function formateatuOnlineDenbora(milisegundoak) {
  return `${Math.max(0, Math.ceil(Number(milisegundoak ?? 0) / 1000))}s`;
}

function itzuliOnlineLaburpena(jokalaria) {
  if (!jokalaria) {
    return "-";
  }

  return `${Number(jokalaria.hits ?? 0)} / ${Number(jokalaria.errors ?? 0)} · ${formateatuOnlineDenbora(
    kalkulatuOnlineJokalariDenboraBisualaMs(jokalaria.seat),
  )}`;
}

function itzuliOnlineJokoMezua() {
  if (!onlineSaioaEtaEserlekuaBatDatoz()) {
    return {
      mezua: "Saio hau ez dator bat jokalari honekin. Erabili beste leiho edo nabigatzaile independente bat.",
      mota: "okerra",
    };
  }

  if (egoera.online.errorOnlineMove) {
    return {
      mezua: egoera.online.errorOnlineMove,
      mota: "okerra",
    };
  }

  if (egoera.online.errorGameData) {
    return {
      mezua: egoera.online.errorGameData,
      mota: "okerra",
    };
  }

  if (egoera.online.errorOnlineFinish) {
    return {
      mezua: egoera.online.errorOnlineFinish,
      mota: "okerra",
    };
  }

  if (egoera.online.errorStartMatch) {
    return {
      mezua: egoera.online.errorStartMatch,
      mota: "okerra",
    };
  }

  if (onlineJokoaKargatzenDa()) {
    return {
      mezua: "Erroska kargatzen...",
      mota: "oharra",
    };
  }

  if (onlineHastekoKargatzenDa()) {
    return {
      mezua: "Partida abiarazten...",
      mota: "oharra",
    };
  }

  if (onlineErantzunaBidaltzenDa()) {
    return {
      mezua: "Erantzuna bidaltzen...",
      mota: "oharra",
    };
  }

  if (onlinePasapalabraBidaltzenDa()) {
    return {
      mezua: "Hitzapasa bidaltzen...",
      mota: "oharra",
    };
  }

  if (onlineTimeoutKargatzenDa()) {
    return {
      mezua: "Denbora eguneratzen...",
      mota: "oharra",
    };
  }

  if (egoera.online.onlineMoveMessage) {
    const mota =
      egoera.online.onlineMoveMessage === "Erantzun zuzena!"
        ? "zuzena"
        : egoera.online.onlineMoveMessage === "Erantzun okerra!"
          ? "okerra"
          : "oharra";
    return {
      mezua: egoera.online.onlineMoveMessage,
      mota,
    };
  }

  if (onlinePartidaAmaitutaDago()) {
    return {
      mezua: "Partida amaitu da",
      mota: "oharra",
    };
  }

  if (!onlinePartidaJolastenDago()) {
    return {
      mezua: "Partida hasi da",
      mota: "oharra",
    };
  }

  if (nireOnlineTxandaDa()) {
    return {
      mezua: "Zure txanda da",
      mota: "oharra",
    };
  }

  return {
    mezua: "Beste jokalariaren txanda",
    mota: "oharra",
  };
}

function itzuliOnlineAmaieraArrazoia(reason) {
  if (reason === "completed_rosco") {
    return "Erroska osatuta";
  }

  if (reason === "time_expired") {
    return "Denbora agortuta";
  }

  if (reason === "draw") {
    return "Berdinketa";
  }

  return "Amaiera ezezaguna";
}

function sortuOnlineAmaieraEmaitza() {
  const partida = egoera.online.onlineMatch;
  const gameState = lortuOnlineGameState();

  if (!partida || !gameState) {
    return null;
  }

  const winnerSeat = Number(gameState.winnerSeat ?? 0) || null;
  return {
    roomCode: partida.room_code || "-",
    topic: partida.topic || "-",
    level: partida.level || "-",
    winnerSeat,
    winnerText: winnerSeat ? itzuliEserlekuEtiketa(winnerSeat) : "Berdinketa",
    reason: `${gameState.reason ?? ""}`.trim() || "draw",
    player1: gameState.player1 ?? null,
    player2: gameState.player2 ?? null,
  };
}

function eguneratuOnlineAmaieraEgoera() {
  if (!onlinePartidaAmaitutaDago()) {
    egoera.online.onlineFinishedResult = null;
    return;
  }

  egoera.online.onlineFinishedResult = sortuOnlineAmaieraEmaitza();
}

function garbituOnlineKontagailua() {
  if (onlineKontagailuaId) {
    window.clearInterval(onlineKontagailuaId);
    onlineKontagailuaId = null;
  }
}

function sortuOnlineTimeoutGakoa() {
  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
  const gameState = lortuOnlineGameState();
  const turnSeat = Number(gameState?.turnPlayerSeat ?? 0) || 0;
  const turnStartedAt = `${gameState?.turnStartedAt ?? ""}`.trim();

  if (!matchId || !turnSeat || !turnStartedAt) {
    return "";
  }

  return `${matchId}:${turnSeat}:${turnStartedAt}`;
}

function eguneratuOnlineKontagailua() {
  if (!onlinePartidaJolastenDago()) {
    garbituOnlineKontagailua();
    return;
  }

  const milisegundoak = kalkulatuOnlineDenboraBisualaMs();
  egoera.online.onlineTimerDisplay = formateatuOnlineDenbora(milisegundoak);

  if (egoera.pantaila === "online-jokoa") {
    dom.onlineJokoDenbora.textContent = egoera.online.onlineTimerDisplay;
  }

  if (milisegundoak <= 0) {
    void handleOnlineTimeout(true);
  }
}

function ziurtatuOnlineKontagailua() {
  if (egoera.pantaila !== "online-jokoa" || !onlinePartidaJolastenDago()) {
    garbituOnlineKontagailua();
    return;
  }

  eguneratuOnlineKontagailua();

  if (onlineKontagailuaId) {
    return;
  }

  onlineKontagailuaId = window.setInterval(() => {
    eguneratuOnlineKontagailua();
  }, 250);
}

function normalizatuErantzuna(testua) {
  return testua
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lortuUnekoJokalaria() {
  return egoera.jokalariak[egoera.unekoJokalaria];
}

function lortuGalderak(jokalaria = lortuUnekoJokalaria()) {
  return jokalaria?.galderak ?? [];
}

function sortuJokalaria(izena, rosco, galderak) {
  return {
    izena,
    rosco,
    galderak,
    denbora: HASIERAKO_DENBORA,
    asmatuak: 0,
    hutsak: 0,
    egoerak: new Array(galderak.length).fill("pending"),
    unekoIndizea: 0,
    amaituta: false,
    denboraAgortuta: false,
  };
}

function kalkulatuPendienteak(jokalaria) {
  return jokalaria.egoerak.filter((egoeraLetra) => egoeraLetra === "pending").length;
}

function lortuBesteJokalaria(indizea) {
  return egoera.jokalariak.findIndex((_jokalaria, unekoIndizea) => unekoIndizea !== indizea);
}

function jokalariaPrestDago(indizea) {
  if (typeof indizea !== "number" || indizea < 0) {
    return false;
  }

  const jokalaria = egoera.jokalariak[indizea];

  return Boolean(
    jokalaria && jokalaria.denbora > 0 && kalkulatuPendienteak(jokalaria) > 0,
  );
}

function bilatuPendientea(jokalaria, hasiera, unekoaBarne = false) {
  const luzeera = jokalaria.egoerak.length;
  const lehenPausoa = unekoaBarne ? 0 : 1;

  for (let pausoa = lehenPausoa; pausoa <= luzeera; pausoa += 1) {
    const indizea = (hasiera + pausoa) % luzeera;
    if (jokalaria.egoerak[indizea] === "pending") {
      return indizea;
    }
  }

  return -1;
}

function ziurtatuUnekoPendientea(jokalaria) {
  if (jokalaria.egoerak[jokalaria.unekoIndizea] === "pending") {
    return jokalaria.unekoIndizea;
  }

  const aurkitua = bilatuPendientea(jokalaria, jokalaria.unekoIndizea, true);

  if (aurkitua !== -1) {
    jokalaria.unekoIndizea = aurkitua;
  }

  return aurkitua;
}

function biJokalariakDenboraBarikDaude() {
  return egoera.jokalariak.every((jokalaria) => jokalaria.denbora <= 0);
}

function garbituErlojua() {
  if (egoera.erlojuaId) {
    window.clearInterval(egoera.erlojuaId);
    egoera.erlojuaId = null;
  }
}

function erakutsiPantaila(izena) {
  const aurrekoa = egoera.pantaila;
  egoera.pantaila = izena;

  if (izena === "hasiera" && aurrekoa !== "hasiera") {
    egoera.online.onlinePanelExpanded = false;
    egoera.online.onlinePanelTouched = false;
  }

  dom.hasieraPantaila.classList.toggle("pantaila--aktibo", izena === "hasiera");
  dom.jokoPantaila.classList.toggle("pantaila--aktibo", izena === "jokoa");
  dom.aldaketaPantaila.classList.toggle("pantaila--aktibo", izena === "aldaketa");
  dom.amaieraPantaila.classList.toggle("pantaila--aktibo", izena === "amaiera");
  dom.onlineLobbyPantaila.classList.toggle("pantaila--aktibo", izena === "online-lobby");
  dom.onlinePrestPantaila.classList.toggle("pantaila--aktibo", izena === "online-prest");
  dom.onlineJokoPantaila.classList.toggle("pantaila--aktibo", izena === "online-jokoa");
  dom.onlineAmaieraPantaila.classList.toggle("pantaila--aktibo", izena === "online-amaiera");

  const onlinePantailaAktiboa =
    izena === "online-lobby" ||
    izena === "online-prest" ||
    izena === "online-jokoa";
  const aurrekoaOnline =
    aurrekoa === "online-lobby" ||
    aurrekoa === "online-prest" ||
    aurrekoa === "online-jokoa";

  if (onlinePantailaAktiboa) {
    void ziurtatuOnlineRealtimeHarpidetza();
  } else if (aurrekoaOnline) {
    void garbituOnlineRealtimeHarpidetza();
  }

  if (izena !== "online-jokoa") {
    garbituOnlineKontagailua();
    garbituOnlineJokoEguneratzeProgramazioa();
  }
}

function ezarriFeedback(mezua, mota = "oharra") {
  egoera.feedback = mezua;
  egoera.feedbackMota = mota;
  dom.feedbackMezua.textContent = mezua;
  dom.feedbackMezua.className = `feedbacka feedbacka--${mota}`;
}

function hasieratuHitza(testua) {
  return testua ? testua.charAt(0).toUpperCase() + testua.slice(1) : "";
}

function itzuliGaiarenIzenOsoa(gaia) {
  const balioa = `${gaia ?? ""}`.trim();

  if (!balioa) {
    return "";
  }

  return balioa
    .replaceAll("_eta_", " eta ")
    .replaceAll("_", " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((hitza) => (hitza === "eta" ? hitza : hasieratuHitza(hitza)))
    .join(" ");
}

function itzuliGaiarenTxipEtiketa(gaia) {
  return GAIEN_TXIP_ETIKETAK[gaia] ?? itzuliGaiarenIzenOsoa(gaia);
}

function sortuGaiaTxipaEtiketa(gaia) {
  return {
    txipa: itzuliGaiarenTxipEtiketa(gaia),
    osoa: itzuliGaiarenIzenOsoa(gaia),
  };
}

function ordenatuGaiak(gaiak) {
  return [...new Set(gaiak.filter(Boolean))].sort((bat, bi) =>
    itzuliGaiarenTxipEtiketa(bat).localeCompare(itzuliGaiarenTxipEtiketa(bi), "eu", {
      sensitivity: "base",
    }),
  );
}

function ezarriSelectAukerak(selecta, aukerak, placeholder, formatua = (aukera) => aukera) {
  selecta.innerHTML = "";

  const lehenAukera = document.createElement("option");
  lehenAukera.value = "";
  lehenAukera.textContent = placeholder;
  selecta.appendChild(lehenAukera);

  aukerak.forEach((aukera) => {
    const aukeraElementua = document.createElement("option");
    aukeraElementua.value = aukera;
    aukeraElementua.textContent = formatua(aukera);
    selecta.appendChild(aukeraElementua);
  });
}

function renderGaiaTxipak() {
  if (!dom.gaiaTxipak) {
    return;
  }

  dom.gaiaTxipak.innerHTML = "";
  dom.gaiaTxipak.setAttribute("aria-busy", `${egoera.kargatzen.topics}`);

  if (egoera.kargatzen.topics) {
    const kargatzen = document.createElement("span");
    kargatzen.className = "gaia-txipa gaia-txipa--pasiboa";
    kargatzen.textContent = "Gaiak kargatzen...";
    dom.gaiaTxipak.appendChild(kargatzen);
    return;
  }

  if (egoera.aukerak.topics.length === 0) {
    const hutsik = document.createElement("span");
    hutsik.className = "gaia-txipa gaia-txipa--pasiboa";
    hutsik.textContent = "Ez dago gairik";
    dom.gaiaTxipak.appendChild(hutsik);
    return;
  }

  egoera.aukerak.topics.forEach((gaia) => {
    const { txipa, osoa } = sortuGaiaTxipaEtiketa(gaia);
    const botoia = document.createElement("button");
    const aktibo = egoera.konfigurazioa.topic === gaia;
    botoia.type = "button";
    botoia.className = aktibo ? "gaia-txipa gaia-txipa--aktiboa" : "gaia-txipa";
    botoia.dataset.topic = gaia;
    botoia.textContent = txipa;
    botoia.title = osoa || txipa;
    botoia.setAttribute("aria-pressed", `${aktibo}`);
    dom.gaiaTxipak.appendChild(botoia);
  });
}

function aukeratuGaia(gaia) {
  const hurrengoGaia = `${gaia ?? ""}`;

  if (hurrengoGaia === egoera.konfigurazioa.topic) {
    renderStartScreen();
    return;
  }

  egoera.konfigurazioa.topic = hurrengoGaia;
  egoera.konfigurazioa.level = "";
  egoera.aukerak.levels = [];
  egoera.aukerak.roscos = [];
  ezarriOnlineErrorea("create", "");
  ezarriHasieraMezua("", "oharra");

  if (!egoera.konfigurazioa.topic) {
    renderStartScreen();
    return;
  }

  void kargatuMailak(egoera.konfigurazioa.topic);
}

function renderStartScreen() {
  erakutsiPantaila("hasiera");

  if (!egoera.online.onlinePanelTouched) {
    egoera.online.onlinePanelExpanded = false;
  }

  ezarriSelectAukerak(
    dom.gaiaSelect,
    egoera.aukerak.topics,
    egoera.kargatzen.topics ? "Kargatzen..." : "Aukeratu gaia",
    itzuliGaiarenIzenOsoa,
  );
  dom.gaiaSelect.value = egoera.konfigurazioa.topic;
  dom.gaiaSelect.disabled = egoera.kargatzen.topics || egoera.aukerak.topics.length === 0;
  renderGaiaTxipak();

  ezarriSelectAukerak(
    dom.mailaSelect,
    egoera.aukerak.levels,
    egoera.kargatzen.levels
      ? "Kargatzen..."
      : egoera.konfigurazioa.topic
        ? "Aukeratu maila"
        : "Aukeratu gaia",
  );
  dom.mailaSelect.value = egoera.konfigurazioa.level;
  dom.mailaSelect.disabled = true;
  dom.mailaEremua.hidden = true;
  const moduaAukeratuta = jokoModuaAukeratutaDago();
  dom.jokoModuaBakarka.checked = egoera.jokoModua === JOKO_MODUA_BAKARKA;
  dom.jokoModuaBinaka.checked = egoera.jokoModua === JOKO_MODUA_BINAKA;
  if (dom.jokoLokalaAzalpena) {
    dom.jokoLokalaAzalpena.textContent = !moduaAukeratuta
      ? "Aukeratu bakarka ala binaka jolastu nahi duzun."
      : bakarkakoJokoaDa()
        ? "Zure izena idatzi eta bakarrik jokatu."
        : "Bi jokalarien izenak idatzi eta gailu berean jokatu.";
  }
  dom.jokalari1Label.textContent = bakarkakoJokoaDa() ? "Jokalaria" : "1. jokalaria";
  dom.jokalari1Izena.placeholder = bakarkakoJokoaDa() ? "Jokalaria" : "1. jokalaria";
  dom.jokalari1Eremua.hidden = !moduaAukeratuta;
  dom.jokalari2Eremua.hidden = !moduaAukeratuta || bakarkakoJokoaDa();
  dom.jokalari1Izena.disabled = !moduaAukeratuta;
  dom.jokalari2Izena.disabled = !moduaAukeratuta || bakarkakoJokoaDa();
  dom.onlineJoinEdukia.hidden = !egoera.online.onlinePanelExpanded;
  dom.onlineJoinFormulario.classList.toggle(
    "online-sartu-panela--zabalik",
    egoera.online.onlinePanelExpanded,
  );
  dom.onlineTolesBotoia.setAttribute(
    "aria-expanded",
    `${egoera.online.onlinePanelExpanded}`,
  );
  dom.onlineTolesAzalpena.textContent = egoera.online.onlinePanelExpanded
    ? "Itxi online jolasteko aukerak"
    : "Zabaldu online jolasteko aukerak";

  dom.hasieraMezua.textContent = egoera.hasieraMezua;
  dom.hasieraMezua.className = `hasiera-mezua hasiera-mezua--${egoera.hasieraMezuMota}`;
  const onlineSaioMezua = egoera.online.errorAuth
    ? egoera.online.errorAuth
    : onlineSaioaPrestDago()
      ? "Online saioa prest"
      : "Online saioa behar da";
  dom.onlineSaioEgoera.textContent = onlineSaioMezua;
  dom.onlineSaioEgoera.className = `hasiera-mezua hasiera-mezua--${
    egoera.online.errorAuth ? "okerra" : "oharra"
  }`;
  dom.onlineSaioBotoia.disabled =
    onlineKargatzenDa() || !supabaseKonfiguratutaDago() || onlineSaioaPrestDago();
  dom.onlineSaioBotoia.textContent = onlineSaioaKargatzenDa()
    ? "Kargatzen..."
    : onlineSaioaPrestDago()
      ? "Online prest"
      : "Online saioa hasi";
  dom.onlineSaioaItxiBotoia.disabled =
    onlineKargatzenDa() || !supabaseKonfiguratutaDago() || !onlineSaioaPrestDago();

  dom.onlineJoinMezua.textContent = egoera.online.errorJoin;
  dom.onlineJoinMezua.className = `hasiera-mezua hasiera-mezua--${
    egoera.online.errorJoin ? "okerra" : "oharra"
  }`;
  dom.onlineRoomCodeInput.value = egoera.online.enteredRoomCode;
  dom.onlineRoomCodeInput.disabled = onlineKargatzenDa() || !supabaseKonfiguratutaDago();
  dom.hasiJokoaBotoia.disabled =
    !jokoModuaAukeratutaDago() ||
    !konfigurazioaOsatuta() ||
    hautapenakKargatzenDira() ||
    onlineKargatzenDa() ||
    egoera.aukerak.roscos.length < beharrezkoRoskoKopurua();
  dom.hasiJokoaBotoia.textContent = egoera.kargatzen.questions ? "Kargatzen..." : "Hasi jokoa";
  dom.onlineSortuBotoia.disabled =
    !konfigurazioaOsatuta() ||
    hautapenakKargatzenDira() ||
    onlineKargatzenDa() ||
    !supabaseKonfiguratutaDago();
  dom.onlineSortuBotoia.textContent = onlineSortzekoKargatzenDa()
    ? "Kargatzen..."
    : "Online partida sortu";
  dom.onlineSartuBotoia.disabled =
    !normalizatuRoomCode(egoera.online.enteredRoomCode) ||
    onlineKargatzenDa() ||
    !supabaseKonfiguratutaDago();
  dom.onlineSartuBotoia.textContent = onlineSartzekoKargatzenDa()
    ? "Kargatzen..."
    : "Partidan sartu";
}

async function kargatuGaiak() {
  if (!supabaseKonfiguratutaDago()) {
    egoera.aukerak.topics = [];
    ezarriHasieraMezua("Supabase konfiguratu gabe dago", "okerra");
    renderStartScreen();
    return;
  }

  egoera.kargatzen.topics = true;
  egoera.aukerak.topics = [];
  egoera.konfigurazioa.topic = "";
  egoera.konfigurazioa.level = "";
  egoera.aukerak.levels = [];
  egoera.aukerak.roscos = [];
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    const datuak = await eginSupabaseEskaera("topic", { active: true }, "topic");
    const gaiArruntak = aukerakBakarrik(datuak, "topic");
    egoera.aukerak.topics =
      gaiArruntak.length > 0 ? ordenatuGaiak([...gaiArruntak, GAIA_NAHASKETA]) : [];

    if (egoera.aukerak.topics.length === 0) {
      ezarriHasieraMezua("Ez dago daturik", "okerra");
    } else {
      ezarriHasieraMezua("", "oharra");
    }
  } catch (_errorea) {
    egoera.aukerak.topics = [];
    ezarriHasieraMezua("Ezin izan dira datuak kargatu", "okerra");
  } finally {
    egoera.kargatzen.topics = false;
    renderStartScreen();
  }
}

async function kargatuMailak(topic) {
  egoera.kargatzen.levels = true;
  egoera.aukerak.levels = [];
  egoera.aukerak.roscos = [];
  egoera.konfigurazioa.level = "";
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    const datuak = gaiaNahasketaDa(topic)
      ? await eginSupabaseEskaera("level", { active: true }, "level")
      : await eginSupabaseEskaera("level", { active: true, topic }, "level");

    if (egoera.konfigurazioa.topic !== topic) {
      return;
    }

    egoera.aukerak.levels = aukerakBakarrik(datuak, "level");

    if (egoera.aukerak.levels.length === 0) {
      ezarriHasieraMezua("Ez dago daturik", "okerra");
      return;
    }

    [egoera.konfigurazioa.level] = egoera.aukerak.levels;
    ezarriHasieraMezua("", "oharra");
    await kargatuRoskak(topic, egoera.konfigurazioa.level);
  } catch (_errorea) {
    egoera.aukerak.levels = [];
    ezarriHasieraMezua("Ezin izan dira mailak kargatu", "okerra");
  } finally {
    egoera.kargatzen.levels = false;
    renderStartScreen();
  }
}

async function kargatuRoskak(topic, level) {
  egoera.kargatzen.roscos = true;
  egoera.aukerak.roscos = [];
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    if (gaiaNahasketaDa(topic)) {
      const galderaGuztiak = await kargatuNahasketaIturriak(level);

      if (egoera.konfigurazioa.topic !== topic || egoera.konfigurazioa.level !== level) {
        return;
      }

      const letrakDaude = new Set(galderaGuztiak.map((g) => g.letter)).size >= 25;
      egoera.aukerak.roscos = letrakDaude ? [GAIA_NAHASKETA] : [];
    } else {
      const datuak = await eginSupabaseEskaera(
        "rosco",
        { active: true, topic, level },
        "rosco",
      );

      if (egoera.konfigurazioa.topic !== topic || egoera.konfigurazioa.level !== level) {
        return;
      }

      egoera.aukerak.roscos = aukerakBakarrik(datuak, "rosco");
    }

    if (!jokoModuaAukeratutaDago()) {
      ezarriHasieraMezua(
        egoera.aukerak.roscos.length === 0 ? "Ez dago erroska erabilgarririk" : "",
        egoera.aukerak.roscos.length === 0 ? "okerra" : "oharra",
      );
    } else if (egoera.aukerak.roscos.length < beharrezkoRoskoKopurua()) {
      ezarriHasieraMezua(itzuliRoskoEskakizunMezua(), "okerra");
    } else {
      ezarriHasieraMezua("", "oharra");
    }
  } catch (_errorea) {
    egoera.aukerak.roscos = [];
    ezarriHasieraMezua("Ezin izan dira erroskak kargatu", "okerra");
  } finally {
    egoera.kargatzen.roscos = false;
    renderStartScreen();
  }
}

function esleituJokalarienRoskak(roskoak) {
  const bakarrak = [...new Set(roskoak)];

  if (bakarrak.length < 2) {
    throw new Error("rosko-gutxiegi");
  }

  return [bakarrak[0], bakarrak[1]];
}

function esleituBakarkakoRoskoa(roskoak) {
  const bakarrak = [...new Set(roskoak)];

  if (bakarrak.length < 1) {
    throw new Error("rosko-gutxiegi");
  }

  const ausazkoIndizea = Math.floor(Math.random() * bakarrak.length);
  return bakarrak[ausazkoIndizea] ?? bakarrak[0];
}

async function kargatuRoskoarenGalderak(topic, level, rosco) {
  const datuak = await eginSupabaseEskaera(
    "*",
    {
      topic,
      level,
      rosco,
      active: true,
    },
    "slot_order",
  );

  if (
    datuak.some(
      (lerroa) =>
        `${lerroa.topic ?? ""}`.trim() !== topic ||
        `${lerroa.level ?? ""}`.trim() !== level ||
        `${lerroa.rosco ?? ""}`.trim() !== rosco,
    )
  ) {
    throw new Error("rosko-desegokia");
  }

  const galderak = datuak.map(normalizatuGalderaLerroa);
  egiaztatuGalderak(galderak);
  return galderak;
}

async function kargatuBiJokalarienGalderak() {
  const { topic, level } = egoera.konfigurazioa;

  if (gaiaNahasketaDa(topic)) {
    const galderaGuztiak = await kargatuNahasketaIturriak(level);
    const letrakDaude = new Set(galderaGuztiak.map((g) => g.letter)).size >= 25;

    if (!letrakDaude) {
      throw new Error("rosko-gutxiegi");
    }

    const nahasketa1 = sortuNahastutakoGalderak(galderaGuztiak, level);
    const nahasketa2 = sortuNahastutakoGalderak(galderaGuztiak, level);

    return {
      rosco1: nahasketa1.rosco,
      rosco2: nahasketa2.rosco,
      galderak1: nahasketa1.galderak,
      galderak2: nahasketa2.galderak,
    };
  }

  const [rosco1, rosco2] = esleituJokalarienRoskak(egoera.aukerak.roscos);

  if (rosco1 === rosco2) {
    throw new Error("rosko-berdina");
  }

  const [galderak1, galderak2] = await Promise.all([
    kargatuRoskoarenGalderak(topic, level, rosco1),
    kargatuRoskoarenGalderak(topic, level, rosco2),
  ]);

  return {
    rosco1,
    rosco2,
    galderak1,
    galderak2,
  };
}

async function kargatuBakarkakoGalderak() {
  const { topic, level } = egoera.konfigurazioa;

  if (gaiaNahasketaDa(topic)) {
    const galderaGuztiak = await kargatuNahasketaIturriak(level);
    const letrakDaude = new Set(galderaGuztiak.map((g) => g.letter)).size >= 25;

    if (!letrakDaude) {
      throw new Error("rosko-gutxiegi");
    }

    return sortuNahastutakoGalderak(galderaGuztiak, level);
  }

  const rosco = esleituBakarkakoRoskoa(egoera.aukerak.roscos);
  const galderak = await kargatuRoskoarenGalderak(topic, level, rosco);

  return {
    rosco,
    galderak,
  };
}

async function irakurriInvokeErrorea(errorea) {
  if (errorea && typeof errorea === "object" && "context" in errorea && errorea.context) {
    try {
      const edukia = await errorea.context.json();
      return edukia?.error || edukia?.message || "";
    } catch (_errorea) {
      return "";
    }
  }

  return "";
}

function eguneratuOnlineSaioLokala(session) {
  egoera.online.authReady = Boolean(session?.user?.id);
  egoera.online.authUserId = `${session?.user?.id ?? ""}`.trim();

  if (egoera.online.authReady) {
    egoera.online.errorAuth = "";
  }
}

async function kargatuOnlineSaioEgoera(isilpean = false) {
  if (!supabaseKonfiguratutaDago() || !supabase) {
    eguneratuOnlineSaioLokala(null);
    if (!isilpean) {
      egoera.online.errorAuth = "Supabase konfiguratu gabe dago";
      renderStartScreen();
    }
    return null;
  }

  if (!isilpean) {
    egoera.online.loadingAuth = true;
    renderStartScreen();
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    eguneratuOnlineSaioLokala(session);
    if (!session) {
      egoera.online.errorAuth = "";
    }

    if (!isilpean && egoera.pantaila === "hasiera") {
      renderStartScreen();
    }

    return session;
  } catch (_errorea) {
    eguneratuOnlineSaioLokala(null);
    if (!isilpean) {
      egoera.online.errorAuth = "Ezin izan da online saioa egiaztatu";
      renderStartScreen();
    }
    return null;
  } finally {
    egoera.online.loadingAuth = false;
    if (!isilpean && egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  }
}

async function handleAnonymousLogin() {
  if (!supabaseKonfiguratutaDago() || !supabase) {
    egoera.online.errorAuth = "Supabase konfiguratu gabe dago";
    renderStartScreen();
    return false;
  }

  if (onlineSaioaPrestDago()) {
    renderStartScreen();
    return true;
  }

  egoera.online.loadingAuth = true;
  egoera.online.errorAuth = "";
  renderStartScreen();

  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error || !data?.session) {
      throw error ?? new Error("Saioa ezin izan da hasi");
    }

    eguneratuOnlineSaioLokala(data.session);
    egoera.online.errorAuth = "";
    renderStartScreen();
    return true;
  } catch (errorea) {
    eguneratuOnlineSaioLokala(null);
    egoera.online.errorAuth =
      errorea instanceof Error && errorea.message
        ? itzuliOnlineAuthErrorea(errorea.message)
        : "Ezin izan da online saioa hasi";
    renderStartScreen();
    return false;
  } finally {
    egoera.online.loadingAuth = false;
    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  }
}

async function handleOnlineLogout() {
  if (!supabaseKonfiguratutaDago() || !supabase) {
    return;
  }

  egoera.online.loadingAuth = true;
  egoera.online.errorAuth = "";
  renderStartScreen();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    eguneratuOnlineSaioLokala(null);
    restartGame();
  } catch (_errorea) {
    egoera.online.errorAuth = "Ezin izan da saioa itxi";
    renderStartScreen();
  } finally {
    egoera.online.loadingAuth = false;
    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  }
}

async function ziurtatuOnlineSaioa(anonimoaBaimendu = false) {
  if (!supabaseKonfiguratutaDago() || !supabase) {
    throw new Error("Supabase konfiguratu gabe dago");
  }

  const session = await kargatuOnlineSaioEgoera(true);

  if (session?.user?.id) {
    return session;
  }

  if (anonimoaBaimendu) {
    const ondo = await handleAnonymousLogin();
    if (ondo) {
      const saioBerria = await kargatuOnlineSaioEgoera(true);
      if (saioBerria?.user?.id) {
        return saioBerria;
      }
    }
  }

  throw new Error("Saioa hasi behar duzu online partidarako");
}

async function deituOnlineFuntzioa(
  izena,
  body,
  mota,
  aukerak = { eskatzenDuPartida: true, eskatzenDuJokalaria: true },
) {
  const session = await ziurtatuOnlineSaioa(false);

  const { data, error } = await supabase.functions.invoke(izena, {
    body,
    headers: session?.access_token
      ? {
          Authorization: `Bearer ${session.access_token}`,
        }
      : undefined,
  });

  if (error) {
    const xehetasuna = await irakurriInvokeErrorea(error);
    throw new Error(itzuliOnlineErrorea(mota, xehetasuna));
  }

  if (
    !data?.success ||
    (aukerak.eskatzenDuPartida && !data?.match) ||
    (aukerak.eskatzenDuJokalaria && !data?.player)
  ) {
    throw new Error(itzuliOnlineErrorea(mota, data?.error || data?.message || ""));
  }

  return data;
}

async function kargatuOnlineLobbyEgoera(isilpean = false) {
  if (!onlineLobbyPrestDago() || !supabase) {
    return false;
  }

  if (!isilpean) {
    egoera.online.loadingLobby = true;
    egoera.online.errorLobby = "";
    renderOnlinePantailaAktiboa();
  }

  try {
    await ziurtatuOnlineSaioa();

    const matchId = egoera.online.onlineMatch.id;
    const [matchErantzuna, playersErantzuna, gertaerakErantzuna] = await Promise.all([
      supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single(),
      supabase
        .from("match_players")
        .select(
          "player_id, seat, is_ready, is_connected, rosco, topic, level, time_remaining_ms, hits, errors, unanswered, letters_state",
        )
        .eq("match_id", matchId)
        .order("seat", { ascending: true }),
      supabase
        .from("match_events")
        .select("id, seat, event_type, payload, created_at")
        .eq("match_id", matchId)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    if (matchErantzuna.error || !matchErantzuna.data) {
      throw new Error("Ezin izan da lobbya eguneratu");
    }

    if (playersErantzuna.error) {
      throw new Error("Ezin izan da jokalarien egoera kargatu");
    }

    if (!gertaerakErantzuna.error) {
      egoera.online.onlineLatestEvent = (gertaerakErantzuna.data ?? [])[0] ?? null;
    }

    egoera.online.onlineMatch = {
      ...(egoera.online.onlineMatch ?? {}),
      ...matchErantzuna.data,
    };
    egoera.online.onlineGameState =
      matchErantzuna.data?.game_state ?? egoera.online.onlineGameState;
    egoera.online.onlinePlayersState = sortuLobbyJokalariak(playersErantzuna.data ?? []);

    const unekoa =
      (playersErantzuna.data ?? []).find(
        (jokalaria) => jokalaria.player_id === egoera.online.onlinePlayer?.player_id,
      ) ??
      (playersErantzuna.data ?? []).find(
        (jokalaria) => jokalaria.seat === egoera.online.onlinePlayer?.seat,
      );

    if (unekoa) {
      egoera.online.onlinePlayer = {
        ...(egoera.online.onlinePlayer ?? {}),
        ...unekoa,
      };
    }

    sinkronizatuUnekoOnlineJokalaria();
    eguneratuLobbyPrestEgoera();
    eguneratuOnlineAmaieraEgoera();
    egoera.online.onlineTimerDisplay = formateatuOnlineDenbora(
      kalkulatuOnlineDenboraBisualaMs(),
    );
    egoera.online.errorLobby = "";
    egoera.online.lobbyMessage = itzuliLobbyOharra();
    programatuOnlineTrantsizioa();

    if (egoera.online.onlineMatch?.status === "playing") {
      onlineStartEskatutakoMatchId = matchId;
      egoera.online.errorStartMatch = "";
    }

    if (onlinePartidaAmaitutaDago()) {
      garbituOnlineKontagailua();
      void garbituOnlineRealtimeHarpidetza();
    }

    gordeEgoera();
    renderOnlinePantailaAktiboa();

    if (onlinePartidaJolastenDago()) {
      void kargatuOnlineJokoDatuak();
    }

    return true;
  } catch (errorea) {
    egoera.online.errorLobby =
      errorea instanceof Error && errorea.message
        ? errorea.message
        : "Ezin izan da lobbya eguneratu";
    renderOnlinePantailaAktiboa();

    return false;
  } finally {
    egoera.online.loadingLobby = false;

    if (!isilpean) {
      renderOnlinePantailaAktiboa();
    }
  }
}

function renderOnlinePantailaAktiboa() {
  if (onlinePartidaAmaitutaDago()) {
    renderOnlineAmaieraScreen();
    return;
  }

  if (onlinePartidaJolastenDago()) {
    renderOnlineGameScreen();
    return;
  }

  if (egoera.pantaila === "online-prest") {
    renderOnlinePrestScreen();
    return;
  }

  if (egoera.pantaila === "online-jokoa") {
    renderOnlineGameScreen();
    return;
  }

  if (egoera.pantaila === "online-amaiera") {
    if (onlinePartidaAmaitutaDago()) {
      renderOnlineAmaieraScreen();
    } else if (onlinePartidaJolastenDago()) {
      renderOnlineGameScreen();
    } else {
      renderOnlineLobby();
    }
    return;
  }

  if (egoera.pantaila === "online-lobby") {
    renderOnlineLobby();
  }
}

function renderOnlineLobby() {
  garbituOnlinePrestEguneratzeProgramazioa();

  if (!onlineLobbyPrestDago()) {
    restartGame();
    return;
  }

  if (onlinePartidaAmaitutaDago()) {
    renderOnlineAmaieraScreen();
    return;
  }

  const partida = egoera.online.onlineMatch;
  const jokalaria = egoera.online.onlinePlayer;
  const jokalaria1 = lortuOnlineLobbyJokalaria(1);
  const jokalaria2 = lortuOnlineLobbyJokalaria(2);
  const lehenJokalariaDa = jokalaria?.seat === 1;
  const biakPrest = egoera.online.onlineReadyToStart;
  const izenburua = biakPrest
    ? "Partida hasteko prest"
    : lehenJokalariaDa
      ? "Partida sortu da"
      : "Partidan sartu zara";
  const azalpena = biakPrest
    ? "Bi jokalariak prest daude. Online partidaren hurrengo fasera igarotzeko prest."
    : lehenJokalariaDa
      ? "Partekatu kode hau bigarren jokalariarekin eta prest zaudenean markatu."
      : "Lehen jokalariarekin elkartu zara. Prest zaudenean markatu.";
  const oharra = egoera.online.lobbyMessage || itzuliLobbyOharra();
  const nirePrest = unekoOnlineJokalariaPrestDago();
  const feedbacka = itzuliOnlineLobbyFeedbacka();

  erakutsiPantaila("online-lobby");
  eguneratuTxandaKoloreak();
  dom.onlineLobbyIzenburua.textContent = izenburua;
  dom.onlineLobbyAzalpena.textContent = azalpena;
  dom.onlineRoomCode.textContent = partida.room_code || "-";
  dom.onlineTopic.textContent = partida.topic ? itzuliGaiarenIzenOsoa(partida.topic) : "-";
  dom.onlineLevel.textContent = partida.level || "-";
  dom.onlineStatus.textContent = biakPrest
    ? "Partida hasteko prest"
    : itzuliLobbyEgoera(partida.status);
  dom.onlineSeat.textContent = `${jokalaria?.seat ?? 1}. jokalaria`;
  dom.onlineLobbyMessage.textContent = oharra;
  dom.onlineJokalariEgoera1.textContent = itzuliLobbyJokalariEgoera(jokalaria1);
  dom.onlineJokalariEgoera2.textContent = itzuliLobbyJokalariEgoera(jokalaria2);
  dom.onlineJokalariTxartela1.className = "online-jokalari-txartela";
  dom.onlineJokalariTxartela2.className = "online-jokalari-txartela";

  [jokalaria1, jokalaria2].forEach((onlineJokalaria, indizea) => {
    const txartela =
      indizea === 0 ? dom.onlineJokalariTxartela1 : dom.onlineJokalariTxartela2;

    if (!onlineJokalaria?.present) {
      txartela.classList.add("online-jokalari-txartela--zain");
      return;
    }

    if (onlineJokalaria.is_ready) {
      txartela.classList.add("online-jokalari-txartela--prest");
    } else {
      txartela.classList.add("online-jokalari-txartela--ez-prest");
    }

    if (onlineJokalaria.seat === jokalaria?.seat) {
      txartela.classList.add("online-jokalari-txartela--uneko");
    }
  });

  dom.onlineLobbyFeedback.textContent = feedbacka.mezua;
  dom.onlineLobbyFeedback.className = `hasiera-mezua hasiera-mezua--${
    feedbacka.mota
  }`;
  dom.onlinePrestBotoia.disabled =
    onlinePrestatzekoKargatzenDa() ||
    onlineHastekoKargatzenDa() ||
    onlineLobbyKargatzenDa() ||
    nirePrest ||
    !onlineLobbyPrestDago();
  dom.onlinePrestBotoia.textContent = onlinePrestatzekoKargatzenDa()
    ? "Kargatzen..."
    : nirePrest
      ? "Prest zaude"
      : "Prest nago";
  dom.onlineEguneratuBotoia.disabled =
    onlinePrestatzekoKargatzenDa() ||
    onlineHastekoKargatzenDa() ||
    onlineLobbyKargatzenDa() ||
    !onlineLobbyPrestDago();
  dom.onlineEguneratuBotoia.textContent = onlineLobbyKargatzenDa()
    ? "Kargatzen..."
    : "Egoera eguneratu";

  programatuOnlineTrantsizioa();

  if (biakPrest) {
    ziurtatuOnlinePartidarenHasiera();
  }
}

function renderOnlinePrestScreen() {
  if (!onlineLobbyPrestDago()) {
    restartGame();
    return;
  }

  if (onlinePartidaAmaitutaDago()) {
    renderOnlineAmaieraScreen();
    return;
  }

  if (!egoera.online.onlineReadyToStart) {
    renderOnlineLobby();
    return;
  }

  if (onlinePartidaJolastenDago()) {
    renderOnlineGameScreen();
    return;
  }

  const partida = egoera.online.onlineMatch;
  const jokalaria = egoera.online.onlinePlayer;
  const jokalaria1 = lortuOnlineLobbyJokalaria(1);
  const jokalaria2 = lortuOnlineLobbyJokalaria(2);
  const feedbacka = itzuliOnlineLobbyFeedbacka();

  erakutsiPantaila("online-prest");
  eguneratuTxandaKoloreak();
  dom.onlinePrestIzenburua.textContent = "Partida hasteko prest";
  dom.onlinePrestAzalpena.textContent =
    "Bi jokalariak prest daude. Hurrengo online fasea prestatzen ari da.";
  dom.onlinePrestRoomCode.textContent = partida.room_code || "-";
  dom.onlinePrestTopic.textContent = partida.topic
    ? itzuliGaiarenIzenOsoa(partida.topic)
    : "-";
  dom.onlinePrestLevel.textContent = partida.level || "-";
  dom.onlinePrestStatus.textContent = "Partida hasteko prest";
  dom.onlinePrestJokalari1.textContent = itzuliLobbyJokalariEgoera(jokalaria1);
  dom.onlinePrestJokalari2.textContent = itzuliLobbyJokalariEgoera(jokalaria2);
  dom.onlinePrestTxartela1.className = "online-jokalari-txartela online-jokalari-txartela--prest";
  dom.onlinePrestTxartela2.className = "online-jokalari-txartela online-jokalari-txartela--prest";

  if (jokalaria?.seat === 1) {
    dom.onlinePrestTxartela1.classList.add("online-jokalari-txartela--uneko");
  } else if (jokalaria?.seat === 2) {
    dom.onlinePrestTxartela2.classList.add("online-jokalari-txartela--uneko");
  }

  dom.onlinePrestFeedback.textContent = feedbacka.mezua || "Partida hasteko prest";
  dom.onlinePrestFeedback.className = `hasiera-mezua hasiera-mezua--${feedbacka.mota}`;

  ziurtatuOnlinePrestEguneratzea();
  ziurtatuOnlinePartidarenHasiera();
}

function ziurtatuOnlinePrestEguneratzea() {
  if (
    egoera.pantaila !== "online-prest" ||
    !onlineLobbyPrestDago() ||
    !egoera.online.onlineReadyToStart ||
    onlinePartidaJolastenDago() ||
    onlinePartidaAmaitutaDago()
  ) {
    garbituOnlinePrestEguneratzeProgramazioa();
    return;
  }

  if (onlinePrestEguneratzeTimeoutId || onlineLobbyKargatzenDa()) {
    return;
  }

  onlinePrestEguneratzeTimeoutId = window.setTimeout(() => {
    onlinePrestEguneratzeTimeoutId = null;

    if (
      egoera.pantaila !== "online-prest" ||
      !onlineLobbyPrestDago() ||
      !egoera.online.onlineReadyToStart ||
      onlinePartidaJolastenDago() ||
      onlinePartidaAmaitutaDago()
    ) {
      return;
    }

    void kargatuOnlineLobbyEgoera(true);
  }, 1200);
}

function ziurtatuOnlineJokoEguneratzea() {
  if (
    egoera.pantaila !== "online-jokoa" ||
    !onlineLobbyPrestDago() ||
    !onlinePartidaJolastenDago() ||
    onlinePartidaAmaitutaDago()
  ) {
    garbituOnlineJokoEguneratzeProgramazioa();
    return;
  }

  if (
    onlineJokoEguneratzeTimeoutId ||
    onlineLobbyKargatzenDa() ||
    onlineHastekoKargatzenDa() ||
    onlineErantzunaBidaltzenDa() ||
    onlinePasapalabraBidaltzenDa() ||
    onlineTimeoutKargatzenDa()
  ) {
    return;
  }

  onlineJokoEguneratzeTimeoutId = window.setTimeout(() => {
    onlineJokoEguneratzeTimeoutId = null;

    if (
      egoera.pantaila !== "online-jokoa" ||
      !onlineLobbyPrestDago() ||
      !onlinePartidaJolastenDago() ||
      onlinePartidaAmaitutaDago()
    ) {
      return;
    }

    void kargatuOnlineLobbyEgoera(true);
  }, 900);
}

async function handleStartMatch() {
  if (!onlineLobbyPrestDago()) {
    return false;
  }

  if (onlinePartidaJolastenDago()) {
    void kargatuOnlineJokoDatuak();
    return true;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
  const roomCode = `${egoera.online.onlineMatch?.room_code ?? ""}`.trim();

  if (!matchId || !roomCode) {
    egoera.online.errorStartMatch = "Ezin izan da partida hasi";
    renderOnlinePantailaAktiboa();
    return false;
  }

  egoera.online.loadingStartMatch = true;
  egoera.online.errorStartMatch = "";
  renderOnlinePantailaAktiboa();

  try {
    const data = await deituOnlineFuntzioa(
      "start_match",
      {
        matchId,
        roomCode,
      },
      "hasi",
      {
        eskatzenDuPartida: true,
        eskatzenDuJokalaria: false,
      },
    );

    gordeOnlineErantzuna(data, egoera.online.flow);
    egoera.online.errorStartMatch = "";
    onlineStartEskatutakoMatchId = matchId;
    await kargatuOnlineLobbyEgoera(true);

    if (onlinePartidaJolastenDago()) {
      await kargatuOnlineJokoDatuak();
    } else {
      renderOnlinePantailaAktiboa();
    }

    gordeEgoera();
    return true;
  } catch (errorea) {
    onlineStartEskatutakoMatchId = "";
    egoera.online.errorStartMatch =
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("hasi", errorea.message)
        : "Ezin izan da partida hasi";
    renderOnlinePantailaAktiboa();
    return false;
  } finally {
    egoera.online.loadingStartMatch = false;
    if (egoera.pantaila === "online-lobby" || egoera.pantaila === "online-prest") {
      renderOnlinePantailaAktiboa();
    }
  }
}

function ziurtatuOnlinePartidarenHasiera() {
  if (!onlineLobbyPrestDago() || !egoera.online.onlineReadyToStart) {
    return;
  }

  if (onlinePartidaJolastenDago()) {
    void kargatuOnlineJokoDatuak();
    return;
  }

  if (egoera.online.errorStartMatch) {
    return;
  }

  if (egoera.online.onlinePlayer?.seat !== 1) {
    return;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();

  if (!matchId || onlineHastekoKargatzenDa() || onlineStartEskatutakoMatchId === matchId) {
    return;
  }

  onlineStartEskatutakoMatchId = matchId;
  void handleStartMatch();
}

async function kargatuOnlineJokoDatuak() {
  if (!onlineLobbyPrestDago() || !onlinePartidaJolastenDago() || onlinePartidaAmaitutaDago()) {
    return false;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
  const rosco = `${lortuOnlineEsleitutakoRoskoa() ?? ""}`.trim();
  const { topic, level } = egoera.konfigurazioa;

  if (!matchId || !topic || !level || !rosco) {
    egoera.online.errorGameData = "Ezin izan dira galderak kargatu";
    renderOnlineGameScreen();
    return false;
  }

  if (
    onlineGameKargatutakoMatchId === matchId &&
    egoera.online.onlineGameRosco === rosco &&
    egoera.online.onlineGameQuestions.length === 25
  ) {
    renderOnlineGameScreen();
    return true;
  }

  if (onlineJokoaKargatzenDa()) {
    return false;
  }

  if (
    onlineGameKargatutakoMatchId !== matchId ||
    egoera.online.onlineGameRosco !== rosco
  ) {
    egoera.online.onlineGameQuestions = [];
    egoera.online.onlineGameRosco = rosco;
  }

  egoera.online.loadingGameData = true;
  egoera.online.errorGameData = "";
  egoera.online.onlineGameState = lortuOnlineGameState();
  renderOnlineGameScreen();

  try {
    const gameStateGalderak = lortuOnlineEsleitutakoGalderak();
    const galderak =
      gameStateGalderak.length === 25
        ? gameStateGalderak
        : await kargatuRoskoarenGalderak(topic, level, rosco);
    egoera.online.onlineGameQuestions = galderak;
    egoera.online.onlineGameRosco = rosco;
    egoera.online.onlineGameState = lortuOnlineGameState();
    egoera.online.errorGameData = "";
    onlineGameKargatutakoMatchId = matchId;
    renderOnlineGameScreen();
    gordeEgoera();
    return true;
  } catch (errorea) {
    onlineGameKargatutakoMatchId = "";
    egoera.online.errorGameData =
      errorea instanceof Error && errorea.message === "rosko-desegokia"
        ? "Ezin izan dira galderak kargatu"
        : "Ezin izan dira galderak kargatu";
    renderOnlineGameScreen();
    return false;
  } finally {
    egoera.online.loadingGameData = false;
    if (egoera.pantaila === "online-jokoa") {
      renderOnlineGameScreen();
    }
  }
}

function renderOnlineRosco() {
  const galderak = egoera.online.onlineGameQuestions;

  if (!Array.isArray(galderak) || galderak.length === 0) {
    dom.onlineJokoRoskoa.innerHTML = "";
    return;
  }

  const diametroa = dom.onlineJokoRoskoa.clientWidth || 360;
  const mugikorTxikia = window.innerWidth <= 420;
  const mugikorra = window.innerWidth <= 640;
  const kanpoTartea = mugikorTxikia ? 4 : mugikorra ? 5 : 16;
  const gutxienekoTartea = mugikorTxikia ? 2.5 : mugikorra ? 3 : 4;
  const sinus = Math.sin(Math.PI / galderak.length);
  const tamainaMuga =
    (sinus * (diametroa - kanpoTartea * 2) - gutxienekoTartea) / (1 + sinus);
  const tamaina = mugikorTxikia
    ? Math.max(26, Math.min(32, tamainaMuga))
    : mugikorra
      ? Math.max(30, Math.min(36, tamainaMuga))
      : Math.max(34, Math.min(48, tamainaMuga));
  const barrukoTartea = mugikorTxikia ? 3.5 : mugikorra ? 4.5 : 16;
  const erradioa = diametroa / 2 - tamaina / 2 - barrukoTartea;
  const letraTamaina = mugikorTxikia
    ? tamaina * 0.47
    : mugikorra
      ? tamaina * 0.48
      : tamaina * 0.3;
  const letraTamainaLuzea = mugikorTxikia
    ? tamaina * 0.37
    : mugikorra
      ? tamaina * 0.39
      : tamaina * 0.24;

  dom.onlineJokoRoskoa.innerHTML = "";
  dom.onlineJokoRoskoa.style.setProperty("--rosko-hizki-tamaina", `${tamaina}px`);
  dom.onlineJokoRoskoa.style.setProperty("--rosko-hizki-letra-tamaina", `${letraTamaina}px`);
  dom.onlineJokoRoskoa.style.setProperty(
    "--rosko-hizki-letra-tamaina-luzea",
    `${letraTamainaLuzea}px`,
  );
  dom.onlineJokoRoskoa.style.setProperty(
    "--rosko-erdia-zabalera",
    mugikorTxikia ? "30%" : mugikorra ? "32%" : "40%",
  );
  dom.onlineJokoRoskoa.style.setProperty(
    "--rosko-eraztun-inseta",
    mugikorTxikia ? "5.5%" : mugikorra ? "5%" : "10%",
  );

  const erdia = document.createElement("div");
  erdia.className = "rosko-erdia";
  erdia.innerHTML = `<strong class="rosko-erdiko-izena">${itzuliEserlekuEtiketa(
    egoera.online.onlinePlayer?.seat ?? 1,
  )}</strong>`;
  dom.onlineJokoRoskoa.appendChild(erdia);

  const jokalaria = lortuOnlineGameStateJokalaria();
  const { slotMap, letterMap } = lortuOnlineLetrenMapak(
    jokalaria?.letters ?? jokalaria?.letters_state ?? [],
  );
  const currentSlotOrder = lortuOnlineUnekoSlotOrder();

  galderak.forEach((uneGaldera, indizea) => {
    const angelua = (Math.PI * 2 * indizea) / galderak.length - Math.PI / 2;
    const x = diametroa / 2 + Math.cos(angelua) * erradioa;
    const y = diametroa / 2 + Math.sin(angelua) * erradioa;
    const hizkia = document.createElement("div");
    const egoeraLetra =
      slotMap.get(uneGaldera.slotOrder)?.status ??
      letterMap.get(uneGaldera.letter)?.status ??
      "pending";
    const unekoa = uneGaldera.slotOrder === currentSlotOrder;

    hizkia.className = "rosko-hizkia";

    if (uneGaldera.letter.length > 1) {
      hizkia.classList.add("rosko-hizkia--luzea");
    }

    if (egoeraLetra === "correct") {
      hizkia.classList.add("rosko-hizkia--zuzena");
    } else if (egoeraLetra === "wrong") {
      hizkia.classList.add("rosko-hizkia--okerra");
    }

    if (unekoa) {
      hizkia.classList.add("rosko-hizkia--uneko");
    }

    hizkia.style.left = `${x}px`;
    hizkia.style.top = `${y}px`;
    hizkia.textContent = uneGaldera.letter;
    dom.onlineJokoRoskoa.appendChild(hizkia);
  });
}

function renderOnlineGameScreen() {
  garbituOnlinePrestEguneratzeProgramazioa();

  if (!onlineLobbyPrestDago()) {
    restartGame();
    return;
  }

  if (onlinePartidaAmaitutaDago()) {
    renderOnlineAmaieraScreen();
    return;
  }

  const partida = egoera.online.onlineMatch;
  const unekoGaldera = lortuOnlineUnekoGaldera();
  const mezua = itzuliOnlineJokoMezua();
  const saioaBatDator = onlineSaioaEtaEserlekuaBatDatoz();
  const nireTxanda = nireOnlineTxandaDa();
  const jokaldiaBidaltzen =
    onlineErantzunaBidaltzenDa() ||
    onlinePasapalabraBidaltzenDa() ||
    onlineTimeoutKargatzenDa();
  const formErabilgarria =
    saioaBatDator &&
    nireTxanda &&
    onlinePartidaJolastenDago() &&
    Boolean(unekoGaldera) &&
    !onlineJokoaKargatzenDa() &&
    !onlineHastekoKargatzenDa();
  const nireJokalaria = lortuOnlineGameStateJokalaria();
  const aurkaria = lortuOnlineGameStateJokalaria(
    egoera.online.onlinePlayer?.seat === 1 ? 2 : 1,
  );

  erakutsiPantaila("online-jokoa");
  eguneratuTxandaKoloreak();
  dom.onlineJokoRoomCode.textContent = partida?.room_code || "-";
  dom.onlineJokoSeat.textContent = itzuliEserlekuEtiketa(egoera.online.onlinePlayer?.seat ?? 1);
  dom.onlineJokoRosco.textContent = lortuOnlineEsleitutakoRoskoa() || "-";
  dom.onlineJokoTxanda.textContent = itzuliOnlineTxanda();
  dom.onlineJokoDenbora.textContent = lortuOnlineUnekoDenbora();
  dom.onlineJokoNireLaburpena.textContent = itzuliOnlineLaburpena(nireJokalaria);
  dom.onlineJokoAurkariLaburpena.textContent = itzuliOnlineLaburpena(aurkaria);
  dom.onlineJokoGalderaLetra.textContent = nireTxanda ? unekoGaldera?.letter || "?" : "-";
  dom.onlineJokoPista.textContent = onlineJokoaKargatzenDa()
    ? "Erroska kargatzen..."
    : nireTxanda
      ? unekoGaldera?.clue || "Ez dago galdera erabilgarririk"
      : "Beste jokalariaren txanda";
  dom.onlineJokoMezua.textContent = mezua.mezua;
  dom.onlineJokoMezua.className = `hasiera-mezua hasiera-mezua--${mezua.mota}`;
  dom.onlineJokoErantzunaInput.value = egoera.online.onlineAnswer;
  dom.onlineJokoErantzunaInput.disabled = !formErabilgarria || jokaldiaBidaltzen;
  dom.onlineJokoErantzunaInput.placeholder = nireTxanda
    ? "Idatzi erantzuna"
    : "Beste jokalariaren txanda";
  dom.onlineJokoPasapalabraBotoia.disabled = !formErabilgarria || jokaldiaBidaltzen;
  dom.onlineJokoPasapalabraBotoia.textContent = onlinePasapalabraBidaltzenDa()
    ? "Kargatzen..."
    : "Hitzapasa";

  const erantzunBotoia = dom.onlineJokoFormulario?.querySelector('button[type="submit"]');
  if (erantzunBotoia) {
    erantzunBotoia.disabled = !formErabilgarria || jokaldiaBidaltzen;
    erantzunBotoia.textContent = onlineErantzunaBidaltzenDa() ? "Kargatzen..." : "Erantzun";
  }

  if (egoera.online.onlineGameQuestions.length > 0) {
    renderOnlineRosco();
  } else {
    dom.onlineJokoRoskoa.innerHTML = "";
  }

  if (
    onlinePartidaJolastenDago() &&
    !onlineJokoaKargatzenDa() &&
    egoera.online.onlineGameQuestions.length !== 25
  ) {
    void kargatuOnlineJokoDatuak();
  }

  ziurtatuOnlineJokoEguneratzea();
  ziurtatuOnlineKontagailua();
  gordeEgoera();
}

function renderOnlineAmaieraScreen() {
  garbituOnlinePrestEguneratzeProgramazioa();
  garbituOnlineJokoEguneratzeProgramazioa();

  if (!onlineLobbyPrestDago()) {
    restartGame();
    return;
  }

  eguneratuOnlineAmaieraEgoera();
  garbituOnlineKontagailua();
  void garbituOnlineRealtimeHarpidetza();

  const emaitza = egoera.online.onlineFinishedResult;
  if (!emaitza) {
    erakutsiPantaila("online-amaiera");
    eguneratuTxandaKoloreak();
    dom.onlineAmaieraIzenburua.textContent = "Amaierako emaitza";
    dom.onlineAmaieraAzalpena.textContent = "Ezin izan da partida amaiera eguneratu.";
    dom.onlineAmaieraRoomCode.textContent = `${egoera.online.onlineMatch?.room_code ?? "-"}`;
    dom.onlineAmaieraTopic.textContent = egoera.online.onlineMatch?.topic
      ? itzuliGaiarenIzenOsoa(egoera.online.onlineMatch.topic)
      : "-";
    dom.onlineAmaieraLevel.textContent = `${egoera.online.onlineMatch?.level ?? "-"}`;
    dom.onlineAmaieraIrabazlea.textContent = "-";
    dom.onlineAmaieraArrazoia.textContent = "-";
    dom.onlineAmaieraEmaitzak.innerHTML = "";
    dom.onlineAmaieraFeedback.textContent = "Ezin izan da partida amaiera eguneratu";
    dom.onlineAmaieraFeedback.className = "hasiera-mezua hasiera-mezua--okerra";
    gordeEgoera();
    return;
  }

  egoera.online.errorOnlineFinish = "";
  erakutsiPantaila("online-amaiera");
  eguneratuTxandaKoloreak();
  dom.onlineAmaieraIzenburua.textContent = "Amaierako emaitza";
  dom.onlineAmaieraAzalpena.textContent =
    emaitza.winnerSeat === null
      ? "Bi jokalariek emaitza bera lortu dute."
      : `${itzuliEserlekuEtiketa(emaitza.winnerSeat)} nagusitu da online partidan.`;
  dom.onlineAmaieraRoomCode.textContent = emaitza.roomCode;
  dom.onlineAmaieraTopic.textContent = emaitza.topic
    ? itzuliGaiarenIzenOsoa(emaitza.topic)
    : "-";
  dom.onlineAmaieraLevel.textContent = emaitza.level;
  dom.onlineAmaieraIrabazlea.textContent = emaitza.winnerText;
  dom.onlineAmaieraArrazoia.textContent = itzuliOnlineAmaieraArrazoia(emaitza.reason);
  dom.onlineAmaieraEmaitzak.innerHTML = [emaitza.player1, emaitza.player2]
    .map((jokalaria, indizea) => {
      const seat = indizea + 1;
      if (!jokalaria) {
        return "";
      }

      return `
        <article>
          <h3>${itzuliEserlekuEtiketa(seat)}</h3>
          <dl>
            <dt>Asmatutakoak</dt>
            <dd>${Number(jokalaria.hits ?? 0)}</dd>
            <dt>Hutsegiteak</dt>
            <dd>${Number(jokalaria.errors ?? 0)}</dd>
            <dt>Erantzun gabe</dt>
            <dd>${Number(jokalaria.unanswered ?? 0)}</dd>
            <dt>Denbora</dt>
            <dd>${formateatuOnlineDenbora(Number(jokalaria.timeRemainingMs ?? 0))}</dd>
          </dl>
        </article>
      `;
    })
    .join("");
  dom.onlineAmaieraFeedback.textContent = egoera.online.errorOnlineFinish || "Partida amaitu da";
  dom.onlineAmaieraFeedback.className = `hasiera-mezua hasiera-mezua--${
    egoera.online.errorOnlineFinish ? "okerra" : "oharra"
  }`;
  gordeEgoera();
}

function prestatuOnlineMugimenduEskaera() {
  if (!onlineLobbyPrestDago() || !onlinePartidaJolastenDago()) {
    egoera.online.errorOnlineMove = "Ezin izan da jokaldia bidali";
    renderOnlineGameScreen();
    return null;
  }

  if (!nireOnlineTxandaDa()) {
    egoera.online.errorOnlineMove = "Beste jokalariaren txanda";
    renderOnlineGameScreen();
    return null;
  }

  if (
    onlineErantzunaBidaltzenDa() ||
    onlinePasapalabraBidaltzenDa() ||
    onlineTimeoutKargatzenDa()
  ) {
    return null;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
  const roomCode = `${egoera.online.onlineMatch?.room_code ?? ""}`.trim();

  if (!matchId || !roomCode) {
    egoera.online.errorOnlineMove = "Ezin izan da jokaldia bidali";
    renderOnlineGameScreen();
    return null;
  }

  return {
    matchId,
    roomCode,
  };
}

async function handleSubmitOnlineAnswer(eventua) {
  eventua.preventDefault();

  const eskaera = prestatuOnlineMugimenduEskaera();
  if (!eskaera) {
    return;
  }

  const answer = `${egoera.online.onlineAnswer ?? ""}`.trim();
  if (!answer) {
    egoera.online.errorOnlineMove = "Ezin duzu hutsik bidali";
    renderOnlineGameScreen();
    return;
  }

  egoera.online.loadingSubmitAnswer = true;
  egoera.online.errorOnlineMove = "";
  egoera.online.onlineMoveMessage = "";
  renderOnlineGameScreen();

  try {
    const data = await deituOnlineFuntzioa(
      "submit_answer",
      {
        ...eskaera,
        answer,
      },
      "jokaldia",
      {
        eskatzenDuPartida: true,
        eskatzenDuJokalaria: false,
      },
    );

    egoera.online.onlineAnswer = "";
    egoera.online.errorOnlineMove = "";
    gordeOnlineErantzuna(data, egoera.online.flow);
    await kargatuOnlineLobbyEgoera(true);
    renderOnlineGameScreen();
    gordeEgoera();
  } catch (errorea) {
    egoera.online.errorOnlineMove =
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("jokaldia", errorea.message)
        : "Ezin izan da jokaldia bidali";
    renderOnlineGameScreen();
  } finally {
    egoera.online.loadingSubmitAnswer = false;
    if (egoera.pantaila === "online-jokoa") {
      renderOnlineGameScreen();
    }
  }
}

async function handleOnlinePasapalabra() {
  const eskaera = prestatuOnlineMugimenduEskaera();
  if (!eskaera) {
    return;
  }

  egoera.online.loadingPassTurn = true;
  egoera.online.errorOnlineMove = "";
  egoera.online.onlineMoveMessage = "";
  renderOnlineGameScreen();

  try {
    const data = await deituOnlineFuntzioa(
      "pass_turn",
      eskaera,
      "jokaldia",
      {
        eskatzenDuPartida: true,
        eskatzenDuJokalaria: false,
      },
    );

    egoera.online.errorOnlineMove = "";
    gordeOnlineErantzuna(data, egoera.online.flow);
    await kargatuOnlineLobbyEgoera(true);
    renderOnlineGameScreen();
    gordeEgoera();
  } catch (errorea) {
    egoera.online.errorOnlineMove =
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("jokaldia", errorea.message)
        : "Ezin izan da jokaldia bidali";
    renderOnlineGameScreen();
  } finally {
    egoera.online.loadingPassTurn = false;
    if (egoera.pantaila === "online-jokoa") {
      renderOnlineGameScreen();
    }
  }
}

async function handleOnlineTimeout(autotik = false) {
  if (!onlineLobbyPrestDago() || !onlinePartidaJolastenDago() || onlinePartidaAmaitutaDago()) {
    return false;
  }

  if (
    onlineErantzunaBidaltzenDa() ||
    onlinePasapalabraBidaltzenDa() ||
    onlineTimeoutKargatzenDa()
  ) {
    return false;
  }

  const matchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
  const roomCode = `${egoera.online.onlineMatch?.room_code ?? ""}`.trim();
  const timeoutGakoa = sortuOnlineTimeoutGakoa();

  if (!matchId || !roomCode || !timeoutGakoa) {
    return false;
  }

  if (onlineTimeoutEskatutakoGakoa === timeoutGakoa) {
    return false;
  }

  onlineTimeoutEskatutakoGakoa = timeoutGakoa;
  egoera.online.loadingTimeout = true;
  egoera.online.errorOnlineFinish = "";
  egoera.online.onlineMoveMessage = "";
  renderOnlinePantailaAktiboa();

  try {
    const data = await deituOnlineFuntzioa(
      "handle_timeout",
      {
        matchId,
        roomCode,
      },
      "amaiera",
      {
        eskatzenDuPartida: true,
        eskatzenDuJokalaria: false,
      },
    );

    gordeOnlineErantzuna(data, egoera.online.flow);
    egoera.online.errorOnlineFinish = "";
    await kargatuOnlineLobbyEgoera(true);
    renderOnlinePantailaAktiboa();
    gordeEgoera();
    return true;
  } catch (errorea) {
    onlineTimeoutEskatutakoGakoa = "";
    if (!autotik) {
      egoera.online.errorOnlineFinish =
        errorea instanceof Error && errorea.message
          ? itzuliOnlineErrorea("amaiera", errorea.message)
          : "Ezin izan da partida amaiera eguneratu";
      renderOnlinePantailaAktiboa();
    }
    return false;
  } finally {
    egoera.online.loadingTimeout = false;
    renderOnlinePantailaAktiboa();
  }
}

async function handleCreateMatch() {
  if (!egoera.konfigurazioa.topic) {
    ezarriOnlineErrorea("create", "Aukeratu gaia");
    ezarriHasieraMezua(egoera.online.errorCreate, "okerra");
    renderStartScreen();
    return;
  }

  if (!egoera.konfigurazioa.level) {
    ezarriOnlineErrorea("create", "Aukeratu maila");
    ezarriHasieraMezua(egoera.online.errorCreate, "okerra");
    renderStartScreen();
    return;
  }

  if (!supabaseKonfiguratutaDago()) {
    ezarriOnlineErrorea("create", "Supabase konfiguratu gabe dago");
    ezarriHasieraMezua(egoera.online.errorCreate, "okerra");
    renderStartScreen();
    return;
  }

  try {
    await ziurtatuOnlineSaioa(true);
  } catch (_errorea) {
    egoera.online.errorAuth = "Saioa hasi behar duzu online partidarako";
    renderStartScreen();
    return;
  }

  egoera.online.loadingCreate = true;
  ezarriOnlineErrorea("create", "");
  egoera.online.errorAuth = "";
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    const data = await deituOnlineFuntzioa(
      "create_match",
      {
        topic: egoera.konfigurazioa.topic,
        level: egoera.konfigurazioa.level,
      },
      "sortu",
    );

    garbituOnlineErroreak();
    gordeOnlineErantzuna(data, "create");
    egoera.online.loadingCreate = false;
    await kargatuOnlineLobbyEgoera(true);
    if (onlinePartidaJolastenDago()) {
      renderOnlineGameScreen();
    } else if (egoera.online.onlineReadyToStart) {
      renderOnlinePrestScreen();
    } else {
      renderOnlineLobby();
    }
    gordeEgoera();
    return;
  } catch (errorea) {
    ezarriOnlineErrorea(
      "create",
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("sortu", errorea.message)
        : "Errorea gertatu da",
    );
    ezarriHasieraMezua(egoera.online.errorCreate, "okerra");
  } finally {
    egoera.online.loadingCreate = false;
    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  }
}

async function handleJoinMatch() {
  const roomCode = normalizatuRoomCode(egoera.online.enteredRoomCode);
  egoera.online.enteredRoomCode = roomCode;

  if (!roomCode) {
    ezarriOnlineErrorea("join", "Sartu gelaren kodea");
    renderStartScreen();
    return;
  }

  if (!supabaseKonfiguratutaDago()) {
    ezarriOnlineErrorea("join", "Supabase konfiguratu gabe dago");
    renderStartScreen();
    return;
  }

  try {
    await ziurtatuOnlineSaioa(true);
  } catch (_errorea) {
    egoera.online.errorAuth = "Saioa hasi behar duzu online partidarako";
    renderStartScreen();
    return;
  }

  egoera.online.loadingJoin = true;
  ezarriOnlineErrorea("join", "");
  egoera.online.errorAuth = "";
  renderStartScreen();

  try {
    const data = await deituOnlineFuntzioa(
      "join_match",
      {
        roomCode,
      },
      "sartu",
    );

    garbituOnlineErroreak();
    gordeOnlineErantzuna(data, "join");
    egoera.online.loadingJoin = false;
    await kargatuOnlineLobbyEgoera(true);
    if (onlinePartidaJolastenDago()) {
      renderOnlineGameScreen();
    } else if (egoera.online.onlineReadyToStart) {
      renderOnlinePrestScreen();
    } else {
      renderOnlineLobby();
    }
    gordeEgoera();
    return;
  } catch (errorea) {
    ezarriOnlineErrorea(
      "join",
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("sartu", errorea.message)
        : "Errorea gertatu da",
    );
  } finally {
    egoera.online.loadingJoin = false;
    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  }
}

async function handleSetReady() {
  if (!onlineLobbyPrestDago()) {
    restartGame();
    return;
  }

  if (unekoOnlineJokalariaPrestDago()) {
    renderOnlinePantailaAktiboa();
    return;
  }

  egoera.online.loadingSetReady = true;
  egoera.online.errorSetReady = "";
  renderOnlinePantailaAktiboa();

  try {
    const data = await deituOnlineFuntzioa(
      "set_ready",
      {
        matchId: egoera.online.onlineMatch.id,
        roomCode: egoera.online.onlineMatch.room_code,
        isReady: true,
      },
      "prest",
      {
        eskatzenDuPartida: false,
        eskatzenDuJokalaria: false,
      },
    );

    gordeOnlineErantzuna(
      {
        ...data,
        player: {
          seat: egoera.online.onlinePlayer?.seat,
          player_id: egoera.online.onlinePlayer?.player_id,
          is_ready: true,
          ...(data.player ?? {}),
        },
      },
      egoera.online.flow,
    );
    egoera.online.errorSetReady = "";
    await kargatuOnlineLobbyEgoera(true);
    egoera.online.lobbyMessage = itzuliLobbyOharra();
    renderOnlinePantailaAktiboa();
    gordeEgoera();
  } catch (errorea) {
    egoera.online.errorSetReady =
      errorea instanceof Error && errorea.message
        ? itzuliOnlineErrorea("prest", errorea.message)
        : "Ezin izan da prest egoera gorde";
    renderOnlinePantailaAktiboa();
  } finally {
    egoera.online.loadingSetReady = false;
    if (egoera.pantaila === "online-lobby" || egoera.pantaila === "online-prest") {
      renderOnlinePantailaAktiboa();
    }
  }
}

function renderJokalariTxartela(indizea) {
  const txartela = indizea === 0 ? dom.jokalariTxartela0 : dom.jokalariTxartela1;
  const jokalaria = egoera.jokalariak[indizea];

  if (!txartela || !jokalaria) {
    return;
  }

  const aktiboa = egoera.pantaila === "jokoa" && indizea === egoera.unekoJokalaria;
  const pendienteak = kalkulatuPendienteak(jokalaria);

  txartela.classList.toggle("jokalari-txartela--aktiboa", aktiboa);
  txartela.innerHTML = `
    <div>
      <p class="etiketa">${aktiboa ? "Uneko txanda" : "Jokalaria"}</p>
      <h3 class="jokalari-izena">${jokalaria.izena}</h3>
      <p class="jokalari-roskoa">Erroska: ${jokalaria.rosco}</p>
    </div>
    <div class="jokalari-estatistikak">
      <div>
        <span>Asmatuak</span>
        <strong>${jokalaria.asmatuak}</strong>
      </div>
      <div>
        <span>Hutsak</span>
        <strong>${jokalaria.hutsak}</strong>
      </div>
      <div>
        <span>Erantzun gabe</span>
        <strong>${pendienteak}</strong>
      </div>
      <div>
        <span>Denbora</span>
        <strong>${jokalaria.denbora}s</strong>
      </div>
    </div>
  `;
}

function renderEgoeraTaula() {
  if (egoera.jokalariak.length === 0) {
    return;
  }

  dom.egoeraSarea?.classList.toggle("egoera-sarea--bakarka", egoera.jokalariak.length === 1);
  dom.jokalariTxartela0.hidden = false;
  renderJokalariTxartela(0);
  if (egoera.jokalariak.length > 1) {
    dom.jokalariTxartela1.hidden = false;
    renderJokalariTxartela(1);
  } else {
    dom.jokalariTxartela1.hidden = true;
    dom.jokalariTxartela1.innerHTML = "";
  }

  const jokalaria = lortuUnekoJokalaria();
  const txandaTestua = `${jokalaria.izena}(r)en txanda`;
  const denboraTestua = `${jokalaria.denbora}s`;
  const larri = jokalaria.denbora <= 20;

  dom.txandaAdierazlea.textContent = txandaTestua;
  dom.denboraErakusgailua.textContent = denboraTestua;
  dom.denboraErakusgailuaGoiburua.textContent = denboraTestua;
  dom.denboraErakusgailua.classList.toggle("denbora-erakusgailua--larri", larri);
  dom.denboraErakusgailuaGoiburua.classList.toggle("denbora-erakusgailua--larri", larri);
}

function eguneratuTxandaKoloreak() {
  dom.aplikazioa.classList.remove("aplikazioa--jokalari-0", "aplikazioa--jokalari-1");

  if (egoera.pantaila === "jokoa" && egoera.jokalariak.length === 2) {
    dom.aplikazioa.classList.add(`aplikazioa--jokalari-${egoera.unekoJokalaria}`);
    return;
  }

  if (
    (egoera.pantaila === "online-lobby" ||
      egoera.pantaila === "online-prest" ||
      egoera.pantaila === "online-jokoa" ||
      egoera.pantaila === "online-amaiera") &&
    egoera.online.onlinePlayer?.seat
  ) {
    const seat =
      lortuOnlineTxandakoSeat() ?? egoera.online.onlinePlayer.seat;
    dom.aplikazioa.classList.add(`aplikazioa--jokalari-${seat - 1}`);
    return;
  }

  dom.aplikazioa.classList.add("aplikazioa--jokalari-0");
}

function renderRosco() {
  if (egoera.pantaila !== "jokoa") {
    return;
  }

  const jokalaria = lortuUnekoJokalaria();
  const galderak = lortuGalderak(jokalaria);

  if (!jokalaria || galderak.length === 0) {
    return;
  }

  const diametroa = dom.roskoa.clientWidth || 360;
  const mugikorTxikia = window.innerWidth <= 420;
  const mugikorra = window.innerWidth <= 640;
  const kanpoTartea = mugikorTxikia ? 4 : mugikorra ? 5 : 16;
  const gutxienekoTartea = mugikorTxikia ? 2.5 : mugikorra ? 3 : 4;
  const sinus = Math.sin(Math.PI / galderak.length);
  const tamainaMuga =
    (sinus * (diametroa - kanpoTartea * 2) - gutxienekoTartea) / (1 + sinus);
  const tamaina = mugikorTxikia
    ? Math.max(26, Math.min(32, tamainaMuga))
    : mugikorra
      ? Math.max(30, Math.min(36, tamainaMuga))
      : Math.max(34, Math.min(48, tamainaMuga));
  const barrukoTartea = mugikorTxikia ? 3.5 : mugikorra ? 4.5 : 16;
  const erradioa = diametroa / 2 - tamaina / 2 - barrukoTartea;
  const letraTamaina = mugikorTxikia
    ? tamaina * 0.47
    : mugikorra
      ? tamaina * 0.48
      : tamaina * 0.3;
  const letraTamainaLuzea = mugikorTxikia
    ? tamaina * 0.37
    : mugikorra
      ? tamaina * 0.39
      : tamaina * 0.24;
  const erdikoZabalera = mugikorTxikia ? "30%" : mugikorra ? "32%" : "40%";
  const eraztunInseta = mugikorTxikia ? "5.5%" : mugikorra ? "5%" : "10%";

  dom.roskoa.innerHTML = "";
  dom.roskoa.style.setProperty("--rosko-hizki-tamaina", `${tamaina}px`);
  dom.roskoa.style.setProperty("--rosko-hizki-letra-tamaina", `${letraTamaina}px`);
  dom.roskoa.style.setProperty(
    "--rosko-hizki-letra-tamaina-luzea",
    `${letraTamainaLuzea}px`,
  );
  dom.roskoa.style.setProperty("--rosko-erdia-zabalera", erdikoZabalera);
  dom.roskoa.style.setProperty("--rosko-eraztun-inseta", eraztunInseta);

  const erdia = document.createElement("div");
  erdia.className = "rosko-erdia";
  erdia.innerHTML = `<strong class="rosko-erdiko-izena">${jokalaria.izena}</strong>`;
  dom.roskoa.appendChild(erdia);

  galderak.forEach((uneGaldera, indizea) => {
    const angelua = (Math.PI * 2 * indizea) / galderak.length - Math.PI / 2;
    const x = diametroa / 2 + Math.cos(angelua) * erradioa;
    const y = diametroa / 2 + Math.sin(angelua) * erradioa;
    const hizkia = document.createElement("div");
    const egoeraLetra = jokalaria.egoerak[indizea];
    const unekoa = jokalaria.unekoIndizea === indizea;

    hizkia.className = "rosko-hizkia";
    if (uneGaldera.letter.length > 1) {
      hizkia.classList.add("rosko-hizkia--luzea");
    }

    if (egoeraLetra === "correct") {
      hizkia.classList.add("rosko-hizkia--zuzena");
    } else if (egoeraLetra === "wrong") {
      hizkia.classList.add("rosko-hizkia--okerra");
    }

    if (unekoa) {
      hizkia.classList.add("rosko-hizkia--uneko");
    }

    hizkia.style.left = `${x}px`;
    hizkia.style.top = `${y}px`;
    hizkia.textContent = uneGaldera.letter;
    dom.roskoa.appendChild(hizkia);
  });
}

function renderCurrentQuestion() {
  const jokalaria = lortuUnekoJokalaria();
  const galdera = jokalaria ? lortuGalderak(jokalaria)[jokalaria.unekoIndizea] : null;

  if (!jokalaria || !galdera) {
    return;
  }

  dom.uneanJokalaria.textContent = jokalaria.izena;
  dom.galderaLetra.textContent = galdera.letter;
  dom.galderaPista.textContent = galdera.clue;
}

function renderGameScreen() {
  if (egoera.pantaila !== "jokoa") {
    return;
  }

  eguneratuTxandaKoloreak();
  renderEgoeraTaula();
  renderRosco();
  renderCurrentQuestion();
  ezarriFeedback(egoera.feedback || "", egoera.feedbackMota || "oharra");
  dom.erantzunaInput.disabled = false;
  dom.pasapalabraBotoia.disabled = false;
}

function kalkulatuIrabazlea() {
  if (egoera.jokalariak.length === 1) {
    return egoera.jokalariak[0].izena;
  }

  const [bat, bi] = egoera.jokalariak;

  if (bat.asmatuak > bi.asmatuak) {
    return bat.izena;
  }

  if (bi.asmatuak > bat.asmatuak) {
    return bi.izena;
  }

  if (bat.hutsak < bi.hutsak) {
    return bat.izena;
  }

  if (bi.hutsak < bat.hutsak) {
    return bi.izena;
  }

  return "Berdinketa";
}

function renderResultsScreen() {
  if (egoera.jokalariak.length === 1) {
    dom.irabazleaIzenburua.textContent = `${egoera.jokalariak[0].izena}(r)en emaitza`;
  } else {
    const irabazlea = kalkulatuIrabazlea();
    dom.irabazleaIzenburua.textContent =
      irabazlea === "Berdinketa" ? "Berdinketa" : `Irabazlea: ${irabazlea}`;
  }

  dom.azkenEmaitzak.innerHTML = egoera.jokalariak
    .map((jokalaria) => {
      const pendienteak = kalkulatuPendienteak(jokalaria);
      return `
        <article>
          <h3>${jokalaria.izena}</h3>
          <p class="amaiera-roskoa">Erroska: ${jokalaria.rosco}</p>
          <dl>
            <dt>Asmatuak</dt>
            <dd>${jokalaria.asmatuak}</dd>
            <dt>Hutsak</dt>
            <dd>${jokalaria.hutsak}</dd>
            <dt>Erantzun gabe</dt>
            <dd>${pendienteak}</dd>
            <dt>Denbora agortuta</dt>
            <dd>${jokalaria.denboraAgortuta ? "Bai" : "Ez"}</dd>
          </dl>
        </article>
      `;
    })
    .join("");
}

function gordeEgoera() {
  if (egoera.pantaila === "hasiera") {
    ezabatuBiltegitik(GORDE_GAKOA);
    return;
  }

  gordeBiltegian(
    GORDE_GAKOA,
    JSON.stringify({
      pantaila: egoera.pantaila,
      jokoModua: egoera.jokoModua,
      konfigurazioa: egoera.konfigurazioa,
      jokalariak: egoera.jokalariak,
      unekoJokalaria: egoera.unekoJokalaria,
      hurrengoJokalaria: egoera.hurrengoJokalaria,
      aurrekoJokalaria: egoera.aurrekoJokalaria,
      feedback: egoera.feedback,
      feedbackMota: egoera.feedbackMota,
      aldaketaArrazoia: egoera.aldaketaArrazoia,
      amaieraArrazoia: egoera.amaieraArrazoia,
      denboraMuga: egoera.denboraMuga,
      online: egoera.online,
    }),
  );
}

function kargatuEgoera() {
  const gordea = irakurriBiltegitik(GORDE_GAKOA);

  if (!gordea) {
    return false;
  }

  try {
    const datuak = JSON.parse(gordea);
    const jokoModua = jokoModuaAukeratutaDago(datuak.jokoModua)
      ? datuak.jokoModua
      : jokoModuaJokalariKopurutik(datuak.jokalariak?.length ?? 0);
    const onlineGordea = datuak.online ?? {};
    const onlineBerreskuratua = {
      ...sortuOnlineEgoera(),
      ...onlineGordea,
      loadingCreate: false,
      loadingJoin: false,
      loadingSetReady: false,
      loadingStartMatch: false,
      loadingLobby: false,
      loadingGameData: false,
      loadingSubmitAnswer: false,
      loadingPassTurn: false,
      loadingTimeout: false,
      errorSetReady: "",
      errorStartMatch: "",
      errorLobby: "",
      errorGameData: "",
      errorOnlineMove: "",
      errorOnlineFinish: "",
      onlineRealtimeConnected: false,
      onlinePlayersState: sortuLobbyJokalariak(
        onlineGordea.onlinePlayersState ?? onlineGordea.lobbyPlayers ?? [],
      ),
      onlineReadyToStart: Boolean(
        onlineGordea.onlineReadyToStart ?? onlineGordea.hurrengoEgoeraPrest,
      ),
    };

    if (
      (datuak.pantaila === "online-lobby" ||
        datuak.pantaila === "online-prest" ||
        datuak.pantaila === "online-jokoa" ||
        datuak.pantaila === "online-amaiera") &&
      onlineGordea?.onlineMatch &&
      onlineGordea?.onlinePlayer
    ) {
      egoera.konfigurazioa = {
        topic: datuak.konfigurazioa?.topic ?? "",
        level: datuak.konfigurazioa?.level ?? "",
      };
      egoera.jokoModua = jokoModua;
      egoera.online = onlineBerreskuratua;
      onlineStartEskatutakoMatchId = `${egoera.online.onlineMatch?.id ?? ""}`.trim();
      onlineGameKargatutakoMatchId =
        egoera.online.onlineGameQuestions.length === 25
          ? `${egoera.online.onlineMatch?.id ?? ""}`.trim()
          : "";
      sinkronizatuUnekoOnlineJokalaria();
      eguneratuLobbyPrestEgoera();
      eguneratuOnlineAmaieraEgoera();
      if (datuak.pantaila === "online-amaiera" || onlinePartidaAmaitutaDago()) {
        renderOnlineAmaieraScreen();
      } else if (datuak.pantaila === "online-jokoa") {
        renderOnlineGameScreen();
        void kargatuOnlineJokoDatuak();
      } else if (datuak.pantaila === "online-prest" && egoera.online.onlineReadyToStart) {
        renderOnlinePrestScreen();
      } else {
        renderOnlineLobby();
      }
      void kargatuOnlineLobbyEgoera(true);
      return true;
    }

    if (
      !Array.isArray(datuak.jokalariak) ||
      ![1, 2].includes(datuak.jokalariak.length) ||
      !datuak.konfigurazioa?.topic ||
      !datuak.konfigurazioa?.level
    ) {
      ezabatuBiltegitik(GORDE_GAKOA);
      return false;
    }

    egiaztatuJokalarienRoskak(datuak.jokalariak, datuak.konfigurazioa);

    if (
      !datuak.jokalariak.every(
        (jokalaria) =>
          Array.isArray(jokalaria.egoerak) &&
          jokalaria.egoerak.length === jokalaria.galderak.length,
      )
    ) {
      ezabatuBiltegitik(GORDE_GAKOA);
      return false;
    }

    egoera.konfigurazioa = {
      topic: datuak.konfigurazioa.topic,
      level: datuak.konfigurazioa.level,
    };
    egoera.jokoModua = jokoModua;
    egoera.jokalariak = datuak.jokalariak;
    egoera.unekoJokalaria = datuak.unekoJokalaria ?? 0;
    egoera.hurrengoJokalaria = datuak.hurrengoJokalaria ?? null;
    egoera.aurrekoJokalaria = datuak.aurrekoJokalaria ?? null;
    egoera.feedback = datuak.feedback ?? "";
    egoera.feedbackMota = datuak.feedbackMota ?? "oharra";
    egoera.aldaketaArrazoia = datuak.aldaketaArrazoia ?? "";
    egoera.amaieraArrazoia = datuak.amaieraArrazoia ?? "";
    egoera.denboraMuga = datuak.denboraMuga ?? null;
    egoera.online = onlineBerreskuratua;
    onlineStartEskatutakoMatchId = "";
    onlineGameKargatutakoMatchId = "";

    if (datuak.pantaila === "jokoa") {
      startTurn(egoera.unekoJokalaria, true);
      return true;
    }

    if (datuak.pantaila === "amaiera") {
      erakutsiPantaila("amaiera");
      eguneratuTxandaKoloreak();
      renderResultsScreen();
      return true;
    }
  } catch (_errorea) {
    ezabatuBiltegitik(GORDE_GAKOA);
  }

  return false;
}

async function initGame() {
  if (!jokoModuaAukeratutaDago()) {
    ezarriHasieraMezua("Aukeratu joko modua", "okerra");
    renderStartScreen();
    return;
  }

  if (!konfigurazioaOsatuta() || hautapenakKargatzenDira()) {
    ezarriHasieraMezua("Aukeraketa osatu behar duzu", "okerra");
    renderStartScreen();
    return;
  }

  if (egoera.aukerak.roscos.length < beharrezkoRoskoKopurua()) {
    ezarriHasieraMezua(itzuliRoskoEskakizunMezua(), "okerra");
    renderStartScreen();
    return;
  }

  garbituErlojua();

  const izena1 = dom.jokalari1Izena.value.trim()
    || (bakarkakoJokoaDa() ? "Jokalaria" : "1. jokalaria");
  const izena2 = dom.jokalari2Izena.value.trim() || "2. jokalaria";

  egoera.kargatzen.questions = true;
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    if (bakarkakoJokoaDa()) {
      const { rosco, galderak } = await kargatuBakarkakoGalderak();
      egoera.jokalariak = [sortuJokalaria(izena1, rosco, galderak)];
    } else {
      const { rosco1, rosco2, galderak1, galderak2 } = await kargatuBiJokalarienGalderak();
      egoera.jokalariak = [
        sortuJokalaria(izena1, rosco1, galderak1),
        sortuJokalaria(izena2, rosco2, galderak2),
      ];
    }
    egiaztatuJokalarienRoskak(egoera.jokalariak, egoera.konfigurazioa);
  } catch (errorea) {
    egoera.jokalariak = [];
    ezarriHasieraMezua(
      errorea instanceof Error && errorea.message === "rosko-gutxiegi"
        ? itzuliRoskoEskakizunMezua()
        : "Ezin izan dira galderak kargatu",
      "okerra",
    );
    egoera.kargatzen.questions = false;
    renderStartScreen();
    return;
  }

  egoera.unekoJokalaria = 0;
  egoera.hurrengoJokalaria = null;
  egoera.aurrekoJokalaria = null;
  egoera.feedback = "";
  egoera.feedbackMota = "oharra";
  egoera.aldaketaArrazoia = "";
  egoera.amaieraArrazoia = "";
  egoera.denboraMuga = null;
  egoera.online = sortuOnlineEgoera();
  egoera.kargatzen.questions = false;
  ezarriHasieraMezua("", "oharra");

  startTurn(0);
}

function startTurn(jokalariIndizea, berreskuratu = false) {
  garbituErlojua();
  egoera.unekoJokalaria = jokalariIndizea;
  egoera.hurrengoJokalaria = null;
  egoera.aurrekoJokalaria = null;
  erakutsiPantaila("jokoa");

  const jokalaria = lortuUnekoJokalaria();
  const unekoa = ziurtatuUnekoPendientea(jokalaria);

  if (jokalaria.denbora <= 0 || unekoa === -1) {
    checkEndOfTurn();
    return;
  }

  if (!berreskuratu || !egoera.denboraMuga) {
    egoera.denboraMuga = Date.now() + jokalaria.denbora * 1000;
  }

  eguneratuDenbora();

  if (egoera.pantaila !== "jokoa") {
    return;
  }

  renderGameScreen();
  gordeEgoera();

  requestAnimationFrame(() => {
    dom.erantzunaInput.focus();
  });

  egoera.erlojuaId = window.setInterval(eguneratuDenbora, 250);
}

function eguneratuDenbora() {
  if (egoera.pantaila !== "jokoa" || !egoera.denboraMuga) {
    return;
  }

  const jokalaria = lortuUnekoJokalaria();
  const segundoak = Math.max(0, Math.ceil((egoera.denboraMuga - Date.now()) / 1000));

  if (segundoak !== jokalaria.denbora) {
    jokalaria.denbora = segundoak;
    renderEgoeraTaula();
    gordeEgoera();
  }

  if (segundoak <= 0) {
    checkEndOfTurn();
  }
}

function moveToNextPendingLetter() {
  const jokalaria = lortuUnekoJokalaria();
  const hurrengoa = bilatuPendientea(jokalaria, jokalaria.unekoIndizea, false);

  if (hurrengoa !== -1) {
    jokalaria.unekoIndizea = hurrengoa;
    return true;
  }

  return false;
}

function showFinalResults() {
  garbituErlojua();
  egoera.denboraMuga = null;
  egoera.hurrengoJokalaria = null;
  egoera.aurrekoJokalaria = null;
  erakutsiPantaila("amaiera");
  renderResultsScreen();
  gordeEgoera();
}

function switchPlayer(hurrengoJokalaria) {
  garbituErlojua();
  egoera.denboraMuga = null;
  egoera.aurrekoJokalaria = egoera.unekoJokalaria;
  egoera.hurrengoJokalaria = hurrengoJokalaria;
  const oinarrizkoMezua = egoera.feedback || egoera.aldaketaArrazoia || "Hurrengo jokalaria";
  egoera.feedback = `${oinarrizkoMezua} ${egoera.jokalariak[hurrengoJokalaria].izena}(r)en txanda.`;
  startTurn(hurrengoJokalaria);
}

function checkEndOfTurn() {
  const jokalaria = lortuUnekoJokalaria();

  if (kalkulatuPendienteak(jokalaria) === 0) {
    jokalaria.amaituta = true;
    egoera.feedback = "Erroska osatu duzu";
    egoera.feedbackMota = "zuzena";
    egoera.amaieraArrazoia = "Erroska osatu duzu";
    showFinalResults();
    return true;
  }

  if (jokalaria.denbora <= 0) {
    jokalaria.denbora = 0;
    jokalaria.denboraAgortuta = true;
    jokalaria.amaituta = true;
    egoera.feedback = "Denbora amaitu da";
    egoera.feedbackMota = "oharra";
    egoera.aldaketaArrazoia = "Denbora amaitu da";

    if (biJokalariakDenboraBarikDaude()) {
      egoera.amaieraArrazoia = "Denbora amaitu da";
      showFinalResults();
    } else {
      const hurrengoa = lortuBesteJokalaria(egoera.unekoJokalaria);
      if (jokalariaPrestDago(hurrengoa)) {
        switchPlayer(hurrengoa);
      } else {
        egoera.amaieraArrazoia = "Denbora amaitu da";
        showFinalResults();
      }
    }

    return true;
  }

  return false;
}

function submitAnswer(eventua) {
  eventua.preventDefault();

  if (egoera.pantaila !== "jokoa") {
    return;
  }

  eguneratuDenbora();

  if (egoera.pantaila !== "jokoa" || lortuUnekoJokalaria().denbora <= 0) {
    return;
  }

  const erantzuna = dom.erantzunaInput.value;

  if (!erantzuna.trim()) {
    ezarriFeedback("Ezin duzu hutsik utzi", "oharra");
    dom.erantzunaInput.focus();
    return;
  }

  const jokalaria = lortuUnekoJokalaria();
  const galdera = lortuGalderak(jokalaria)[jokalaria.unekoIndizea];
  const zuzena = galderarenErantzunaZuzenaDa(erantzuna, galdera);

  if (zuzena) {
    jokalaria.egoerak[jokalaria.unekoIndizea] = "correct";
    jokalaria.asmatuak += 1;
    egoera.feedback = "Erantzun zuzena!";
    egoera.feedbackMota = "zuzena";
    programatuFeedbackGarbitzea();
  } else {
    jokalaria.egoerak[jokalaria.unekoIndizea] = "wrong";
    jokalaria.hutsak += 1;
    egoera.feedback = `Erantzun okerra! Erantzun zuzena: ${galdera.answer}`;
    egoera.feedbackMota = "okerra";
    programatuFeedbackGarbitzea();
  }

  dom.erantzunaInput.value = "";
  moveToNextPendingLetter();

  if (checkEndOfTurn()) {
    return;
  }

  if (zuzena) {
    renderGameScreen();
    gordeEgoera();
    dom.erantzunaInput.focus();
    return;
  }

  const hurrengoa = lortuBesteJokalaria(egoera.unekoJokalaria);

  if (jokalariaPrestDago(hurrengoa)) {
    egoera.aldaketaArrazoia = "Erantzun okerra!";
    switchPlayer(hurrengoa);
    return;
  }

  renderGameScreen();
  gordeEgoera();
  dom.erantzunaInput.focus();
}

function handlePasapalabra() {
  if (egoera.pantaila !== "jokoa") {
    return;
  }

  eguneratuDenbora();

  if (egoera.pantaila !== "jokoa" || lortuUnekoJokalaria().denbora <= 0) {
    return;
  }

  egoera.feedback = "Hitzapasa egin duzu";
  egoera.feedbackMota = "oharra";
  dom.erantzunaInput.value = "";
  moveToNextPendingLetter();

  if (checkEndOfTurn()) {
    return;
  }

  const hurrengoa = lortuBesteJokalaria(egoera.unekoJokalaria);

  if (jokalariaPrestDago(hurrengoa)) {
    egoera.aldaketaArrazoia = "Hitzapasa egin duzu";
    switchPlayer(hurrengoa);
    return;
  }

  renderGameScreen();
  gordeEgoera();
  dom.erantzunaInput.focus();
}

function restartGame() {
  garbituErlojua();
  garbituFeedbackProgramazioa();
  garbituOnlineKontagailua();
  garbituOnlineMugimenduMezuProgramazioa();
  garbituOnlineEguneratzeProgramazioa();
  garbituOnlineHasieraProgramazioa();
  void garbituOnlineRealtimeHarpidetza();
  onlineStartEskatutakoMatchId = "";
  onlineGameKargatutakoMatchId = "";
  onlineTimeoutEskatutakoGakoa = "";
  egoera.pantaila = "hasiera";
  egoera.jokoModua = JOKO_MODUA_GABE;
  egoera.konfigurazioa = {
    topic: "",
    level: "",
  };
  egoera.aukerak = {
    topics: [],
    levels: [],
    roscos: [],
  };
  egoera.kargatzen = {
    topics: false,
    levels: false,
    roscos: false,
    questions: false,
  };
  ezarriHasieraMezua("", "oharra");
  egoera.jokalariak = [];
  egoera.unekoJokalaria = 0;
  egoera.hurrengoJokalaria = null;
  egoera.aurrekoJokalaria = null;
  egoera.feedback = "";
  egoera.feedbackMota = "oharra";
  egoera.aldaketaArrazoia = "";
  egoera.amaieraArrazoia = "";
  egoera.denboraMuga = null;
  egoera.online = sortuOnlineEgoera();
  dom.erantzunaInput.value = "";
  renderStartScreen();
  eguneratuTxandaKoloreak();
  ezabatuBiltegitik(GORDE_GAKOA);
  sessionStorage.removeItem("hitzapasa-egoera-v8");
  sessionStorage.removeItem("hitzapasa-egoera-v9");
  localStorage.removeItem("hitzapasa-egoera-v8");
  localStorage.removeItem("hitzapasa-egoera-v9");
  void kargatuGaiak();
}

function localekoGarapenaDa() {
  const { hostname, protocol } = window.location;
  return (
    protocol === "http:" &&
    (hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]")
  );
}

async function garbituLocalekoServiceWorkerra() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const erregistroak = await navigator.serviceWorker.getRegistrations();
  await Promise.all(erregistroak.map((erregistroa) => erregistroa.unregister()));

  if ("caches" in window) {
    const gakoak = await window.caches.keys();
    await Promise.all(gakoak.map((gakoa) => window.caches.delete(gakoa)));
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      if (localekoGarapenaDa()) {
        garbituLocalekoServiceWorkerra().catch(() => {});
        return;
      }

      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

function lotuOnlineSaioHarpidetza() {
  if (!supabaseKonfiguratutaDago() || !supabase || onlineAuthHarpidetza) {
    return;
  }

  const { data } = supabase.auth.onAuthStateChange((_gertaera, session) => {
    eguneratuOnlineSaioLokala(session);

    if (!session) {
      egoera.online.errorAuth = "";
    }

    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  });

  onlineAuthHarpidetza = data?.subscription ?? null;
}

function lotuGertaerak() {
  dom.hasieraFormulario.addEventListener("submit", (eventua) => {
    eventua.preventDefault();
    void initGame();
  });

  dom.onlineJoinFormulario.addEventListener("submit", (eventua) => {
    eventua.preventDefault();
    void handleJoinMatch();
  });
  dom.onlineTolesBotoia.addEventListener("click", () => {
    egoera.online.onlinePanelTouched = true;
    egoera.online.onlinePanelExpanded = !egoera.online.onlinePanelExpanded;
    renderStartScreen();
    gordeEgoera();
  });

  dom.gaiaSelect.addEventListener("change", () => {
    aukeratuGaia(dom.gaiaSelect.value);
  });

  dom.gaiaTxipak?.addEventListener("click", (event) => {
    const botoia = event.target instanceof Element ? event.target.closest("[data-topic]") : null;

    if (!(botoia instanceof HTMLButtonElement)) {
      return;
    }

    dom.gaiaSelect.value = botoia.dataset.topic ?? "";
    aukeratuGaia(botoia.dataset.topic ?? "");
  });

  dom.mailaSelect.addEventListener("change", () => {
    egoera.konfigurazioa.level = dom.mailaSelect.value;
    egoera.aukerak.roscos = [];
    ezarriOnlineErrorea("create", "");
    ezarriHasieraMezua("", "oharra");

    if (!egoera.konfigurazioa.level) {
      renderStartScreen();
      return;
    }

    void kargatuRoskak(egoera.konfigurazioa.topic, egoera.konfigurazioa.level);
  });
  dom.jokoModuaBakarka.addEventListener("change", () => {
    if (dom.jokoModuaBakarka.checked) {
      ezarriJokoModua(JOKO_MODUA_BAKARKA);
      renderStartScreen();
    }
  });
  dom.jokoModuaBinaka.addEventListener("change", () => {
    if (dom.jokoModuaBinaka.checked) {
      ezarriJokoModua(JOKO_MODUA_BINAKA);
      renderStartScreen();
    }
  });

  dom.onlineRoomCodeInput.addEventListener("input", () => {
    egoera.online.enteredRoomCode = dom.onlineRoomCodeInput.value.toUpperCase();
    ezarriOnlineErrorea("join", "");
    renderStartScreen();
  });

  dom.onlineJokoErantzunaInput.addEventListener("input", () => {
    const erroreaZegoen = Boolean(egoera.online.errorOnlineMove);
    egoera.online.onlineAnswer = dom.onlineJokoErantzunaInput.value;
    egoera.online.errorOnlineMove = "";
    if (erroreaZegoen && egoera.pantaila === "online-jokoa") {
      renderOnlineGameScreen();
    }
  });

  dom.erantzunFormulario.addEventListener("submit", submitAnswer);
  dom.onlineJokoFormulario.addEventListener("submit", (eventua) => {
    void handleSubmitOnlineAnswer(eventua);
  });
  dom.pasapalabraBotoia.addEventListener("click", handlePasapalabra);
  dom.onlineJokoPasapalabraBotoia.addEventListener("click", () => {
    void handleOnlinePasapalabra();
  });
  dom.berrabiaraziBotoia.addEventListener("click", restartGame);
  dom.aldaketaBerrabiaraziBotoia.addEventListener("click", restartGame);
  dom.amaieraBerrabiaraziBotoia.addEventListener("click", restartGame);
  dom.onlineSortuBotoia.addEventListener("click", () => {
    void handleCreateMatch();
  });
  dom.onlineSaioBotoia.addEventListener("click", () => {
    void handleAnonymousLogin();
  });
  dom.onlineSaioaItxiBotoia.addEventListener("click", () => {
    void handleOnlineLogout();
  });
  dom.onlinePrestBotoia.addEventListener("click", () => {
    void handleSetReady();
  });
  dom.onlineEguneratuBotoia.addEventListener("click", () => {
    egoera.online.errorStartMatch = "";
    onlineStartEskatutakoMatchId = "";
    void kargatuOnlineLobbyEgoera();
  });
  dom.onlineLobbyBerrabiaraziBotoia.addEventListener("click", restartGame);
  dom.onlinePrestHasieraraBotoia.addEventListener("click", restartGame);
  dom.onlineJokoBerrabiaraziBotoia.addEventListener("click", restartGame);
  dom.onlineAmaieraBerrabiaraziBotoia.addEventListener("click", restartGame);

  dom.hurrengoTxandaBotoia.addEventListener("click", () => {
    if (egoera.hurrengoJokalaria !== null) {
      egoera.feedback = "";
      egoera.feedbackMota = "oharra";
      startTurn(egoera.hurrengoJokalaria);
    }
  });

  window.addEventListener("resize", () => {
    if (egoera.pantaila === "jokoa") {
      renderRosco();
    }

    if (egoera.pantaila === "online-jokoa") {
      renderOnlineRosco();
    }
  });

  window.addEventListener("beforeunload", gordeEgoera);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && egoera.pantaila === "jokoa") {
      eguneratuDenbora();
      if (egoera.pantaila === "jokoa") {
        renderGameScreen();
      }
    }

    if (
      !document.hidden &&
      (egoera.pantaila === "online-lobby" ||
        egoera.pantaila === "online-prest" ||
        egoera.pantaila === "online-jokoa")
    ) {
      void kargatuOnlineLobbyEgoera(true);
    }
  });
}

function abiatuAplikazioa() {
  eguneratuTxandaKoloreak();
  lotuGertaerak();
  lotuOnlineSaioHarpidetza();
  registerServiceWorker();
  void kargatuOnlineSaioEgoera(true).then(() => {
    if (egoera.pantaila === "hasiera") {
      renderStartScreen();
    }
  });

  if (!kargatuEgoera()) {
    restartGame();
  }
}

abiatuAplikazioa();

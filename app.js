const HASIERAKO_DENBORA = 150;
const GORDE_GAKOA = "hitzapasa-egoera-v5";
const SUPABASE_URL = "https://awdajwrzxceqazmaorxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_USopGmel8SEMUckG1DoXTA_2-O0fQQk";
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const dom = {
  aplikazioa: document.querySelector(".aplikazioa"),
  hasieraPantaila: document.getElementById("hasieraPantaila"),
  jokoPantaila: document.getElementById("jokoPantaila"),
  aldaketaPantaila: document.getElementById("aldaketaPantaila"),
  amaieraPantaila: document.getElementById("amaieraPantaila"),
  hasieraFormulario: document.getElementById("hasieraFormulario"),
  gaiaSelect: document.getElementById("gaiaSelect"),
  hasieraMezua: document.getElementById("hasieraMezua"),
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
};

const egoera = {
  pantaila: "hasiera",
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

function balioaGalderaLerrorako(lerroa, gakoak) {
  for (const gakoa of gakoak) {
    if (lerroa[gakoa] !== undefined && lerroa[gakoa] !== null && `${lerroa[gakoa]}`.trim()) {
      return `${lerroa[gakoa]}`.trim();
    }
  }

  return "";
}

function normalizatuGalderaLerroa(lerroa) {
  const letter = balioaGalderaLerrorako(lerroa, ["letter"]).toUpperCase();
  const clue = balioaGalderaLerrorako(lerroa, ["clue"]);
  const answer = balioaGalderaLerrorako(lerroa, ["answer"]);
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
    mode,
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
  if (!Array.isArray(jokalariak) || jokalariak.length !== 2) {
    throw new Error("Bi jokalari behar dira.");
  }

  const [bat, bi] = jokalariak;

  if (!bat.rosco || !bi.rosco || bat.rosco === bi.rosco) {
    throw new Error("Jokalariek rosko bana eta desberdina behar dute.");
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
      throw new Error("Roskoaren datuak ez datoz bat.");
    }
  });
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

function ezarriHasieraMezua(mezua, mota = "oharra") {
  egoera.hasieraMezua = mezua;
  egoera.hasieraMezuMota = mota;
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
  return indizea === 0 ? 1 : 0;
}

function jokalariaPrestDago(indizea) {
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
  egoera.pantaila = izena;
  dom.hasieraPantaila.classList.toggle("pantaila--aktibo", izena === "hasiera");
  dom.jokoPantaila.classList.toggle("pantaila--aktibo", izena === "jokoa");
  dom.aldaketaPantaila.classList.toggle("pantaila--aktibo", izena === "aldaketa");
  dom.amaieraPantaila.classList.toggle("pantaila--aktibo", izena === "amaiera");
}

function ezarriFeedback(mezua, mota = "oharra") {
  egoera.feedback = mezua;
  egoera.feedbackMota = mota;
  dom.feedbackMezua.textContent = mezua;
  dom.feedbackMezua.className = `feedbacka feedbacka--${mota}`;
}

function ezarriSelectAukerak(selecta, aukerak, placeholder) {
  selecta.innerHTML = "";

  const lehenAukera = document.createElement("option");
  lehenAukera.value = "";
  lehenAukera.textContent = placeholder;
  selecta.appendChild(lehenAukera);

  aukerak.forEach((aukera) => {
    const aukeraElementua = document.createElement("option");
    aukeraElementua.value = aukera;
    aukeraElementua.textContent = aukera;
    selecta.appendChild(aukeraElementua);
  });
}

function renderStartScreen() {
  erakutsiPantaila("hasiera");

  ezarriSelectAukerak(
    dom.gaiaSelect,
    egoera.aukerak.topics,
    egoera.kargatzen.topics ? "Kargatzen..." : "Aukeratu gaia",
  );
  dom.gaiaSelect.value = egoera.konfigurazioa.topic;
  dom.gaiaSelect.disabled = egoera.kargatzen.topics || egoera.aukerak.topics.length === 0;

  dom.hasieraMezua.textContent = egoera.hasieraMezua;
  dom.hasieraMezua.className = `hasiera-mezua hasiera-mezua--${egoera.hasieraMezuMota}`;
  dom.hasiJokoaBotoia.disabled =
    !konfigurazioaOsatuta() || hautapenakKargatzenDira() || egoera.aukerak.roscos.length < 2;
  dom.hasiJokoaBotoia.textContent = egoera.kargatzen.questions ? "Kargatzen..." : "Hasi jokoa";
}

async function kargatuGaiak() {
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
    egoera.aukerak.topics = aukerakBakarrik(datuak, "topic");

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
    const datuak = await eginSupabaseEskaera("level", { active: true, topic }, "level");

    if (egoera.konfigurazioa.topic !== topic) {
      return;
    }

    egoera.aukerak.levels = aukerakBakarrik(datuak, "level");

    if (egoera.aukerak.levels.length === 0) {
      ezarriHasieraMezua("Ez dago daturik", "okerra");
      return;
    }

    if (egoera.aukerak.levels.length > 1) {
      ezarriHasieraMezua("Maila bat baino gehiago daude", "okerra");
      return;
    }

    [egoera.konfigurazioa.level] = egoera.aukerak.levels;
    ezarriHasieraMezua("", "oharra");
    await kargatuRoskak(topic, egoera.konfigurazioa.level);
    return;
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
    const datuak = await eginSupabaseEskaera(
      "rosco",
      { active: true, topic, level },
      "rosco",
    );

    if (egoera.konfigurazioa.topic !== topic || egoera.konfigurazioa.level !== level) {
      return;
    }

    egoera.aukerak.roscos = aukerakBakarrik(datuak, "rosco");

    if (egoera.aukerak.roscos.length < 2) {
      ezarriHasieraMezua("Ez dago nahikoa roskorik", "okerra");
    } else {
      ezarriHasieraMezua("", "oharra");
    }
  } catch (_errorea) {
    egoera.aukerak.roscos = [];
    ezarriHasieraMezua("Ezin izan dira roskoak kargatu", "okerra");
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

function renderJokalariTxartela(indizea) {
  const txartela = indizea === 0 ? dom.jokalariTxartela0 : dom.jokalariTxartela1;
  const jokalaria = egoera.jokalariak[indizea];
  const aktiboa = egoera.pantaila === "jokoa" && indizea === egoera.unekoJokalaria;
  const pendienteak = kalkulatuPendienteak(jokalaria);

  txartela.classList.toggle("jokalari-txartela--aktiboa", aktiboa);
  txartela.innerHTML = `
    <div>
      <p class="etiketa">${aktiboa ? "Uneko txanda" : "Jokalaria"}</p>
      <h3 class="jokalari-izena">${jokalaria.izena}</h3>
      <p class="jokalari-roskoa">Roskoa: ${jokalaria.rosco}</p>
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
  if (egoera.jokalariak.length !== 2) {
    return;
  }

  renderJokalariTxartela(0);
  renderJokalariTxartela(1);

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
  const irabazlea = kalkulatuIrabazlea();
  dom.irabazleaIzenburua.textContent =
    irabazlea === "Berdinketa" ? "Berdinketa" : `Irabazlea: ${irabazlea}`;

  dom.azkenEmaitzak.innerHTML = egoera.jokalariak
    .map((jokalaria) => {
      const pendienteak = kalkulatuPendienteak(jokalaria);
      return `
        <article>
          <h3>${jokalaria.izena}</h3>
          <p class="amaiera-roskoa">Roskoa: ${jokalaria.rosco}</p>
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
    localStorage.removeItem(GORDE_GAKOA);
    return;
  }

  localStorage.setItem(
    GORDE_GAKOA,
    JSON.stringify({
      pantaila: egoera.pantaila,
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
    }),
  );
}

function kargatuEgoera() {
  const gordea = localStorage.getItem(GORDE_GAKOA);

  if (!gordea) {
    return false;
  }

  try {
    const datuak = JSON.parse(gordea);

    if (
      !Array.isArray(datuak.jokalariak) ||
      datuak.jokalariak.length !== 2 ||
      !datuak.konfigurazioa?.topic ||
      !datuak.konfigurazioa?.level
    ) {
      localStorage.removeItem(GORDE_GAKOA);
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
      localStorage.removeItem(GORDE_GAKOA);
      return false;
    }

    egoera.konfigurazioa = {
      topic: datuak.konfigurazioa.topic,
      level: datuak.konfigurazioa.level,
    };
    egoera.jokalariak = datuak.jokalariak;
    egoera.unekoJokalaria = datuak.unekoJokalaria ?? 0;
    egoera.hurrengoJokalaria = datuak.hurrengoJokalaria ?? null;
    egoera.aurrekoJokalaria = datuak.aurrekoJokalaria ?? null;
    egoera.feedback = datuak.feedback ?? "";
    egoera.feedbackMota = datuak.feedbackMota ?? "oharra";
    egoera.aldaketaArrazoia = datuak.aldaketaArrazoia ?? "";
    egoera.amaieraArrazoia = datuak.amaieraArrazoia ?? "";
    egoera.denboraMuga = datuak.denboraMuga ?? null;

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
    localStorage.removeItem(GORDE_GAKOA);
  }

  return false;
}

async function initGame() {
  if (!konfigurazioaOsatuta() || hautapenakKargatzenDira()) {
    ezarriHasieraMezua("Aukeraketa osatu behar duzu", "okerra");
    renderStartScreen();
    return;
  }

  if (egoera.aukerak.roscos.length < 2) {
    ezarriHasieraMezua("Ez dago nahikoa roskorik", "okerra");
    renderStartScreen();
    return;
  }

  garbituErlojua();

  const izena1 = dom.jokalari1Izena.value.trim() || "1. jokalaria";
  const izena2 = dom.jokalari2Izena.value.trim() || "2. jokalaria";

  egoera.kargatzen.questions = true;
  ezarriHasieraMezua("Kargatzen...", "oharra");
  renderStartScreen();

  try {
    const { rosco1, rosco2, galderak1, galderak2 } = await kargatuBiJokalarienGalderak();
    egoera.jokalariak = [
      sortuJokalaria(izena1, rosco1, galderak1),
      sortuJokalaria(izena2, rosco2, galderak2),
    ];
    egiaztatuJokalarienRoskak(egoera.jokalariak, egoera.konfigurazioa);
  } catch (errorea) {
    egoera.jokalariak = [];
    ezarriHasieraMezua(
      errorea instanceof Error && errorea.message === "rosko-gutxiegi"
        ? "Ez dago nahikoa roskorik"
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
    egoera.feedback = "Roskoa osatu duzu";
    egoera.feedbackMota = "zuzena";
    egoera.amaieraArrazoia = "Roskoa osatu duzu";
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
  const zuzena =
    normalizatuErantzuna(erantzuna) === normalizatuErantzuna(galdera.answer);

  if (zuzena) {
    jokalaria.egoerak[jokalaria.unekoIndizea] = "correct";
    jokalaria.asmatuak += 1;
    egoera.feedback = "Erantzun zuzena!";
    egoera.feedbackMota = "zuzena";
  } else {
    jokalaria.egoerak[jokalaria.unekoIndizea] = "wrong";
    jokalaria.hutsak += 1;
    egoera.feedback = "Erantzun okerra!";
    egoera.feedbackMota = "okerra";
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
  egoera.pantaila = "hasiera";
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
  dom.erantzunaInput.value = "";
  renderStartScreen();
  eguneratuTxandaKoloreak();
  localStorage.removeItem(GORDE_GAKOA);
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

function lotuGertaerak() {
  dom.hasieraFormulario.addEventListener("submit", (eventua) => {
    eventua.preventDefault();
    void initGame();
  });

  dom.gaiaSelect.addEventListener("change", () => {
    egoera.konfigurazioa.topic = dom.gaiaSelect.value;
    egoera.konfigurazioa.level = "";
    egoera.aukerak.levels = [];
    egoera.aukerak.roscos = [];
    ezarriHasieraMezua("", "oharra");

    if (!egoera.konfigurazioa.topic) {
      renderStartScreen();
      return;
    }

    void kargatuMailak(egoera.konfigurazioa.topic);
  });

  dom.erantzunFormulario.addEventListener("submit", submitAnswer);
  dom.pasapalabraBotoia.addEventListener("click", handlePasapalabra);
  dom.berrabiaraziBotoia.addEventListener("click", restartGame);
  dom.aldaketaBerrabiaraziBotoia.addEventListener("click", restartGame);
  dom.amaieraBerrabiaraziBotoia.addEventListener("click", restartGame);

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
  });

  window.addEventListener("beforeunload", gordeEgoera);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && egoera.pantaila === "jokoa") {
      eguneratuDenbora();
      if (egoera.pantaila === "jokoa") {
        renderGameScreen();
      }
    }
  });
}

function abiatuAplikazioa() {
  eguneratuTxandaKoloreak();
  lotuGertaerak();
  registerServiceWorker();

  if (!kargatuEgoera()) {
    restartGame();
  }
}

abiatuAplikazioa();

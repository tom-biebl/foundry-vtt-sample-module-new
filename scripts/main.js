/**
 * Hello Foundry - Ein einfaches Beispiel-Modul fuer Foundry VTT v13
 *
 * Dieses Modul demonstriert die wichtigsten Grundlagen der Modul-Entwicklung:
 *  - Hooks verwenden (init, ready, chatMessage)
 *  - Einstellungen registrieren (game.settings.register)
 *  - Auf Chat-Befehle reagieren (/hello)
 *  - Lokalisierung mit game.i18n.localize
 *  - Chat-Nachrichten erzeugen (ChatMessage.create)
 */

// Die Modul-ID - muss exakt der "id" aus der module.json entsprechen
const MODULE_ID = "foundry-vtt-sample-module-new";

/* -------------------------------------------- */
/*  Hook: init                                  */
/*  Wird ganz am Anfang ausgefuehrt.            */
/*  Hier registriert man Einstellungen.         */
/* -------------------------------------------- */
Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init hook - Modul wird initialisiert`);

  // Eine einfache Welt-Einstellung: der Gruss-Text
  game.settings.register(MODULE_ID, "greeting", {
    name: "HELLO_FOUNDRY.Settings.Greeting.Name",
    hint: "HELLO_FOUNDRY.Settings.Greeting.Hint",
    scope: "world",       // "world" = fuer alle Spieler, "client" = pro Client
    config: true,          // true = im Settings-Menue sichtbar
    type: String,
    default: "Hallo Welt!"
  });

  // Eine Client-Einstellung: soll der Befehl laut (public) oder leise (whisper) antworten?
  game.settings.register(MODULE_ID, "whisperMode", {
    name: "HELLO_FOUNDRY.Settings.Whisper.Name",
    hint: "HELLO_FOUNDRY.Settings.Whisper.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });
});

/* -------------------------------------------- */
/*  Hook: ready                                 */
/*  Wird ausgefuehrt wenn Foundry voll geladen  */
/*  ist. Gut fuer Begruessungs-Nachrichten.     */
/* -------------------------------------------- */
Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | ready hook - Spiel ist bereit!`);
  ui.notifications.info(game.i18n.localize("HELLO_FOUNDRY.Notifications.Ready"));
});

/* -------------------------------------------- */
/*  Hook: chatMessage                           */
/*  Wird ausgefuehrt BEVOR eine Chat-Nachricht  */
/*  abgesendet wird. Wenn wir false             */
/*  zurueckgeben, wird die Original-Nachricht   */
/*  nicht gepostet.                             */
/* -------------------------------------------- */
Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
  // Pruefen ob der Text mit "/hello" beginnt
  const trimmed = messageText.trim();
  if (!trimmed.toLowerCase().startsWith("/hello")) return true;

  // Alles nach "/hello" ist optionaler Name-Parameter
  const argument = trimmed.slice("/hello".length).trim();

  // Gespeicherten Gruss-Text aus den Settings laden
  const greeting = game.settings.get(MODULE_ID, "greeting");

  // Nachricht zusammenbauen
  const targetName = argument.length > 0 ? argument : game.user.name;
  const content = `<p><strong>${greeting}</strong> ${targetName}!</p>`;

  // Soll als Whisper oder oeffentlich?
  const whisper = game.settings.get(MODULE_ID, "whisperMode");

  const messageData = {
    content: content,
    speaker: ChatMessage.getSpeaker({ user: game.user })
  };

  if (whisper) {
    // Nur an den Absender fluestern
    messageData.whisper = [game.user.id];
  }

  ChatMessage.create(messageData);

  // false -> Original-Nachricht ("/hello ...") wird NICHT gepostet
  return false;
});
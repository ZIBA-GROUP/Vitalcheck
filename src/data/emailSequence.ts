export interface EmailItem {
  number: number;
  day: string;
  trigger: string;
  subjectLines: string[];
  previewText: string;
  headline: string;
  frameworkFocus: string;
  bodyMarkdown: string;
  ctaText: string;
  ctaUrlPlaceholder: string;
}

export interface EmailCampaignStrategy {
  analysis: string;
  decision: string;
  expert: 'HALBERT' | 'OGILVY' | 'SCHWARTZ' | 'SUGARMAN' | 'WIEBE';
  targetAudience: string;
  corePain: string;
  solution: string;
  emails: EmailItem[];
}

export const OMNI_COPY_STRATEGY: EmailCampaignStrategy = {
  analysis: 'Die Zielgruppe leidet unter quälender Tagesmüdigkeit, schleichender Übersäuerung, diffusem Gedanken-Chaos und Frustration über stagnierende Energie trotz Bemühungen. Es handelt sich um einen tief sitzenden, emotionalen B2C-Schmerzpunkt mit hohem Leidensdruck und dem dringenden Wunsch nach spürbarer Erleichterung und Klarheit.',
  decision: 'Ich habe mich für GARY HALBERT entschieden, weil sein schonungslos ehrlicher, emotional packender und hochgradig persönlicher Direct-Response-Stil den Betroffenen dort abholt, wo der Schuh drückt, und ihn ohne Umwege vom bloßen Ausfüllen des Tests in ein persönliches Auswertungsgespräch bewegt.',
  expert: 'HALBERT',
  targetAudience: 'Menschen (Männer & Frauen), die sich kraftlos, gestresst oder überlastet fühlen, unter Verdauungs-/Gewichtsproblemen leiden und ihre Vitalität zurückholen wollen.',
  corePain: 'Chronische Müdigkeit, Gedanken-Chaos, Energielosigkeit ab 14 Uhr, Heißhunger und das Gefühl, im eigenen Körper festzustecken.',
  solution: 'Individuelle Vitalitätsauswertung der 69 Check-Punkte + persönlicher 1:1 Fahrplan von Julia & Jens zur Zellregeneration und Säure-Basen-Balance.',
  emails: [
    {
      number: 1,
      day: 'Tag 0',
      trigger: 'Sofort nach Absenden des Vitalchecks (Willkommen & Bestätigung)',
      subjectLines: [
        'Deine Vitalanalyse ist eingegangen (+ wichtige Notiz von Julia & Jens)',
        'Erhalt bestätigt: Das passiert jetzt mit deinen Vitalwerten',
      ],
      previewText: 'Wir haben deine Antworten erhalten und prüfen deine Werte jetzt im Detail...',
      headline: 'ERST EINMAL: RESPEKT FÜR DIESEN ENTSCHEIDENDEN SCHRITT.',
      frameworkFocus: 'Halbert The Hook & Immediate Relief: Validierung der Entscheidung und Neugier auf die Ergebnisse.',
      bodyMarkdown: `Hallo {VORNAME},

wenn du diese Zeilen liest, ist dein Vitalcheck sicher bei uns eingetroffen.

Ganz ehrlich? 

Die meisten Menschen schleppen sich tagein, tagaus durchs Leben. Sie akzeptieren die bleierne Müdigkeit um 14 Uhr, die Magenschmerzen nach dem Essen und das nagende Gefühl, nur noch mit halber Kraft zu funktionieren.

Sie tun nichts.

Du hast gerade etwas getan. Du hast dir ein paar Minuten Zeit genommen und in den Spiegel deiner Gesundheit geschaut. Dafür hast du unseren größten Respekt.

---

### WAS JETZT HINTER DEN KULISSEN PASSIERT:

Wir werfen keinen seelenlosen Computer-Algorithmus an. 

Julia und ich schauen uns deine Antworten in den Kernbereichen persönlich an:
- Deine Energie- und Regenerationskurve
- Den Zustand deines Säure-Basen-Haushalts
- Die Belastungssignale deines Darms und Stoffwechsels

In den nächsten 24 bis 48 Stunden bereiten wir deine persönliche Vitalauswertung vor.

Halte dein Postfach und dein Handy im Auge – wir melden uns direkt bei dir mit den ersten konkreten Erkenntnissen.

---`,
      ctaText: '👉 MEINE AUSWERTUNG BEI JULIA & JENS PRIORISIEREN',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 2,
      day: 'Tag 1',
      trigger: '24 Stunden nach Eintragung',
      subjectLines: [
        'Die bittere Wahrheit über das "14-Uhr-Koma" (und warum Kaffee lügt)',
        '{VORNAME}, kennst du das Gefühl, nur noch zu funktionieren?',
      ],
      previewText: 'Warum das Problem nicht dein Wille ist, sondern ein biochemischer Hilferuf...',
      headline: 'WARUM DICH DEIN WEISSES BLUT NICHT WEITERBRINGT.',
      frameworkFocus: 'The Visceral Pain Amplification: Schmerz schonungslos spürbar machen und falsche Glaubenssätze auflösen.',
      bodyMarkdown: `Hallo {VORNAME},

lass mich dir eine ehrliche Frage stellen:

Wie oft hast du in den letzten Wochen nachmittags auf die Uhr gestarrt und gedacht: 
*"Ich brauche JETZT dringend noch einen Kaffee, sonst schlafe ich im Stehen ein"?*

Die meisten denken, das sei normal. "Man wird halt älter", "Der Job ist stressig", "Das Wetter drückt".

BULLSHIT.

Es ist NICHT normal, sich mit 30, 40 oder 50 Jahren wie ein ausgelaugter Akku zu fühlen.

---

### DER TEUFELSKREIS, IN DEM 90% FESTSTECKEN:

Wenn deine Zellen vor lauter Säuren und Stoffwechselschlacken nicht mehr atmen können, hilft dir die dritte Tasse Espresso genauso viel wie ein Tritt aufs Gaspedal bei leerem Tank.

Du peitschst deinen müden Motor nur noch weiter aus.

Das Ergebnis?
- Nervosität und innere Unruhe
- Heißhunger auf Süßes um 16 Uhr
- Ein unruhiger Schlaf, aus dem du wie gerädert aufwachst

Deine Antworten in unserem Vitalcheck haben uns genau gezeigt, an welchen 2 Schrauben du drehen musst, damit dein Motor wieder schnurrt.

---`,
      ctaText: '👉 JETZT DIE ERSTEN SCHRITTE ZU DEINER VOLLEN KRAFT ANSEHEN',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 3,
      day: 'Tag 2',
      trigger: '48 Stunden nach Eintragung',
      subjectLines: [
        'Deine persönliche Vital-Auswertung liegt bereit ({VORNAME})',
        'Hier sind deine Resultate: Wo dein Körper gerade Energie verliert',
      ],
      previewText: 'Wir haben deine 69 Punkte analysiert. Das Ergebnis hat ein klares Muster...',
      headline: 'DEINE ERGEBNISSE LIEGEN AUF UNSEREM TISCH.',
      frameworkFocus: 'The Big Reveal: Das greifbare Resultat überreichen und den aha-Moment erzeugen.',
      bodyMarkdown: `Hallo {VORNAME},

wir haben deinen Vitalcheck Punkt für Punkt durchgearbeitet.

Und ohne dir Angst zu machen, aber mit absoluter Klarheit:

Es gibt einen ganz konkreten Grund, warum du deine 3 großen Ziele bisher noch nicht mühelos erreicht hast. Dein Körper kämpft an einer Front, die du von außen gar nicht sehen kannst: **in deinen Zellen und im Darm.**

Wenn dein Säure-Basen-Gleichgewicht aus den Fugen geraten ist, lagert der Körper Säuren im Bindegewebe und in den Gelenken ab.

---

### DEIN VITAL-STATUS AUF EINEN BLICK:

- **Energie-Reserve:** Erfordert gezielte Entlastung
- **Zelluläre Regeneration:** Blockiert durch Alltagsübersäuerung
- **Darm-Milieu:** Braucht dringend bioverfügbare Nährstoffe statt leere Kalorien

Das Gute daran?

Sobald du an der RICHTIGEN Stelle ansetzt, reagiert der menschliche Körper mit atemberaubender Geschwindigkeit. Mehr Energie in 7 bis 14 Tagen ist kein Zauberwerk – es ist reine Biochemie.

---`,
      ctaText: '👉 MEINE DETAIL-AUSWERTUNG IM 1:1 GESPRÄCH BESPRECHEN (KOSTENLOS)',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 4,
      day: 'Tag 3',
      trigger: '72 Stunden nach Eintragung',
      subjectLines: [
        'Wie Markus in 21 Tagen 6 kg verlor und seinen Schlaf zurückholte',
        'Vom Couch-Koma zur puren Lebensfreude: Eine wahre Geschichte',
      ],
      previewText: 'Er dachte auch, er hätte schon alles probiert – bis er diese 3 Hebel umlegte...',
      headline: 'ER DACHTE, SEIN STOFFWECHSEL WÄRE "EINFACH KAPUTT".',
      frameworkFocus: 'The Proof & Social Evidence: Dramatische Case-Study aus dem wahren Leben.',
      bodyMarkdown: `Hallo {VORNAME},

kennst du Markus? 46 Jahre alt, leitender Angestellter, 2 Kinder.

Als Markus vor 6 Monaten unseren Vitalcheck ausfüllte, sah sein Formular fast genauso aus wie deines:
- Tagsüber völlig platt
- Sodbrennen nach deftigem Essen
- Gewicht ging trotz Diäten stur nach oben
- Und abends vor dem Fernseher sofort weggenickt

Er sagte mir damals am Telefon: 
*"Jens, ich glaube, mein Stoffwechsel ist einfach im Eimer. Ich habe schon Low-Carb, Intervallfasten und teure Shakes probiert. Nichts bringt dauerhaft was."*

---

### WAS WIR ANDERS GEMACHT HABEN:

Wir haben ihm keine quälende Diät verordnet. Wir haben Markus nicht ins Fitnessstudio gejagt.

Wir haben zuerst seine **Zellatmung befreit** und seinen **Darm entsäuert**.

Das Resultat nach nur 3 Wochen?
- Morgens vor dem Wecker wach – voller Tatendrang
- Das Sodbrennen: restlos verschwunden
- 4,2 kg reines Depotfett verloren – ganz ohne Hungern
- Seine Frau fragte ihn, was plötzlich mit ihm los sei

Markus ist kein Einzelfall. Wenn du dem Körper gibst, was er auf Zellebene braucht, repariert er sich selbst.

---`,
      ctaText: '👉 ICH WILL GENAU DIESEN TRANSFORMATION-PLAN FÜR MICH',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 5,
      day: 'Tag 4',
      trigger: '96 Stunden nach Eintragung',
      subjectLines: [
        'Die 3 teuersten Fehler, wenn du deine Energie zurückwillst',
        'Bitte mach diesen Fehler aus der Apotheke nicht...',
      ],
      previewText: 'Warum synthetische Vitamintabletten oft mehr schaden als nützen...',
      headline: 'WAS DIR DIE WERBUNG BEWUSST VERSCHWEIGT.',
      frameworkFocus: 'Overcoming The False Solutions: Konkurrenz und falsche Methoden entwaffnen.',
      bodyMarkdown: `Hallo {VORNAME},

wenn Menschen spüren, dass ihr Körper schlappmacht, machen fast alle dieselben drei gravierenden Fehler:

---

### FEHLER #1: SYNTHETISCHE VITAMINE AUS DEM DROGERIEMARKT
Brausetabletten für 99 Cent klingen verlockend. Aber dein Darm kann künstlich hergestellte Monostoffe kaum aufnehmen. Das meiste landet buchstäblich in der Kloschüssel – teurer Urin, sonst nichts.

### FEHLER #2: NOCH MEHR KAFFEE & ENERGY-DRINKS
Koffein gibt dir keine neue Energie. Es leiht sich nur Energie aus deiner Zukunft – mit hohen Zinsen. Deine Nebennieren brennen aus, und das Loch am Nachmittag wird von Tag zu Tag tiefer.

### FEHLER #3: DIE "ICH-WARTE-NOCH-EIN-BISSCHEN"-FALLE
Ein kleiner Brand im Dachstuhl löscht sich nicht von alleine. Je länger dein Körper gegen Übersäuerung und Nährstoffmangel ankämpft, desto lauter werden die Alarmsignale (Gelenke, Haut, Schlaf, Gewicht).

---

Wir zeigen dir den direkten, natürlichen Weg: Zellreine Nährstoffe, die dein Körper sofort erkennt und aufsaugt.

---`,
      ctaText: '👉 DEINEN NATÜRLICHEN VITAL-FAHRPLAN SICHERN',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 6,
      day: 'Tag 5',
      trigger: '120 Stunden nach Eintragung',
      subjectLines: [
        'Offene Frage zu deinen Vital-Zielen ({VORNAME})',
        'Hast du dir deine Auswertung schon angesehen?',
      ],
      previewText: 'Wir haben uns für diese Woche noch 3 Terminfenster freigehalten...',
      headline: 'WAS STEHT DIR JETZT NOCH IM WEG?',
      frameworkFocus: 'The Honest Consultation Offer: Einwandbehandlung & nahbare Einladung zum Gespräch.',
      bodyMarkdown: `Hallo {VORNAME},

wir wissen genau, wie voll der Alltag ist.

Zwischen Beruf, Familie, Terminen und Verpflichtungen bleibt die eigene Gesundheit oft auf der Strecke. Man schiebt es auf nächste Woche, nächsten Monat oder "nach dem Urlaub".

Aber Hand aufs Herz:

Wann, wenn nicht JETZT, ist der richtige Zeitpunkt, um dich in deiner eigenen Haut wieder uneingeschränkt wohl, leicht und energiegeladen zu fühlen?

---

### DEIN KOSTENFREIES VITAL-FEEDBACK-GESPRÄCH (15-20 MINUTEN):

In diesem kurzen Zoom-Call oder Telefonat gehen Julia oder ich mit dir deine Vitalcheck-Ergebnisse durch:
1. Wo verliert dein Körper aktuell die meiste Kraft?
2. Welche 2 simplen Hebel bringen dir in den ersten 7 Tagen spürbar mehr Elan?
3. Wie sieht ein alltagstauglicher Schritt-für-Schritt-Plan aus, der zu DEINEM Leben passt?

Kein Verkaufsdruck, kein Fachchinesisch. Einfach zwei Menschen, die Klartext über deine Vitalität reden.

---`,
      ctaText: '👉 HIER MEINEN WUNSCHTERMIN KOSTENLOS RESERVIEREN',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
    {
      number: 7,
      day: 'Tag 6',
      trigger: '144 Stunden nach Eintragung (Letzte Chance & Ultimatum)',
      subjectLines: [
        'Letzte Erinnerung: Deine Vitalanalyse wird archiviert',
        'Schließen wir deine Akte, {VORNAME}?',
      ],
      previewText: 'Wir können deine Auswertung nicht unbegrenzt aktiv vorhalten...',
      headline: 'ZWEI WEGE LIEGEN VOR DIR.',
      frameworkFocus: 'The Halbert Fork-In-The-Road Ultimatum: Klarer Scheideweg und finale Dringlichkeit.',
      bodyMarkdown: `Hallo {VORNAME},

dies ist unsere vorerst letzte Nachricht an dich bezüglich deines Vitalchecks.

Weil wir jede Auswertung individuell vorbereiten und unsere Gesprächszeit begrenzt ist, archivieren wir unbearbeitete Analysen nach 7 Tagen.

Du stehst heute vor einer ganz einfachen Wahl:

---

### WEG A: ALLES BLEIBT, WIE ES IST.
Du klickst diese E-Mail weg. Morgen klingelt der Wecker, du fühlst dich genauso gerädert wie heute. Um 14 Uhr kommt das gewohnte Tief. Dein Körper sendet weiter dieselben Alarmsignale – und in 6 Monaten bist du genau an demselben Punkt. Nur ein halbes Jahr müder.

### WEG B: DU NIMMST DEINE GESUNDHEIT JETZT IN DIE HAND.
Du nimmst dir 15 Minuten Zeit für dich selbst. Du erfährst haargenau, wie du deine Zellenergie entfesselst, deinen Schlaf vertiefst und dein Wunschgewicht mit Leichtigkeit erreichst.

---

Die Entscheidung liegt ganz bei dir. Wir sind für dich da, wenn du bereit für echte Vitalität bist.

Herzliche Grüße,
Julia & Jens

---`,
      ctaText: '👉 JETZT DIE CHANCE NUTZEN UND TERMIN SICHERN',
      ctaUrlPlaceholder: 'https://deinedomain.de/termin-vitalanalyse',
    },
  ],
};

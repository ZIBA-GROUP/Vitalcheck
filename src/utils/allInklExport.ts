export function generateAllInklPhpScript(notificationEmail = 'zirkelbachklaus@gmail.com', webhookUrl = ''): string {
  return `<?php
/**
 * All-Inkl Vitalcheck Formular-Verarbeitung & E-Mail-Marketing-Bridge
 * Entwickelt für Apache/PHP auf All-Inkl.com Servern
 */

// Sicherheits-Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Nur POST-Anfragen erlaubt"]);
    exit;
}

// Eingabedaten auslesen (unterstützt JSON-Body und Standard POST)
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Kernfelder validieren
$name  = htmlspecialchars(trim($data['fullName'] ?? $data['contact']['fullName'] ?? 'Unbekannt'));
$email = filter_var(trim($data['email'] ?? $data['contact']['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars(trim($data['phone'] ?? $data['contact']['phone'] ?? ''));

if (!$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ungültige E-Mail-Adresse"]);
    exit;
}

// Konfiguration
$toEmail = "${notificationEmail}"; // Deine Benachrichtigungsadresse
$subject = "Neuer Vitalcheck eingegangen: " . $name;
$senderMail = "noreply@" . $_SERVER['SERVER_NAME'];

// HTML-E-Mail an Coach erstellen
$messageBody = "
<html>
<head>
  <title>Neuer Vitalcheck</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 20px; }
    .card { background-color: #1c2541; border: 1px solid #3a506b; border-radius: 8px; padding: 24px; max-width: 650px; margin: 0 auto; }
    h2 { color: #48cae4; border-bottom: 2px solid #0077b6; padding-bottom: 10px; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    td { padding: 8px 12px; border-bottom: 1px solid #2b3a55; }
    .label { font-weight: bold; color: #90e0ef; width: 40%; }
    .badge { background: #0077b6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class='card'>
    <h2>🌿 Neuer Vitalcheck eingegangen!</h2>
    <p>Ein neuer Teilnehmer hat den Vitalcheck auf <strong>" . htmlspecialchars($_SERVER['SERVER_NAME']) . "</strong> ausgefüllt.</p>
    <table>
      <tr><td class='label'>Vollständiger Name:</td><td><strong>" . $name . "</strong></td></tr>
      <tr><td class='label'>E-Mail:</td><td><a href='mailto:" . $email . "' style='color: #48cae4;'>" . $email . "</a></td></tr>
      <tr><td class='label'>Telefon / Mobil:</td><td>" . $phone . "</td></tr>
      <tr><td class='label'>Geburtsdatum:</td><td>" . htmlspecialchars($data['birthDate'] ?? $data['contact']['birthDate'] ?? '-') . "</td></tr>
      <tr><td class='label'>Wohnort:</td><td>" . htmlspecialchars($data['zipCity'] ?? $data['contact']['zipCity'] ?? '-') . "</td></tr>
      <tr><td class='label'>Empfohlen durch:</td><td>" . htmlspecialchars($data['referralPerson'] ?? '-') . "</td></tr>
      <tr><td class='label'>Energielevel:</td><td><span class='badge'>" . htmlspecialchars($data['energyLevel'] ?? '-') . "</span></td></tr>
      <tr><td class='label'>3 Große Ziele:</td><td>" . nl2br(htmlspecialchars($data['top3Goals'] ?? '-')) . "</td></tr>
      <tr><td class='label'>Sport / Frequenz:</td><td>" . htmlspecialchars($data['sportFrequency'] ?? '-') . "</td></tr>
      <tr><td class='label'>Raucher:</td><td>" . htmlspecialchars($data['smoker'] ?? '-') . "</td></tr>
    </table>
    <p style='margin-top: 20px; font-size: 13px; color: #8da9c4;'>Eingegangen am: " . date("d.m.Y H:i:s") . " Uhr</p>
  </div>
</body>
</html>
";

$headers  = "MIME-Version: 1.0\\r\\n";
$headers .= "Content-type: text/html; charset=UTF-8\\r\\n";
$headers .= "From: Vitalcheck System <" . $senderMail . ">\\r\\n";
$headers .= "Reply-To: " . $email . "\\r\\n";

// 1. E-Mail versenden
$mailSent = @mail($toEmail, $subject, $messageBody, $headers);

// 2. In lokaler CSV-Datei auf All-Inkl Server sichern
$csvFile = __DIR__ . '/vitalcheck_leads_secure.csv';
$isNewFile = !file_exists($csvFile);
$fp = fopen($csvFile, 'a');
if ($fp) {
    if ($isNewFile) {
        fputcsv($fp, ['Datum', 'Name', 'E-Mail', 'Telefon', 'Geburtsdatum', 'Wohnort', 'Empfohlen durch', 'Energielevel', 'Ziele'], ';');
    }
    fputcsv($fp, [
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $phone,
        $data['birthDate'] ?? '',
        $data['zipCity'] ?? '',
        $data['referralPerson'] ?? '',
        $data['energyLevel'] ?? '',
        $data['top3Goals'] ?? ''
    ], ';');
    fclose($fp);
}

// 3. Optional: Weiterleitung an E-Mail-Marketing-Webhook (Klick-Tipp, Brevo, Make, Zapier)
$webhookUrl = "${webhookUrl}";
$webhookStatus = null;
if (!empty($webhookUrl) && filter_var($webhookUrl, FILTER_VALIDATE_URL)) {
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'event' => 'vitalcheck_submitted',
        'data' => $data,
        'timestamp' => date('c')
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    $webhookStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
}

echo json_encode([
    "success" => true,
    "message" => "Vielen Dank! Deine Vitaldaten wurden erfolgreich übermittelt.",
    "mailSent" => $mailSent,
    "webhookStatus" => $webhookStatus
]);
?>`;
}

export function generateAllInklHtaccess(): string {
  return `# All-Inkl Apache Konfiguration für Vitalcheck Landingpage
RewriteEngine On

# HTTPS erzwingen
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# UTF-8 Standard-Zeichensatz
AddDefaultCharset UTF-8

# Schutz für CSV-Leaddatei
<Files "vitalcheck_leads_secure.csv">
    Order Allow,Deny
    Deny from all
</Files>

# GZIP Kompression für schnelle Ladezeiten
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caching für statische Assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>

# Single Page App Routing (leitet alle Routen auf index.html weiter)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
`;
}

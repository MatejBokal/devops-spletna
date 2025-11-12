<?php
// api/register.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';


$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?? $_POST;

$firstName = sanitizeString($data['first_name'] ?? '');
$lastName  = sanitizeString($data['last_name'] ?? '');
$email     = sanitizeString($data['email'] ?? '');
$password  = $data['password'] ?? '';
$confirm   = $data['confirm_password'] ?? '';

$errors = [];
if ($firstName === '' || $lastName === '') {
    $errors[] = "Ime in priimek sta obvezna polja.";
}
if (!validateEmail($email)) {
    $errors[] = "Prosim, vnesite veljaven e‐poštni naslov.";
}
if (strlen($password) < 6) {
    $errors[] = "Geslo mora biti vsaj 6 znakov dolgo.";
}
if ($password !== $confirm) {
    $errors[] = "Gesli se ne ujemata.";
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode([
        'success' => false,
        'error'   => 'Uporabnik z to e‐pošto že obstaja.'
    ]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$insert = $pdo->prepare("
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES (?, ?, ?, ?)
");
$insert->execute([$firstName, $lastName, $email, $passwordHash]);

echo json_encode([
    'success' => true,
    'message' => 'Registracija uspešna. Prosimo, prijavite se.'
]);
exit;

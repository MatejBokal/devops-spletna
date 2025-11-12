<?php
// api/login.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?? $_POST;

$email    = sanitizeString($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!validateEmail($email) || $password === '') {
    echo json_encode([
        'success' => false,
        'error'   => 'Prosim, vnesite veljaven e‐poštni naslov in geslo.'
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, first_name, last_name, password_hash, is_admin FROM users WHERE email = ?");
$stmt->execute([$email]);
$userRow = $stmt->fetch();

if (!$userRow || !password_verify($password, $userRow['password_hash'])) {
    echo json_encode([
        'success' => false,
        'error'   => 'Nepravilna prijava.'
    ]);
    exit;
}

session_start();
$_SESSION['user_id']    = (int)$userRow['id'];
$_SESSION['first_name'] = $userRow['first_name'];
$_SESSION['last_name']  = $userRow['last_name'];
$_SESSION['is_admin']   = (bool)$userRow['is_admin'];

echo json_encode([
    'success' => true,
    'message' => 'Prijava uspešna.',
    'user'    => [
        'id'         => (int)$userRow['id'],
        'first_name' => $userRow['first_name'],
        'last_name'  => $userRow['last_name'],
        'is_admin'   => (bool)$userRow['is_admin']
    ]
]);
exit;

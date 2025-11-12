<?php
// api/reservation_delete.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Metoda ni dovoljena. Uporabite POST.'
    ]);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true) ?? [];

$reservation_id = sanitizeInt($data['reservation_id'] ?? 0);
if ($reservation_id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Neveljaven ID rezervacije.'
    ]);
    exit;
}

$stmtCheck = $pdo->prepare("
    SELECT user_id
    FROM reservations
    WHERE id = ?
");
$stmtCheck->execute([ $reservation_id ]);
$row = $stmtCheck->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Rezervacija ni najdena.'
    ]);
    exit;
}

if ((int)$row['user_id'] !== $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error'   => 'Nimate dovoljenja za brisanje te rezervacije.'
    ]);
    exit;
}

$stmtDel = $pdo->prepare("
    DELETE FROM reservations
    WHERE id = ?
");
$stmtDel->execute([ $reservation_id ]);

echo json_encode([
    'success' => true,
    'message' => 'Rezervacija uspešno izbrisana.'
]);
exit;

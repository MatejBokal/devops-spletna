<?php
// api/make_reservation.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireLogin();

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?? [];

$event_id = sanitizeInt($data['event_id'] ?? 0);
$quantity = sanitizeInt($data['quantity'] ?? 0);

if ($event_id <= 0 || $quantity < 1) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neveljavni podatki.']);
    exit;
}

$stmt = $pdo->prepare("SELECT capacity FROM events WHERE id = ?");
$stmt->execute([$event_id]);
$row = $stmt->fetch();
if (!$row) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Dogodek ni najden.']);
    exit;
}
$capacity = (int)$row['capacity'];

$resStmt = $pdo->prepare("
    SELECT COALESCE(SUM(quantity), 0) AS total_reserved
      FROM reservations
     WHERE event_id = ?
");
$resStmt->execute([$event_id]);
$already = (int)$resStmt->fetchColumn();

if ($already + $quantity > $capacity) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Ni dovolj prostih vstopnic.'
    ]);
    exit;
}

$ins = $pdo->prepare("
    INSERT INTO reservations (user_id, event_id, quantity)
    VALUES (?, ?, ?)
");
$ins->execute([ $_SESSION['user_id'], $event_id, $quantity ]);

echo json_encode([
    'success' => true,
    'message' => 'Rezervacija je uspela.'
]);
exit;

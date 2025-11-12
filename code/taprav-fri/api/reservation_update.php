<?php
// api/reservation_update.php
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
$new_quantity   = sanitizeInt($data['new_quantity']   ?? 0);

if ($reservation_id <= 0 || $new_quantity < 1) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Neveljavni podatki.'
    ]);
    exit;
}

$stmtRes = $pdo->prepare("
    SELECT event_id, quantity AS old_quantity
    FROM reservations
    WHERE id = ?
");
$stmtRes->execute([ $reservation_id ]);
$resRow = $stmtRes->fetch(PDO::FETCH_ASSOC);

if (!$resRow) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Rezervacija ni najdena.'
    ]);
    exit;
}

$event_id     = (int)$resRow['event_id'];
$old_quantity = (int)$resRow['old_quantity'];

$stmtOwner = $pdo->prepare("
    SELECT user_id
    FROM reservations
    WHERE id = ?
");
$stmtOwner->execute([ $reservation_id ]);
$rowOwner = $stmtOwner->fetch(PDO::FETCH_ASSOC);

if (!$rowOwner || (int)$rowOwner['user_id'] !== $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error'   => 'Nimate dovoljenja za urejanje te rezervacije.'
    ]);
    exit;
}

$stmtCap = $pdo->prepare("
    SELECT
      e.capacity,
      COALESCE(SUM(r2.quantity), 0) AS total_reserved_others
    FROM events AS e
    LEFT JOIN reservations AS r2
      ON e.id = r2.event_id
      AND r2.id != :reservation_id
    WHERE e.id = :event_id
    GROUP BY e.id
");
$stmtCap->execute([
    ':reservation_id' => $reservation_id,
    ':event_id'       => $event_id
]);
$capRow = $stmtCap->fetch(PDO::FETCH_ASSOC);

if (!$capRow) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Dogodek ni najden.'
    ]);
    exit;
}

$capacity           = (int)$capRow['capacity'];
$total_reserved_others = (int)$capRow['total_reserved_others'];
$free_spots         = $capacity - $total_reserved_others;

if ($new_quantity > $free_spots) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Ni dovolj prostih vstopnic.'
    ]);
    exit;
}

$stmtUpd = $pdo->prepare("
    UPDATE reservations
    SET quantity = ?
    WHERE id = ?
");
$stmtUpd->execute([ $new_quantity, $reservation_id ]);

echo json_encode([
    'success' => true,
    'message' => 'Rezervacija posodobljena.'
]);
exit;

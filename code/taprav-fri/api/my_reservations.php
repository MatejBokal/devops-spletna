<?php
// api/my_reservations.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

requireLogin();

$stmt = $pdo->prepare("
    SELECT
      r.id            AS reservation_id,
      r.event_id      AS event_id,
      r.quantity      AS quantity,
      r.reserved_at   AS reserved_at,
      e.slug          AS slug,
      e.title         AS title,
      e.event_date    AS event_date
    FROM reservations AS r
    INNER JOIN events AS e ON r.event_id = e.id
    WHERE r.user_id = ?
    ORDER BY r.reserved_at DESC
");
$stmt->execute([ $_SESSION['user_id'] ]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success'      => true,
    'reservations' => $rows
]);
exit;

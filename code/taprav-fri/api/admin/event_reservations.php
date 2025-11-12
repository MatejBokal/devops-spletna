<?php
// api/admin/event_reservations.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

$slug = isset($_GET['slug']) ? sanitizeString($_GET['slug']) : '';
if ($slug === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Manjkajoči slug dogodka.'
    ]);
    exit;
}

$stmtEvent = $pdo->prepare("SELECT id, title FROM events WHERE slug = ?");
$stmtEvent->execute([$slug]);
$eventRow = $stmtEvent->fetch(PDO::FETCH_ASSOC);

if (!$eventRow) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Dogodek s tem slug-om ne obstaja.'
    ]);
    exit;
}

$eventId    = (int)$eventRow['id'];
$eventTitle = $eventRow['title'];

$sql = "
    SELECT
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      r.quantity,
      r.reserved_at
    FROM reservations AS r
    INNER JOIN users AS u ON r.user_id = u.id
    WHERE r.event_id = ?
    ORDER BY r.reserved_at ASC
";
$stmtRes = $pdo->prepare($sql);
$stmtRes->execute([$eventId]);
$resRows = $stmtRes->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success'      => true,
    'event'        => [
        'id'    => $eventId,
        'title' => $eventTitle
    ],
    'reservations' => $resRows
]);
exit;

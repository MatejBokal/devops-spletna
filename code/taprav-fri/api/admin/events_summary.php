<?php
// api/admin/events_summary.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

$sql = "
    SELECT
      e.id,
      e.slug,
      e.title,
      e.event_date,
      e.capacity,
      COALESCE(SUM(r.quantity), 0) AS total_reserved
    FROM events AS e
    LEFT JOIN reservations AS r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.event_date ASC
";

$stmt = $pdo->query($sql);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as &$row) {
    $row['remaining'] = (int)$row['capacity'] - (int)$row['total_reserved'];
}
unset($row);

echo json_encode([
    'success' => true,
    'events'  => $rows
]);
exit;

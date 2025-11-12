<?php
// api/events_list.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';


$upcomingOnly = isset($_GET['upcoming']) && $_GET['upcoming'] === '1';

$sql = "
    SELECT 
      e.id,
      e.slug,
      e.title,
      e.short_description AS description,
      e.event_date,
      e.capacity,
      e.image_path,
      COALESCE(SUM(r.quantity), 0) AS total_reserved
    FROM events e
    LEFT JOIN reservations r ON e.id = r.event_id
    " . ($upcomingOnly ? "WHERE e.event_date > NOW()" : "") . "
    GROUP BY e.id
    ORDER BY e.event_date ASC
";

$stmt = $pdo->query($sql);
$all = $stmt->fetchAll();

foreach ($all as &$row) {
    $row['remaining'] = (int)$row['capacity'] - (int)$row['total_reserved'];
}
unset($row);

echo json_encode([
    'success' => true,
    'events'  => $all
]);
exit;

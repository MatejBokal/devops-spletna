<?php
// api/event_detail.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

$slug = sanitizeString($_GET['slug'] ?? '');
if ($slug === '') {
    echo json_encode([ 'success' => false, 'error' => 'Neveljaven slug dogodka.' ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT 
      e.id,
      e.slug,
      e.title,
      e.short_description,
      e.full_description,
      e.event_date,
      e.capacity,
      e.image_path,
      COALESCE(SUM(r.quantity), 0) AS total_reserved
    FROM events e
    LEFT JOIN reservations r ON e.id = r.event_id
    WHERE e.slug = ?
    GROUP BY e.id
");
$stmt->execute([$slug]);
$ev = $stmt->fetch();

if (!$ev) {
    echo json_encode([ 'success' => false, 'error' => 'Dogodek ni najden.' ]);
    exit;
}

$ev['remaining'] = (int)$ev['capacity'] - (int)$ev['total_reserved'];

echo json_encode([
    'success' => true,
    'event'   => $ev
]);
exit;

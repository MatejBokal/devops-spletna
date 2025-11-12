<?php
// api/admin/event_details.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

$slug = $_GET['slug'] ?? '';
$slug = sanitizeString($slug);

if ($slug === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Manjkajoči slug dogodka.'
    ]);
    exit;
}

$stmtEvent = $pdo->prepare("
    SELECT
      e.id,
      e.slug,
      e.title,
      e.short_description,
      e.full_description,
      e.event_date,
      e.capacity,
      e.image_path
    FROM events AS e
    WHERE e.slug = ?
");
$stmtEvent->execute([$slug]);
$eventRow = $stmtEvent->fetch(PDO::FETCH_ASSOC);

if (!$eventRow) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Dogodek ne obstaja.'
    ]);
    exit;
}

$eventId          = (int)$eventRow['id'];
$eventSlug        = $eventRow['slug'];
$title            = $eventRow['title'];
$shortDescription = $eventRow['short_description'];
$fullDescription  = $eventRow['full_description'];
$eventDate        = $eventRow['event_date'];
$capacity         = (int)$eventRow['capacity'];
$imagePath        = $eventRow['image_path'];

$stmtRes = $pdo->prepare("
    SELECT COALESCE(SUM(r.quantity), 0) AS total_reserved
    FROM reservations AS r
    WHERE r.event_id = ?
");
$stmtRes->execute([$eventId]);
$resRow        = $stmtRes->fetch(PDO::FETCH_ASSOC);
$totalReserved = (int)$resRow['total_reserved'];

echo json_encode([
    'success' => true,
    'event'   => [
        'id'                => $eventId,
        'slug'              => $eventSlug,
        'title'             => $title,
        'short_description' => $shortDescription,
        'full_description'  => $fullDescription,
        'event_date'        => $eventDate,
        'capacity'          => $capacity,
        'image_path'        => $imagePath,
        'total_reserved'    => $totalReserved
    ]
]);
exit;

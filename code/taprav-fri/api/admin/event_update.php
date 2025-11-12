<?php
// api/admin/event_update.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$idRaw               = $_POST['id']                   ?? '';
$slugRaw             = $_POST['slug']                 ?? '';
$titleRaw            = $_POST['title']                ?? '';
$shortDescRaw        = $_POST['short_description']    ?? '';
$fullDescRaw         = $_POST['full_description']     ?? '';
$dateRaw             = $_POST['event_date']           ?? '';
$capacityRaw         = $_POST['capacity']             ?? '';

$id                = sanitizeInt($idRaw);
$slug              = sanitizeString($slugRaw);
$title             = sanitizeString($titleRaw);
$shortDescription  = sanitizeString($shortDescRaw);
$fullDescription   = sanitizeString($fullDescRaw);
$capacity          = sanitizeInt($capacityRaw);

if ($id <= 0 || $slug === '' || $title === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'ID, slug in naslov dogodka morajo biti navedeni.'
    ]);
    exit;
}

$dateTimeObj = DateTime::createFromFormat('Y-m-d\TH:i', $dateRaw);
if (!$dateTimeObj) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Neveljaven format datuma. Uporabite obliko YYYY-MM-DDTHH:MM.'
    ]);
    exit;
}
$eventDate = $dateTimeObj->format('Y-m-d H:i:s');

if ($capacity <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Kapaciteta mora biti pozitivno število.'
    ]);
    exit;
}

$stmtSlug = $pdo->prepare("
    SELECT id 
    FROM events 
    WHERE slug = ? AND id != ?
");
$stmtSlug->execute([$slug, $id]);
if ($stmtSlug->fetch()) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Ta slug je že zaseden.'
    ]);
    exit;
}

$stmtRes = $pdo->prepare("
    SELECT COALESCE(SUM(r.quantity), 0) AS total_reserved
    FROM reservations AS r
    WHERE r.event_id = ?
");
$stmtRes->execute([$id]);
$rowRes        = $stmtRes->fetch(PDO::FETCH_ASSOC);
$totalReserved = (int)$rowRes['total_reserved'];

if ($capacity < $totalReserved) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => "Kapaciteta ne sme biti manjša od trenutno rezerviranih ($totalReserved)."
    ]);
    exit;
}

$imagePath = null;
if (
    isset($_FILES['image']) &&
    $_FILES['image']['error'] === UPLOAD_ERR_OK
) {
    $fileTmp  = $_FILES['image']['tmp_name'];
    $fileName = basename($_FILES['image']['name']);
    $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExt = ['jpg','jpeg','png','gif'];

    if (!in_array($ext, $allowedExt, true)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error'   => 'Podprti so le formati JPG, JPEG, PNG in GIF.'
        ]);
        exit;
    }

    $targetDir = __DIR__ . '/../uploads/events/';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $newName    = uniqid('evt_', true) . '.' . $ext;
    $targetPath = $targetDir . $newName;

    if (move_uploaded_file($fileTmp, $targetPath)) {
        $imagePath = 'uploads/events/' . $newName;
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Ni uspelo premakniti naložene slike.'
        ]);
        exit;
    }
}

if ($imagePath !== null) {
    $sql = "
      UPDATE events
      SET slug               = ?,
          title              = ?,
          short_description  = ?,
          full_description   = ?,
          event_date         = ?,
          capacity           = ?,
          image_path         = ?
      WHERE id = ?
    ";
    $params = [
        $slug,
        $title,
        $shortDescription,
        $fullDescription,
        $eventDate,
        $capacity,
        $imagePath,
        $id
    ];
} else {
    $sql = "
      UPDATE events
      SET slug               = ?,
          title              = ?,
          short_description  = ?,
          full_description   = ?,
          event_date         = ?,
          capacity           = ?
      WHERE id = ?
    ";
    $params = [
        $slug,
        $title,
        $shortDescription,
        $fullDescription,
        $eventDate,
        $capacity,
        $id
    ];
}

$stmtUpdate = $pdo->prepare($sql);
$stmtUpdate->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Dogodek je bil uspešno posodobljen.'
]);
exit;

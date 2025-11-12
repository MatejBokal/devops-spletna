<?php
// api/admin/event_create.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$slugRaw             = $_POST['slug']                 ?? '';
$titleRaw            = $_POST['title']                ?? '';
$shortDescRaw        = $_POST['short_description']    ?? '';
$fullDescRaw         = $_POST['full_description']     ?? '';
$dateRaw             = $_POST['event_date']           ?? '';
$capacityRaw         = $_POST['capacity']             ?? '';

$slug              = sanitizeString($slugRaw);
$title             = sanitizeString($titleRaw);
$shortDescription  = sanitizeString($shortDescRaw);
$fullDescription   = sanitizeString($fullDescRaw);
$capacity          = sanitizeInt($capacityRaw);

if ($slug === '' || $title === '' || $dateRaw === '' || $capacity <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Polja slug, naslov, datum in kapaciteta so obvezna.'
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

$stmtSlug = $pdo->prepare("
    SELECT id 
    FROM events 
    WHERE slug = ?
");
$stmtSlug->execute([$slug]);
if ($stmtSlug->fetch()) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Ta slug je že zaseden.'
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
      INSERT INTO events 
        (slug, title, short_description, full_description, event_date, capacity, image_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    ";
    $params = [
        $slug,
        $title,
        $shortDescription,
        $fullDescription,
        $eventDate,
        $capacity,
        $imagePath
    ];
} else {
    $sql = "
      INSERT INTO events 
        (slug, title, short_description, full_description, event_date, capacity)
      VALUES (?, ?, ?, ?, ?, ?)
    ";
    $params = [
        $slug,
        $title,
        $shortDescription,
        $fullDescription,
        $eventDate,
        $capacity
    ];
}

$stmtInsert = $pdo->prepare($sql);
$stmtInsert->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Dogodek je bil uspešno dodan.'
]);
exit;

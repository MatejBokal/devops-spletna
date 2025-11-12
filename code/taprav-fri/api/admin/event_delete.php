<?php
// api/admin/event_delete.php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

require_once __DIR__ . '/../includes/auth.php';

requireAdmin();

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

$id = sanitizeInt($data['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Neveljaven ID dogodka.'
    ]);
    exit;
}

$stmtImg = $pdo->prepare("SELECT image_path FROM events WHERE id = ?");
$stmtImg->execute([$id]);
$rowImg = $stmtImg->fetch();
if (!$rowImg) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error'   => 'Dogodek ni najden.'
    ]);
    exit;
}
$imagePath = $rowImg['image_path'];

$stmtDel = $pdo->prepare("DELETE FROM events WHERE id = ?");
$stmtDel->execute([$id]);

if ($stmtDel->rowCount() === 0) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Ni bilo mogoče izbrisati dogodka.'
    ]);
    exit;
}

if (!empty($imagePath)) {
    $fullPath = __DIR__ . '/../' . $imagePath;
    if (file_exists($fullPath)) {
        @unlink($fullPath);
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Dogodek je bil uspešno izbrisan.'
]);
exit;

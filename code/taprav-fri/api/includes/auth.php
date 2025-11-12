<?php
// api/includes/auth.php
declare(strict_types=1);

session_start();

function isLoggedIn(): bool {
    return isset($_SESSION['user_id']);
}

function isAdmin(): bool {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error'   => 'Prosimo, prijavite se za nadaljevanje.'
        ]);
        exit;
    }
}


function requireAdmin() {
    if (!isLoggedIn() || !isAdmin()) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error'   => 'Za dostop potrebujete administratorske pravice.'
        ]);
        exit;
    }
}

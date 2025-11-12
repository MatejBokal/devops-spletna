<?php
// api/includes/functions.php
declare(strict_types=1);

function sanitizeString(string $raw): string {
    return htmlspecialchars(trim($raw), ENT_QUOTES, 'UTF-8');
}


function sanitizeInt($raw): int {
    $filtered = filter_var((string)$raw, FILTER_SANITIZE_NUMBER_INT);
    return $filtered === false ? 0 : (int)$filtered;
}


function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}


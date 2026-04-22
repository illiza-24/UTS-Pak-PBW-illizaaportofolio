<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $pdo = getDB();

    $stmt = $pdo->query("
        SELECT 
            nama AS name,
            pesan AS message,
            created_at
        FROM pesan
        ORDER BY created_at DESC
        LIMIT 20
    ");

    $messages = $stmt->fetchAll();

    echo json_encode($messages);

} catch (PDOException $e) {
    error_log('DB Error: ' . $e->getMessage());
    echo json_encode([]);
}
?>
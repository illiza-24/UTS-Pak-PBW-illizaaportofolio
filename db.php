<?php
define('DB_HOST', 'sql303.infinityfree.com'); 
define('DB_USER', 'if0_41726858');             
define('DB_PASS', 'gG3YM7iTP6Zu7');            
define('DB_NAME', 'if0_41726858_form_illizaa');   

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}
?>

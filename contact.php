<?php
header('Content-Type: application/json');

require_once 'db.php';

// Hanya POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Akses tidak diizinkan']);
    exit;
}

// Ambil data
$nama  = trim($_POST['nama'] ?? '');
$email = trim($_POST['email'] ?? '');
$pesan = trim($_POST['pesan'] ?? '');

// Validasi
if (empty($nama)) {
    echo json_encode(['success' => false, 'error' => 'Nama wajib diisi']); exit;
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Email tidak valid']); exit;
}
if (empty($pesan)) {
    echo json_encode(['success' => false, 'error' => 'Pesan kosong']); exit;
}

try {
    $db = getDB();

    $stmt = $db->prepare("INSERT INTO pesan (nama, email, pesan) VALUES (?, ?, ?)");
    $stmt->execute([$nama, $email, $pesan]);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
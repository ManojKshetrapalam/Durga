<?php
/**
 * Sri Durga Devi Temple — Digital Mandapa: Real-Time Live Frame Relay API
 * Relays live camera frames from broadcaster to remote devotees.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$frameFile = __DIR__ . '/data_live_frame.jpg';
$metaFile  = __DIR__ . '/data_live_frame.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input['frame'])) {
        $data = $input['frame'];
        if (strpos($data, ',') !== false) {
            $data = explode(',', $data)[1];
        }
        $binary = base64_decode($data);
        if ($binary !== false) {
            @file_put_contents($frameFile, $binary, LOCK_EX);
            @file_put_contents($metaFile, json_encode([
                'timestamp' => date('c'),
                'timeMs' => round(microtime(true) * 1000)
            ]));
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        }
    }
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid frame data']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['json'])) {
        header('Content-Type: application/json');
        if (file_exists($frameFile)) {
            $binary = @file_get_contents($frameFile);
            $base64 = 'data:image/jpeg;base64,' . base64_encode($binary);
            $meta = file_exists($metaFile) ? json_decode(@file_get_contents($metaFile), true) : [];
            echo json_encode(['success' => true, 'frame' => $base64, 'meta' => $meta]);
        } else {
            echo json_encode(['success' => false, 'frame' => null]);
        }
        exit;
    }

    if (file_exists($frameFile) && filesize($frameFile) > 0) {
        header('Content-Type: image/jpeg');
        readfile($frameFile);
        exit;
    } else {
        // Fallback default 1x1 transparent or empty 204
        http_response_code(204);
        exit;
    }
}

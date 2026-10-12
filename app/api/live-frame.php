<?php
/**
 * Sri Durga Devi Temple — Digital Mandapa: Real-Time Live Frame Relay API
 * Ultra-low latency binary frame relay for smooth 20-30 FPS live camera broadcasting.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Frame-Seq, X-Frame-Time, X-Frame-Fps');
header('Access-Control-Expose-Headers: X-Frame-Seq, X-Frame-Time, X-Frame-Fps, X-Server-Time');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$frameFile = __DIR__ . '/data_live_frame.jpg';
$metaFile  = __DIR__ . '/data_live_frame.json';

// ==================== 1. BROADCASTER FRAME INGESTION ====================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nowMs = round(microtime(true) * 1000);
    $binary = null;
    $fpsHeader = isset($_SERVER['HTTP_X_FRAME_FPS']) ? floatval($_SERVER['HTTP_X_FRAME_FPS']) : 0;
    $clientTime = isset($_SERVER['HTTP_X_FRAME_TIME']) ? intval($_SERVER['HTTP_X_FRAME_TIME']) : $nowMs;

    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

    if (stripos($contentType, 'image/jpeg') !== false || stripos($contentType, 'application/octet-stream') !== false) {
        // High-performance direct raw binary upload (Zero base64 overhead)
        $binary = file_get_contents('php://input');
    } else {
        // Fallback for JSON base64 upload
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        if (!empty($input['frame'])) {
            $data = $input['frame'];
            if (strpos($data, ',') !== false) {
                $data = explode(',', $data)[1];
            }
            $binary = base64_decode($data);
        }
    }

    if ($binary !== null && strlen($binary) > 100) {
        // Read previous sequence monotonically
        $prevMeta = file_exists($metaFile) ? json_decode(@file_get_contents($metaFile), true) : [];
        $seq = isset($prevMeta['seq']) ? ($prevMeta['seq'] + 1) : 1;

        // Atomic write with exclusive lock
        @file_put_contents($frameFile, $binary, LOCK_EX);
        @file_put_contents($metaFile, json_encode([
            'seq' => $seq,
            'timestamp' => date('c'),
            'timeMs' => $clientTime,
            'serverMs' => $nowMs,
            'bytes' => strlen($binary),
            'fps' => $fpsHeader
        ], JSON_UNESCAPED_SLASHES), LOCK_EX);

        header('Content-Type: application/json');
        header("X-Frame-Seq: $seq");
        header("X-Frame-Time: $nowMs");
        echo json_encode(['success' => true, 'seq' => $seq, 'timeMs' => $nowMs]);
        exit;
    }

    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid frame data']);
    exit;
}

// ==================== 2. DEVOTEE VIEWER PLAYBACK ====================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Legacy JSON format request
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

    // High-performance Long-Poll Push: wait for next frame if client requested wait_seq
    $waitSeq = isset($_GET['wait_seq']) ? intval($_GET['wait_seq']) : 0;
    if ($waitSeq > 0) {
        $start = microtime(true);
        // Wait up to 300ms for a newer frame to arrive
        while ((microtime(true) - $start) < 0.30) {
            clearstatcache(true, $metaFile);
            if (file_exists($metaFile)) {
                $meta = json_decode(@file_get_contents($metaFile), true);
                if (!empty($meta['seq']) && $meta['seq'] > $waitSeq) {
                    break;
                }
            }
            usleep(15000); // 15ms check
        }
    }

    if (file_exists($frameFile) && filesize($frameFile) > 0) {
        $meta = file_exists($metaFile) ? json_decode(@file_get_contents($metaFile), true) : [];
        $seq = isset($meta['seq']) ? $meta['seq'] : 0;
        $frameTime = isset($meta['timeMs']) ? $meta['timeMs'] : round(microtime(true) * 1000);
        $broadcasterFps = isset($meta['fps']) ? $meta['fps'] : 0;

        header('Content-Type: image/jpeg');
        header("X-Frame-Seq: $seq");
        header("X-Frame-Time: $frameTime");
        header("X-Frame-Fps: $broadcasterFps");
        header("X-Server-Time: " . round(microtime(true) * 1000));
        readfile($frameFile);
        exit;
    } else {
        http_response_code(204);
        exit;
    }
}

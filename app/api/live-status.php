<?php
/**
 * Sri Durga Devi Temple — Digital Mandapa: Live Streaming State API
 * Atomic read/write server-side store for cross-device broadcast synchronization.
 */

header('Content-Type: application/json; charset=utf-8');
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

$dataFile = __DIR__ . '/data_live_state.json';

// Initialize state file if missing
if (!file_exists($dataFile)) {
    $initialData = [
        'isLive' => false,
        'activeSession' => null,
        'activeSessions' => [],
        'viewerCount' => 0,
        'lastUpdated' => date('c')
    ];
    @file_put_contents($dataFile, json_encode($initialData, JSON_PRETTY_PRINT));
}

function readState($file) {
    if (!file_exists($file)) return ['isLive' => false, 'activeSession' => null, 'activeSessions' => [], 'viewerCount' => 0];
    $fp = fopen($file, 'r');
    if (!$fp) return ['isLive' => false, 'activeSession' => null, 'activeSessions' => [], 'viewerCount' => 0];
    flock($fp, LOCK_SH);
    $content = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : ['isLive' => false, 'activeSession' => null, 'activeSessions' => [], 'viewerCount' => 0];
}

function writeState($file, $data) {
    $data['lastUpdated'] = date('c');
    $fp = fopen($file, 'c+');
    if (!$fp) return false;
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

function pruneAndUpdateViewers(&$state) {
    if (!isset($state['viewers']) || !is_array($state['viewers'])) {
        $state['viewers'] = [];
    }
    $cutoff = time() - 35; // 35 seconds window for active viewers
    foreach ($state['viewers'] as $vid => $time) {
        if ($time < $cutoff) {
            unset($state['viewers'][$vid]);
        }
    }
    $activeCount = count($state['viewers']);
    $isLive = !empty($state['isLive']);
    // If broadcast is actively live, ensure at least 1 devotee (broadcaster/initial) is reflected
    $viewerCount = $isLive ? max(1, $activeCount) : $activeCount;
    $state['viewerCount'] = $viewerCount;

    if ($isLive && !empty($state['activeSession'])) {
        $state['activeSession']['currentViewers'] = $viewerCount;
        $curPeak = intval($state['activeSession']['peakViewers'] ?? 0);
        $state['activeSession']['peakViewers'] = max($curPeak, $viewerCount);
    }
    if ($isLive && !empty($state['activeSessions'])) {
        foreach ($state['activeSessions'] as &$as) {
            if ($as['id'] === ($state['activeSession']['id'] ?? '')) {
                $as['currentViewers'] = $viewerCount;
                $as['peakViewers'] = max(intval($as['peakViewers'] ?? 0), $viewerCount);
            }
        }
        unset($as);
    }
    return $viewerCount;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $state = readState($dataFile);
    pruneAndUpdateViewers($state);
    writeState($dataFile, $state);
    echo json_encode([
        'success' => true,
        'isLive' => !empty($state['isLive']),
        'session' => $state['activeSession'] ?? null,
        'activeSessions' => $state['activeSessions'] ?? [],
        'viewerCount' => intval($state['viewerCount'] ?? 0),
        'lastUpdated' => $state['lastUpdated'] ?? date('c')
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    $action = $input['action'] ?? '';
    $state = readState($dataFile);

    if ($action === 'START') {
        $session = $input['session'] ?? null;
        if (!$session || empty($session['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing session data']);
            exit;
        }

        // Auto-supersede previous active sessions for this location
        $locId = $session['locationId'] ?? '';
        if (!empty($state['activeSessions'])) {
            foreach ($state['activeSessions'] as &$s) {
                if ($s['locationId'] === $locId && $s['id'] !== $session['id']) {
                    $s['status'] = 'ENDED';
                    $s['endedAt'] = date('c');
                }
            }
            unset($s);
        }

        $session['status'] = 'LIVE';
        $session['currentViewers'] = 1;
        $session['peakViewers'] = max(1, intval($session['peakViewers'] ?? 1));
        $state['isLive'] = true;
        $state['viewers'] = [ 'broadcaster_' . substr(md5($session['id']), 0, 8) => time() ];
        $state['activeSession'] = $session;
        if (!isset($state['activeSessions'])) $state['activeSessions'] = [];
        $state['activeSessions'] = array_values(array_filter($state['activeSessions'], function($s) use ($session) {
            return $s['id'] !== $session['id'];
        }));
        $state['activeSessions'][] = $session;
        $state['viewerCount'] = 1;

        writeState($dataFile, $state);

        echo json_encode(['success' => true, 'isLive' => true, 'session' => $session]);
        exit;
    }

    if ($action === 'VIEWER_PING') {
        $viewerId = $input['viewerId'] ?? ('vwr_' . substr(md5($_SERVER['REMOTE_ADDR'] ?? 'anon' . time()), 0, 8));
        if (!isset($state['viewers']) || !is_array($state['viewers'])) {
            $state['viewers'] = [];
        }
        $state['viewers'][$viewerId] = time();
        $viewerCount = pruneAndUpdateViewers($state);
        writeState($dataFile, $state);
        echo json_encode([
            'success' => true,
            'viewerCount' => $viewerCount,
            'peakViewers' => $state['activeSession']['peakViewers'] ?? $viewerCount,
            'isLive' => !empty($state['isLive'])
        ]);
        exit;
    }

    if ($action === 'VIEWER_LEAVE') {
        $viewerId = $input['viewerId'] ?? '';
        if ($viewerId && isset($state['viewers'][$viewerId])) {
            unset($state['viewers'][$viewerId]);
        }
        $viewerCount = pruneAndUpdateViewers($state);
        writeState($dataFile, $state);
        echo json_encode([
            'success' => true,
            'viewerCount' => $viewerCount
        ]);
        exit;
    }

    if ($action === 'STOP') {
        $sessionId = $input['sessionId'] ?? '';
        $state['isLive'] = false;
        $state['viewers'] = [];
        if (!empty($state['activeSession']) && ($state['activeSession']['id'] === $sessionId || empty($sessionId))) {
            $state['activeSession']['status'] = 'ENDED';
            $state['activeSession']['endedAt'] = date('c');
            $state['activeSession']['currentViewers'] = 0;
        }
        $state['activeSessions'] = array_values(array_filter($state['activeSessions'] ?? [], function($s) use ($sessionId) {
            return !empty($sessionId) ? $s['id'] !== $sessionId : false;
        }));
        if (empty($state['activeSessions'])) {
            $state['isLive'] = false;
            $state['activeSession'] = null;
            $state['viewerCount'] = 0;
            // Clean up live frame file to prevent stale playback
            $frameFile = __DIR__ . '/data_live_frame.jpg';
            if (file_exists($frameFile)) { @unlink($frameFile); }
            $metaFile = __DIR__ . '/data_live_frame.json';
            if (file_exists($metaFile)) { @unlink($metaFile); }
        }

        writeState($dataFile, $state);

        echo json_encode(['success' => true, 'isLive' => $state['isLive'], 'activeSessions' => $state['activeSessions']]);
        exit;
    }

    if ($action === 'HEARTBEAT') {
        $delta = intval($input['delta'] ?? 0);
        $state['viewerCount'] = max(0, intval($state['viewerCount'] ?? 0) + $delta);
        writeState($dataFile, $state);
        echo json_encode(['success' => true, 'viewerCount' => $state['viewerCount']]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Unknown action: ' . htmlspecialchars($action)]);
    exit;
}

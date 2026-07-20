<?php
// ============================================================
// CREATE RAZORPAY ORDER
// Called by JS before opening the Razorpay checkout popup.
// Locks the amount server-side so it cannot be tampered with
// from the browser.
// ============================================================
header('Content-Type: application/json');
require_once __DIR__ . '/razorpay-config.php';

// ---- Only allow POST requests ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$pack = isset($input['pack']) ? $input['pack'] : '';

// ---- SERVER-SIDE PRICE LIST (must match your order.html pack prices) ----
// This is the key security step — price comes from here, NOT from the browser.
$prices = [
    '1' => 1499,   // 1 Bottle
    '2' => 2499,   // 2 Bottles
    '3' => 4499,   // 4 Bottles
];

if (!isset($prices[$pack])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid pack selected']);
    exit;
}

$amount = $prices[$pack] * 100; // Razorpay expects paise

// ---- Call Razorpay Orders API ----
$curl = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_USERPWD => RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'amount' => $amount,
        'currency' => 'INR',
        'receipt' => 'jsh_' . time(),
        'payment_capture' => 1
    ]),
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not create Razorpay order', 'details' => $response]);
    exit;
}

$order = json_decode($response, true);

echo json_encode([
    'order_id' => $order['id'],
    'amount' => $order['amount'],
    'currency' => $order['currency'],
    'key_id' => RAZORPAY_KEY_ID
]);

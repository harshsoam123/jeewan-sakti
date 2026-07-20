<?php
// ============================================================
// VERIFY RAZORPAY PAYMENT
// Called by JS right after the checkout popup returns a
// successful payment. Confirms the payment is genuine by
// checking Razorpay's cryptographic signature — this is what
// stops anyone from faking a "successful payment" message.
// ============================================================
header('Content-Type: application/json');
require_once __DIR__ . '/razorpay-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$orderId   = isset($input['razorpay_order_id']) ? $input['razorpay_order_id'] : '';
$paymentId = isset($input['razorpay_payment_id']) ? $input['razorpay_payment_id'] : '';
$signature = isset($input['razorpay_signature']) ? $input['razorpay_signature'] : '';

if (!$orderId || !$paymentId || !$signature) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing payment details']);
    exit;
}

// ---- Recreate the expected signature and compare ----
$generatedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, RAZORPAY_KEY_SECRET);

if (hash_equals($generatedSignature, $signature)) {
    // Payment is genuine.
    // Optional: log this order to a file or database here.
    $logLine = date('Y-m-d H:i:s') . " | order_id={$orderId} | payment_id={$paymentId} | VERIFIED\n";
    file_put_contents(__DIR__ . '/razorpay-orders.log', $logLine, FILE_APPEND);

    echo json_encode(['success' => true, 'payment_id' => $paymentId]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Signature verification failed']);
}

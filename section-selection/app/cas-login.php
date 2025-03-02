<?php
session_start();
require 'config.php';

// Capture initial query parameters (sent from Next.js page.js)
$email = isset($_GET['email']) ? $_GET['email'] : '';
$gtid = isset($_GET['gtid']) ? $_GET['gtid'] : '';
$name = isset($_GET['name']) ? $_GET['name'] : '';  // Optional, if you ask for name in the form
$redirect = isset($_GET['redirect']) ? $_GET['redirect'] : '/student';  // Defaults to /student if not provided

// If there's no CAS ticket, redirect to GT CAS login
if (!isset($_GET['ticket'])) {
    // Build CAS service URL including the redirect and any other params we want to preserve
    $serviceUrl = CAS_SERVICE . '?' . http_build_query([
        'email' => $email,
        'gtid' => $gtid,
        'name' => $name,
        'redirect' => $redirect,
    ]);

    $casLoginUrl = "https://login.gatech.edu/cas/login?service=" . urlencode($serviceUrl);
    header("Location: $casLoginUrl");
    exit;
}

// Validate CAS ticket
$ticket = $_GET['ticket'];
$casValidateUrl = "https://login.gatech.edu/cas/p3/serviceValidate?service=" . urlencode(CAS_SERVICE) . "&ticket=" . urlencode($ticket);

$response = file_get_contents($casValidateUrl);

// Parse CAS response to extract the username
if (preg_match('/<cas:user>(.*?)<\/cas:user>/', $response, $matches)) {
    $username = $matches[1];
    $_SESSION['username'] = $username;

    // Optional - fetch attributes if GT CAS sends them (depends on GT's CAS configuration)
    $_SESSION['displayName'] = $name;  // Prefer form-provided name, but you could overwrite if CAS returns it
    $_SESSION['email'] = $email;  // Default to form-provided email
    $_SESSION['gtid'] = $gtid;    // Default to form-provided GTID

    if (preg_match('/<cas:displayName>(.*?)<\/cas:displayName>/', $response, $matches)) {
        $_SESSION['displayName'] = $matches[1];  // CAS-provided displayName if available
    }
    if (preg_match('/<cas:email>(.*?)<\/cas:email>/', $response, $matches)) {
        $_SESSION['email'] = $matches[1];  // CAS-provided email if available
    }
    if (preg_match('/<cas:gtID>(.*?)<\/cas:gtID>/', $response, $matches)) {
        $_SESSION['gtid'] = $matches[1];  // CAS-provided GTID if available
    }

    // Log data for debugging (optional - remove in production)
    error_log("CAS Auth Success: username=$username, email={$_SESSION['email']}, gtid={$_SESSION['gtid']}");

    // Redirect user to the appropriate page (admin or student)
    header("Location: " . $redirect);
    exit;
} else {
    // Log error if parsing CAS response failed
    error_log("CAS Auth Failed. Response: " . $response);

    echo "CAS authentication failed.";
    exit;
}

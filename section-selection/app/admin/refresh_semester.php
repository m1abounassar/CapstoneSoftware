<?php
header("Content-Type: application/json");

// DEBUG: Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "localhost:3306";
$dbname = "teamsync";
$username = "user1";
$password = "ronnie&matt4eva";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Clear students, teams, and sections tables
    $pdo->exec("DELETE FROM students");
    $pdo->exec("DELETE FROM teams");
    $pdo->exec("DELETE FROM sections");

    echo json_encode(["success" => true, "message" => "Semester refreshed successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
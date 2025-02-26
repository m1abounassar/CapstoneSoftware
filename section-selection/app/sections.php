<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost:3306";
$dbname = "teamsync;
$username = "user1";
$password = "ronnie&matt4eva";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $stmt = $pdo->query("SELECT id, title, time, capacity FROM sections");
        $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["sections" => $sections]);
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data["title"], $data["time"], $data["capacity"])) {
            $stmt = $pdo->prepare("INSERT INTO sections (title, time, capacity) VALUES (?, ?, ?)");
            $stmt->execute([$data["title"], $data["time"], $data["capacity"]]);
            echo json_encode(["message" => "Section added successfully"]);
        } else {
            echo json_encode(["error" => "Invalid data"]);
        }
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
}
?>
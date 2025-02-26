<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost:3306";
$username = "user1";
$password = "ronnie&matt4eva";
$dbname = "teamsync";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM sections";
    $result = $conn->query($sql);
    
    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row;
    }
    echo json_encode(["sections" => $sections]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['title'], $data['time'], $data['capacity'])) {
        $title = $conn->real_escape_string($data['title']);
        $time = $conn->real_escape_string($data['time']);
        $capacity = (int)$data['capacity'];
        
        $sql = "INSERT INTO sections (title, time, capacity) VALUES ('$title', '$time', $capacity)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Section added successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>

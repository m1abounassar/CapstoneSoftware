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
    $sql = "SELECT * FROM students";
    $result = $conn->query($sql);
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    echo json_encode(["students" => $students]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['gtID'], $data['name'], $data['username'], $data['team'], $data['firstChoice'], $data['secondChoice'], $data['thirdChoice'])) {
        $gtID = $conn->real_escape_string($data['gtID']);
        $name = $conn->real_escape_string($data['name']);
        $username = $conn->real_escape_string($data['username']);
        $team = $conn->real_escape_string($data['team']);
        $firstChoice = $conn->real_escape_string($data['firstChoice']);
        $secondChoice = $conn->real_escape_string($data['secondChoice']);
        $thirdChoice = $conn->real_escape_string($data['thirdChoice']);
        
        $sql = "INSERT INTO students (gtID, name, username, team) VALUES ('$gtID', '$name', '$username', '$team')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Student added successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>

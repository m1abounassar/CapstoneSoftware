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

    if (isset($data['username'], $data['firstChoice'], $data['secondChoice'], $data['thirdChoice'])) {
        $username = $conn->real_escape_string($data['username']);
        $firstChoice = json_encode($data['firstChoice']);
        $secondChoice = json_encode($data['secondChoice']);
        $thirdChoice = json_encode($data['thirdChoice']);
        
        // Escape the values before inserting them into the SQL query
        $firstChoice = $conn->real_escape_string($firstChoice);
        $secondChoice = $conn->real_escape_string($secondChoice);
        $thirdChoice = $conn->real_escape_string($thirdChoice);
        
        // Corrected SQL query
        $sql = "UPDATE students SET firstChoice='$firstChoice', secondChoice='$secondChoice', thirdChoice='$thirdChoice' WHERE username='$username'";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Preferences saved successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }

    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>

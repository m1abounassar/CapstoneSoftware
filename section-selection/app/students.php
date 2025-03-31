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

    // Handle preferences update
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
    } 
    // Handle name update
    else if (isset($data['username'], $data['name'])) {
        $username = $conn->real_escape_string($data['username']);
        $name = $conn->real_escape_string($data['name']);
        
        $sql = "UPDATE students SET name='$name' WHERE username='$username'";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Name updated successfully"]);
        } else {
            echo json_encode(["error" => "Error updating name: " . $conn->error]);
        }
    }
    else {
        echo json_encode(["error" => "Invalid input"]);
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['name'], $data['username'], $data['gtid'], $data['team'])) {
        $name = $conn->real_escape_string($data['name']);
        $username = $conn->real_escape_string($data['username']);
        $gtid = $conn->real_escape_string($data['gtid']);
        $team = $conn->real_escape_string($data['team']);

        // Validate GTID (must be 9 digits)
        if (!preg_match('/^\d{9}$/', $gtid)) {
            echo json_encode(["error" => "GTID must be exactly 9 digits."]);
            exit;
        }

        // Validate team (must be 4 digits)
        if (!preg_match('/^\d{4}$/', $team)) {
            echo json_encode(["error" => "Team Name must be exactly 4 digits."]);
            exit;
        }

        // Validate username (letters followed by numbers)
        if (!preg_match('/^[A-Za-z]+\d+$/', $username)) {
            echo json_encode(["error" => "Username must start with letters and end with numbers."]);
            exit;
        }

        // Validate name (only letters and spaces)
        if (!preg_match('/^[A-Za-z\s]+$/', $name)) {
            echo json_encode(["error" => "Name must contain only letters and spaces."]);
            exit;
        }

        // Check if GTID already exists
        $checkSQL = "SELECT * FROM students WHERE gtID = '$gtid'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["error" => "A student with this GTID already exists."]);
            exit;
        }

        // Check if username already exists
        $checkSQL = "SELECT * FROM students WHERE username = '$username'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["error" => "A student with this username already exists."]);
            exit;
        }


        // Insert new admin with default isLead = 0
        $sql = "INSERT INTO students (name, username, gtID, team) VALUES ('$name', '$username', '$gtid', '$team')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Student added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding student: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Name, username, team, and GTID are required"]);
    }
}


$conn->close();

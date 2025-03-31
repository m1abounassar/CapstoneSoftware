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
    $sql = "SELECT * FROM teams";
    $result = $conn->query($sql);
    
    $teams = [];
    while ($row = $result->fetch_assoc()) {
        $teams[] = $row;
    }
    echo json_encode(["teams" => $teams]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['team'], $data['members'])) {
        $team = $conn->real_escape_string($data['team']);
        $members = $data['members'];  // No need for real_escape_string as it's JSON

        // Update the team's members list
        $sql = "UPDATE teams SET members='$members' WHERE name='$team'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Team members updated successfully"]);
        } else {
            echo json_encode(["error" => "Error updating team: " . $conn->error]);
        }

    } else {
        echo json_encode(["error" => "Team and members data are required"]);
    }
}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['name'], $data['members'])) {
        $name = $conn->real_escape_string($data['name']);
        $members = $conn->real_escape_string($data['members']);
        
        $sql = "INSERT INTO teams (name, members) VALUES ('$name', '$members')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Team added successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>

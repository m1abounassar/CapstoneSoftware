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
    $sql = "SELECT * FROM admin";
    $result = $conn->query($sql);

    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }

    // Important: Return "adm" to match frontend expectation
    echo json_encode(["adm" => $admins]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username'])) {
        $username = $conn->real_escape_string($data['username']);
        $updates = [];

        if (isset($data['name'])) {
            $name = $conn->real_escape_string($data['name']);
            $updates[] = "name='$name'";
        }

        if (isset($data['gtID'])) {
            $gtID = $conn->real_escape_string($data['gtID']);
            $updates[] = "gtID='$gtID'";
        }

        if (isset($data['newUsername'])) {
            $newUsername = $conn->real_escape_string($data['newUsername']);
            $updates[] = "username='$newUsername'";
        }

        if (!empty($updates)) {
            $updateSQL = implode(", ", $updates);
            $sql = "UPDATE admin SET $updateSQL WHERE username='$username'";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Admin info updated successfully"]);
            } else {
                echo json_encode(["error" => "Error updating admin: " . $conn->error]);
            }
        } else {
            echo json_encode(["error" => "No fields provided to update"]);
        }
    } else {
        echo json_encode(["error" => "Username is required for update"]);
    }
}


$conn->close();

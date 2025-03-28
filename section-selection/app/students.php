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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username'], $data['firstChoice'], $data['secondChoice'], $data['thirdChoice'])) {
        $username = $conn->real_escape_string($data['username']);
        $firstChoice = json_encode($data['firstChoice']); // Encode array to JSON
        $secondChoice = json_encode($data['secondChoice']); // Encode array to JSON
        $thirdChoice = json_encode($data['thirdChoice']); // Encode array to JSON

        // Update the student preferences in the database
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

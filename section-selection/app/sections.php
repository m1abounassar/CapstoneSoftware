<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

// ✅ ADD or UPDATE section
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['title'], $data['time'], $data['capacity'])) {
        $title = $conn->real_escape_string($data['title']);
        $time = $conn->real_escape_string($data['time']);
        $capacity = (int)$data['capacity'];

        // Check if it's an update (id exists)
        if (isset($data['id']) && is_numeric($data['id'])) {
            $id = (int)$data['id'];
            $sql = "UPDATE sections SET title='$title', time='$time', capacity=$capacity WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Section updated successfully"]);
            } else {
                echo json_encode(["error" => "Error updating section: " . $conn->error]);
            }
        } else {
            // INSERT new section
            $sql = "INSERT INTO sections (title, time, capacity) VALUES ('$title', '$time', $capacity)";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Section added successfully"]);
            } else {
                echo json_encode(["error" => "Error inserting section: " . $conn->error]);
            }
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

// ✅ DELETE section by ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id']) && is_numeric($data['id'])) {
        $id = (int)$data['id'];
        $sql = "DELETE FROM sections WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Section deleted successfully"]);
        } else {
            echo json_encode(["error" => "Error deleting section: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid or missing section ID"]);
    }
}

$conn->close();
?>

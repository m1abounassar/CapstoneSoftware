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

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Read the input data from the DELETE request
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['gtid'])) {
        $gtid = $conn->real_escape_string($data['gtid']);
        
        // Prepare the SQL to delete the admin with the provided GTID
        $sql = "DELETE FROM admin WHERE gtid='$gtid'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Admin removed successfully"]);
        } else {
            echo json_encode(["error" => "Error removing admin: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Admin GTID is required"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['theirGTID'], $data['yourGTID'])) {
        $theirGTID = $conn->real_escape_string($data['theirGTID']);
        $yourGTID = $conn->real_escape_string($data['yourGTID']);

        // Start a transaction to ensure atomicity
        $conn->begin_transaction();

        try {
            // Set isLead = 0 for yourGTID
            $sql1 = "UPDATE admin SET isLead = 0 WHERE gtid = '$yourGTID'";
            if ($conn->query($sql1) !== TRUE) {
                throw new Exception("Error updating isLead for yourGTID: " . $conn->error);
            }

            // Set isLead = 1 for theirGTID
            $sql2 = "UPDATE admin SET isLead = 1 WHERE gtid = '$theirGTID'";
            if ($conn->query($sql2) !== TRUE) {
                throw new Exception("Error updating isLead for theirGTID: " . $conn->error);
            }

            // Commit the transaction if everything is successful
            $conn->commit();
            echo json_encode(["message" => "Lead updated successfully"]);
        } catch (Exception $e) {
            // Rollback the transaction if something goes wrong
            $conn->rollback();
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "GTID values are required"]);
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['name'], $data['username'], $data['gtid'])) {
        $name = $conn->real_escape_string($data['name']);
        $username = $conn->real_escape_string($data['username']);
        $gtid = $conn->real_escape_string($data['gtid']);
        $isLead = 0; // Default value

        // Validate GTID (must be 9 digits)
        if (!preg_match('/^\d{9}$/', $gtid)) {
            echo json_encode(["error" => "GTID must be exactly 9 digits."]);
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
        $checkSQL = "SELECT * FROM admin WHERE gtid = '$gtid'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["error" => "An admin with this GTID already exists."]);
            exit;
        }

        // Insert new admin with default isLead = 0
        $sql = "INSERT INTO admin (name, username, gtid, isLead) VALUES ('$name', '$username', '$gtid', '$isLead')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Admin added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding admin: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Name, username, and GTID are required"]);
    }
}


$conn->close();

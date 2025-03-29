<?php
header("Content-Type: application/json");

// DEBUG: Enable PHP error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DEBUG: Log start of script
file_put_contents("upload_debug.txt", "=== Upload started at " . date("c") . " ===\n", FILE_APPEND);

// Database connection (Update with your Plesk credentials)
$host = "localhost:3306";
$dbname = "teamsync";
$username = "user1";
$password = "ronnie&matt4eva";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // DEBUG: Log successful DB connection
    file_put_contents("upload_debug.txt", "Connected to DB: $dbname\n", FILE_APPEND);
} catch (PDOException $e) {
    file_put_contents("upload_debug.txt", "Database connection failed: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

if (!isset($_FILES["csvFile"])) {
    file_put_contents("upload_debug.txt", "No file uploaded\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
    exit;
}

$file = $_FILES["csvFile"]["tmp_name"];
if (!file_exists($file)) {
    file_put_contents("upload_debug.txt", "Uploaded file not found\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "File not found"]);
    exit;
}

$handle = fopen($file, "r");
if ($handle === false) {
    file_put_contents("upload_debug.txt", "Failed to open file\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Failed to open file"]);
    exit;
}

$firstRow = true;
$insertedRows = 0;
$updatedRows = 0;
$errors = [];

while (($row = fgetcsv($handle, 1000, ",")) !== false) {
    if ($firstRow) {
        $firstRow = false;
        continue;
    }

    if (count($row) < 4) {
        $msg = "Invalid row format: " . implode(", ", $row);
        $errors[] = $msg;
        file_put_contents("upload_debug.txt", $msg . "\n", FILE_APPEND);
        continue;
    }

    $name = trim($row[0]);
    $gtid = trim($row[1]);
    $email = trim($row[2]);
    $team = (int) trim($row[3]);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $msg = "Invalid email: $email";
        $errors[] = $msg;
        file_put_contents("upload_debug.txt", $msg . "\n", FILE_APPEND);
        continue;
    }

    if (!preg_match('/^\d{9}$/', $gtid)) {
        $msg = "Invalid GTID: $gtid";
        $errors[] = $msg;
        file_put_contents("upload_debug.txt", $msg . "\n", FILE_APPEND);
        continue;
    }

    if (empty($name)) {
        $msg = "Missing name for GTID: $gtid";
        $errors[] = $msg;
        file_put_contents("upload_debug.txt", $msg . "\n", FILE_APPEND);
        continue;
    }

    try {
        $stmt = $pdo->prepare("SELECT GTID FROM users WHERE GTID = ?");
        $stmt->execute([$gtid]);

        if ($stmt->rowCount() > 0) {
            $stmt = $pdo->prepare("UPDATE users SET Name = ?, Email = ?, Team = ? WHERE GTID = ?");
            $stmt->execute([$name, $email, $team, $gtid]);
            $updatedRows++;

            // DEBUG: Log update
            file_put_contents("upload_debug.txt", "Updated: $gtid | $name | $email | $team\n", FILE_APPEND);
        } else {
            $stmt = $pdo->prepare("INSERT INTO users (GTID, Name, Email, Team, isAdmin) VALUES (?, ?, ?, ?, 0)");
            $stmt->execute([$gtid, $name, $email, $team]);
            $insertedRows++;

            // DEBUG: Log insert
            file_put_contents("upload_debug.txt", "Inserted: $gtid | $name | $email | $team\n", FILE_APPEND);
        }
    } catch (PDOException $e) {
        $msg = "Database error for GTID $gtid: " . $e->getMessage();
        $errors[] = $msg;
        file_put_contents("upload_debug.txt", $msg . "\n", FILE_APPEND);
    }
}

fclose($handle);

// DEBUG: Log totals
file_put_contents("upload_debug.txt", "Inserted: $insertedRows, Updated: $updatedRows\n", FILE_APPEND);
if (!empty($errors)) {
    file_put_contents("upload_debug.txt", "Errors:\n" . implode("\n", $errors) . "\n", FILE_APPEND);
}

$response = ["success" => true, "inserted" => $insertedRows, "updated" => $updatedRows];
if (!empty($errors)) {
    $response["errors"] = $errors;
}

echo json_encode($response);
?>

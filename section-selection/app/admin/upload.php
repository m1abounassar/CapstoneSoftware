<?php
header("Content-Type: application/json");

// Database connection (Update with your Plesk credentials)
$host = "localhost:3306"; // Plesk usually uses "localhost" or "127.0.0.1"
$dbname = "teamsync"; // Your database name from Plesk
$username = "user1"; // Your database username from Plesk
$password = "ronnie&matt4eva"; // Your database password from Plesk

try {
    // Connect to MySQL using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Check if a file was uploaded
if (!isset($_FILES["csvFile"])) {
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
    exit;
}

$file = $_FILES["csvFile"]["tmp_name"];
if (!file_exists($file)) {
    echo json_encode(["success" => false, "error" => "File not found"]);
    exit;
}

// Open the CSV file
$handle = fopen($file, "r");
if ($handle === false) {
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
        continue; // Skip header row
    }

    // Ensure the CSV row has exactly 4 columns (Name, GTID, Email, Team)
    if (count($row) < 4) {
        $errors[] = "Invalid row format: " . implode(", ", $row);
        continue;
    }

    // Extract and sanitize data
    $name = trim($row[0]);
    $gtid = trim($row[1]);
    $email = trim($row[2]);
    $team = (int) trim($row[3]);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email: $email";
        continue;
    }

    // Validate GTID (must be numeric and exactly 9 digits)
    if (!preg_match('/^\d{9}$/', $gtid)) {
        $errors[] = "Invalid GTID: $gtid";
        continue;
    }

    // Validate name (must not be empty)
    if (empty($name)) {
        $errors[] = "Missing name for GTID: $gtid";
        continue;
    }

    try {
        // Check if GTID already exists (to update instead of insert)
        $stmt = $pdo->prepare("SELECT GTID FROM users WHERE GTID = ?");
        $stmt->execute([$gtid]);

        if ($stmt->rowCount() > 0) {
            // Update existing record
            $stmt = $pdo->prepare("UPDATE users SET Name = ?, Email = ?, Team = ? WHERE GTID = ?");
            $stmt->execute([$name, $email, $team, $gtid]);
            $updatedRows++;
        } else {
            // Insert new record
            $stmt = $pdo->prepare("INSERT INTO users (GTID, Name, Email, Team, isAdmin) VALUES (?, ?, ?, ?, 0)");
            $stmt->execute([$gtid, $name, $email, $team]);
            $insertedRows++;
        }
    } catch (PDOException $e) {
        $errors[] = "Database error for GTID $gtid: " . $e->getMessage();
    }
}

fclose($handle);

// Response message
$response = ["success" => true, "inserted" => $insertedRows, "updated" => $updatedRows];
if (!empty($errors)) {
    $response["errors"] = $errors;
}

echo json_encode($response);
?>

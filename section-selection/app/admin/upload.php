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
} catch (PDOException $e) {
    file_put_contents("upload_debug.txt", "DB error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

if (!isset($_FILES["csvFile"])) {
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
    exit;
}

$file = $_FILES["csvFile"]["tmp_name"];
if (!is_uploaded_file($file)) {
    echo json_encode(["success" => false, "error" => "File upload failed"]);
    exit;
}

$teamMap = [];

if (($handle = fopen($file, "r")) !== FALSE) {
    fgetcsv($handle); // skip header
    while (($data = fgetcsv($handle)) !== FALSE) {
        /* list($name, $gtID, $email, $team) = array_map('trim', $data);
        $username = strtok($email, '@');
        $team = (string)$team;
        $gtID = (string)(int)$gtID;
        $team = (string)(int)$team; */
        list($name, $gtID, $email, $team) = array_map('trim', $data);

        // Skip if any required field is missing or GTID/team is invalid
        if (empty($name) || empty($gtID) || empty($email)) {
            continue;
        }

        $username = strtok($email, '@');
        $gtID = (string)(int)$gtID;
        $team = (string)(int)$team;

        // Skip if GTID or team is not a valid number
        if (!ctype_digit($gtID) || $gtID === "0") {
            continue;
        }
        
        // Insert student
        $stmt = $pdo->prepare("INSERT INTO students (name, gtID, username, team, firstChoice, secondChoice, thirdChoice)
                               VALUES (:name, :gtID, :username, :team, '[]', '[]', '[]')
                               ON DUPLICATE KEY UPDATE name = VALUES(name), team = VALUES(team)");
        $stmt->execute([
            ':name' => $name,
            ':gtID' => $gtID,
            ':username' => $username,
            ':team' => $team
        ]);

        // Add to teamMap
        if ($team !== "" && $team !== null && ctype_digit($team) && $team !== "0") {
            if (!isset($teamMap[$team])) {
                $teamMap[$team] = [];
            }
            $teamMap[$team][] = $gtID;
        }
    }
    fclose($handle);
}

// Update/create teams
foreach ($teamMap as $teamName => $gtidList) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM teams WHERE name = :teamName");
        $stmt->execute([':teamName' => $teamName]);

        if ($stmt->rowCount() > 0) {
            $team = $stmt->fetch(PDO::FETCH_ASSOC);
            $existingMembers = json_decode($team['members'], true);
            $updatedMembers = array_unique(array_merge($existingMembers ?? [], $gtidList));

            $update = $pdo->prepare("UPDATE teams SET members = :members WHERE name = :teamName");
            $update->execute([
                ':members' => json_encode($updatedMembers),
                ':teamName' => $teamName
            ]);
        } else {
            $insert = $pdo->prepare("INSERT INTO teams (name, members, section, status, clientName, projectName, projectDesc)
                                     VALUES (:name, :members, NULL, 1, NULL, NULL, NULL)");
            $insert->execute([
                ':name' => $teamName,
                ':members' => json_encode($gtidList)
            ]);
        }
    } catch (Exception $e) {
        file_put_contents("upload_debug.txt", "Team error for $teamName: " . $e->getMessage() . "\n", FILE_APPEND);
        echo json_encode(["success" => false, "error" => "Team insert/update failed for $teamName"]);
        exit;
    }
}

echo json_encode(["success" => true, "message" => "CSV processed successfully."]);
?>
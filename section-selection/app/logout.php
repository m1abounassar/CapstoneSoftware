<?php
session_start();
session_destroy();

// Optional: Log them out of CAS globally
$casLogoutUrl = 'https://login.gatech.edu/cas/logout';
header("Location: $casLogoutUrl");
exit;
?>

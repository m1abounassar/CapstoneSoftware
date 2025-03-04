<?php
// Base URL for your site
define('BASE_URL', 'https://jdregistration.sci.gatech.edu');

// CAS service URL (the page CAS returns to after login). It should not hardcode a specific redirect.
define('CAS_SERVICE', BASE_URL . '/app/api/auth/cas-login.php');

?>

<?php
session_start();
if (!isset($_SESSION['username'])) {
   header("Location: ../HOMEPAGE/Home.php");
    exit();
}

// I-include ang HTML content
include('../HOMEPAGE/index.html');
?>

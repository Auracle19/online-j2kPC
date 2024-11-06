<?php
session_start();
if (!isset($_SESSION['username'])) {
   header("Location: ../Product/Processors.html");
    exit();
}

// I-include ang HTML content
include('../Product/Processors.html');
?>

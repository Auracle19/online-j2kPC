<?php
session_start();
$mysqli = new mysqli("localhost", "root", "", "j2k_shop");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['signup'])) {
        // Signup logic
        $username = $_POST['username'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $email = $_POST['email'];

        $stmt = $mysqli->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $password, $email);
        
        if ($stmt->execute()) {
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            header("Location: ../HOMEPAGE/Home.php");
            exit();
        } else {
            echo "Signup Error: " . $stmt->error;
        }
    } elseif (isset($_POST['login'])) {
        // Login logic
        $username = $_POST['username'];
        $password = $_POST['password'];

        $stmt = $mysqli->prepare("SELECT password, email FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($hashed_password, $email);
            $stmt->fetch();
            if (password_verify($password, $hashed_password)) {
                $_SESSION['username'] = $username;
                $_SESSION['email'] = $email;
                header("Location: ../HOMEPAGE/Home.php");
                exit();
            } else {
                echo "Login Error: Invalid password.";
            }
        } else {
            echo "Login Error: No user found.";
        }
    } else {
        echo "Request Error: No valid POST data.";
    }
} else {
    echo "Request Error: Invalid request method.";
}
?>

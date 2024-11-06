<?php
session_start(); // Start the session

// Database connection
$servername = "localhost";
$username = "root"; // Default username
$password = ""; // Default password (usually empty for XAMPP)
$dbname = "j2k_shop";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get order details from POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve JSON payload
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if data is properly received
    if (isset($data['name'], $data['email'], $data['address'], $data['phone'], $data['paymentMethod'], $data['total'], $data['items'])) {
        $customer_name = $data['name'];
        $customer_email = $data['email'];
        $customer_address = $data['address'];
        $customer_phone = $data['phone'];
        $payment_method = $data['paymentMethod'];
        $order_total = $data['total'];

        // Prepare and bind order statement
        $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_email, customer_address, customer_phone, payment_method, order_total) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $customer_name, $customer_email, $customer_address, $customer_phone, $payment_method, $order_total);
        
        if ($stmt->execute()) {
            $orderId = $stmt->insert_id; // Get the last inserted order ID
            
            // Prepare statement for order items
            $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)");
            $itemStmt->bind_param("issi", $orderId, $product_id, $product_name, $quantity);
            
            // Loop through items and insert them
            foreach ($data['items'] as $item) {
                $product_id = $item['id'];
                $product_name = $item['name'];
                $quantity = $item['quantity'];
                $itemStmt->execute();
            }
            
            // Close the item statement
            $itemStmt->close();
            echo "Order placed successfully. Your order ID is: " . $orderId;
        } else {
            echo "Error placing order: " . $stmt->error;
        }

        // Close the order statement
        $stmt->close();
    } else {
        echo "Invalid order data.";
    }
}

// Close connection
$conn->close();
?>

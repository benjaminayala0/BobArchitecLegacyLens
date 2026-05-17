<?php

$conn = mysqli_connect("localhost", "root", "", "old_system_db");

function doEverything($action, $data) {
    global $conn;
    
    if($action == "create_user") {
        $u = $data['user'];
        $p = md5($data['pass']); // Insecure, old style
        $q = "INSERT INTO tb_users (usr_name, usr_pwd, created_date, status) VALUES ('$u', '$p', NOW(), 1)";
        mysqli_query($conn, $q);
        
        // Send email mixed with DB logic
        mail($data['email'], "Welcome", "You are registered.");
        echo "User added.";
    } 
    elseif ($action == "add_order") {
        $uid = $data['uid'];
        $tot = $data['total'];
        $items = $data['items']; // comma separated string e.g. "1,4,5"
        
        $q = "INSERT INTO orders (user_id, total_amount, items_str, order_date) VALUES ($uid, $tot, '$items', NOW())";
        mysqli_query($conn, $q);
        $order_id = mysqli_insert_id($conn);
        
        // Calculate tax inline
        $tax = $tot * 0.21;
        $q2 = "UPDATE orders SET tax = $tax WHERE id = $order_id";
        mysqli_query($conn, $q2);
        
        echo "Order processed.";
    }
    elseif ($action == "get_user_report") {
        // Massive join and HTML echo mixed in logic
        $res = mysqli_query($conn, "SELECT u.usr_name, o.total_amount, o.order_date FROM tb_users u JOIN orders o ON u.id = o.user_id WHERE u.status = 1");
        
        echo "<table border='1'><tr><th>User</th><th>Total</th><th>Date</th></tr>";
        while($row = mysqli_fetch_assoc($res)) {
            echo "<tr><td>".$row['usr_name']."</td><td>".$row['total_amount']."</td><td>".$row['order_date']."</td></tr>";
        }
        echo "</table>";
    }
}

// Global execution
if(isset($_POST['action'])) {
    doEverything($_POST['action'], $_POST);
}
?>

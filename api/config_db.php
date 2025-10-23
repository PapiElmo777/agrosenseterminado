<?php
// 🛑 DEBES REEMPLAZAR ESTOS VALORES 🛑
define('DB_SERVER', 'localhost:3307'); // AJUSTADO. Si usas 3306, cámbialo a 'localhost'.
define('DB_USERNAME', 'root');                
define('DB_PASSWORD', '');                    
define('DB_NAME', 'agrosense_db'); // ¡REVISA ESTO!
define('TABLE_NAME', 'lecturas_sensores');  

$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die("❌ ERROR FATAL DE CONEXIÓN: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4"); 
?>

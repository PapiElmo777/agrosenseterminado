<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config_db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

// Objeto de respuesta
$respuesta = [
    'error' => false,
    'datos' => [],
    'total' => 0
];

// Incluí 'id' como vi en tu respuesta
$sql = "SELECT id, timestamp, temperatura, humedad, ph FROM " . TABLE_NAME . " ORDER BY timestamp DESC LIMIT 200";
$result = $conn->query($sql);

if ($result) {
    $datos_temp = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos_temp[] = $row;
        }
        // Revertir para Chart.js: El más viejo primero
        $respuesta['datos'] = array_reverse($datos_temp); 
        $respuesta['total'] = $result->num_rows;
    }
    // Si no hay filas, 'datos' se queda como [] y 'total' como 0
} else {
    // Hubo un error en la consulta SQL
    $respuesta['error'] = true;
    $respuesta['mensaje'] = "Error en la consulta SQL: " . $conn->error;
}

echo json_encode($respuesta);

$conn->close();
?>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Usa tu archivo de configuración
require_once 'config_db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

$respuesta = [
    'error' => false,
    'datos' => [],
    'total' => 0
];

// =================================================================
// ¡¡AQUÍ ESTÁ LA CORRECCIÓN!!
// Se quitó 'temperatura' de la consulta SQL.
// Usa TABLE_NAME de tu config_db.php
$sql = "SELECT id, timestamp, humedad, ph FROM " . TABLE_NAME . " ORDER BY timestamp DESC LIMIT 200";
// =================================================================

$result = $conn->query($sql);

if ($result) {
    $datos_temp = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $datos_temp[] = $row;
        }
        $respuesta['datos'] = array_reverse($datos_temp); 
        $respuesta['total'] = $result->num_rows;
    }
} else {
    // ¡Este es el error que estás viendo!
    $respuesta['error'] = true;
    $respuesta['mensaje'] = "Error en la consulta SQL: " . $conn->error;
}

echo json_encode($respuesta);

$conn->close();
?>
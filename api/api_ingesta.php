<?php
// Incluir el archivo de conexión
require_once 'config_db.php';

// Asegura que solo se procesen peticiones POST (como las que enviará el ESP32)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Obtener y sanitizar los datos recibidos
    $temperatura = isset($_POST['temperatura']) ? $conn->real_escape_string($_POST['temperatura']) : null;
    $humedad = isset($_POST['humedad']) ? $conn->real_escape_string($_POST['humedad']) : null;
    $ph = isset($_POST['ph']) ? $conn->real_escape_string($_POST['ph']) : null;

    // Verificar que los datos no sean nulos
    if ($temperatura === null || $humedad === null || $ph === null) {
        http_response_code(400); // Bad Request
        die("Error: Faltan parámetros (temperatura, humedad, o ph).");
    }

    // Consulta SQL preparada para insertar los datos
    $sql = "INSERT INTO " . TABLE_NAME . " (temperatura, humedad, ph) VALUES (?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        // 'ddd' indica que los tres parámetros son de tipo decimal/double
        $stmt->bind_param("ddd", $temperatura, $humedad, $ph); 

        if ($stmt->execute()) {
            http_response_code(200); // OK
            echo "Datos guardados exitosamente";
        } else {
            http_response_code(500); // Internal Server Error
            echo "Error al ejecutar la consulta: " . $stmt->error;
        }

        $stmt->close();
    } else {
        http_response_code(500);
        echo "Error al preparar la consulta: " . $conn->error;
    }

} else {
    // Si el método no es POST
    http_response_code(405); // Method Not Allowed
    echo "Método no permitido. Solo se acepta POST.";
}

$conn->close();
?>
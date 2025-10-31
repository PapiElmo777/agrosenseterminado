<?php
// Incluir el archivo de conexión
require_once 'config_db.php'; // $conn se crea aquí

// =======================================================
//  ¡INICIO DE LA CORRECCIÓN! 
// 1. Desactivamos el auto-guardado para controlarlo nosotros.
$conn->autocommit(FALSE);
// =======================================================

// Asegura que solo se procesen peticiones POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $humedad = isset($_POST['humedad']) ? $conn->real_escape_string($_POST['humedad']) : null;
    $ph = isset($_POST['ph']) ? $conn->real_escape_string($_POST['ph']) : null;

    if ($humedad === null || $ph === null) {
        http_response_code(400); 
        die("Error: Faltan parámetros (humedad o ph).");
    }

    // USA LOS NOMBRES DE TU TABLA Y DB
    $sql = "INSERT INTO " . TABLE_NAME . " (humedad, ph) VALUES (?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        
        $stmt->bind_param("dd", $humedad, $ph); 

        if ($stmt->execute()) {
            http_response_code(200); 
            echo "Datos guardados exitosamente";
            
            // =======================================================
            // 2. ¡CONFIRMAMOS! Le decimos a la BD que guarde permanentemente.
            $conn->commit(); 
            // =======================================================

        } else {
            http_response_code(500); 
            echo "Error al ejecutar la consulta: " . $stmt->error;

            // =======================================================
            // 3. (Extra) Si falló, revertimos cualquier cambio.
            $conn->rollback(); 
            // =======================================================
        }

        $stmt->close();
    } else {
        http_response_code(500);
        echo "Error al preparar la consulta: " . $conn->error;
        $conn->rollback(); // Revertimos si la preparación falló
    }

} else {
    http_response_code(405); 
    echo "Método no permitido. Solo se acepta POST.";
}

$conn->close();
?>
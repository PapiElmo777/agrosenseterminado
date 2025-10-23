// js/graficas.js (o dentro de una etiqueta <script> en tu HTML)

// js/graficas.js

// 🛑 ¡NOTA!: La URL debe ser 'http://localhost/Agrosense/api/api_lectura.php'
// La he corregido aquí y asumimos que tu carpeta se llama 'Agrosense'
const API_URL = 'http://localhost/AGROCENSE/api/api_lectura.php'; 

function cargarDatosYGraficar() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al conectar con la API: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                 document.getElementById('graficaTemperatura').innerHTML = 'No hay datos disponibles para graficar.';
                 return;
            }

            // 1. DIBUJAR LA GRÁFICA USANDO AMCHARTS
            am4core.ready(function() {
                // Tema opcional para un mejor aspecto
                am4core.useTheme(am4themes_animated);

                // Crea la instancia del gráfico. El ID DEBE coincidir con el <canvas> o <div> en tu HTML
                var chart = am4core.create("graficaTemperatura", am4charts.XYChart);

                // Asigna los datos obtenidos de la API directamente al gráfico
                // ¡IMPORTANTE!: Tu API ya devuelve los datos en el orden correcto (antiguo -> nuevo)
                chart.data = data; 
                
                // Configuración de Ejes
                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.dataFields.category = "timestamp"; // Usa el campo 'timestamp' de tu JSON
                dateAxis.renderer.minGridDistance = 50;
                
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.title.text = "Temperatura (°C)";
                
                // Configuración de la Serie (la línea de la gráfica)
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "timestamp"; // Eje X: Tiempo
                series.dataFields.valueY = "temperatura"; // Eje Y: Valores de temperatura
                series.strokeWidth = 3;
                series.name = "Temperatura (°C)";
                series.tooltipText = "Temperatura: [bold]{valueY}°C[/]";

                // Añadir un punto a cada valor
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.radius = 4;
                bullet.circle.strokeWidth = 2;
                
                // Otras opciones
                chart.cursor = new am4charts.XYCursor();
            });

            // 2. Aquí iría el código para llenar la tabla de historial si lo necesitas

        })
        .catch(error => console.error('Error al obtener datos:', error));
}

// Llamar a la función cuando la página cargue
cargarDatosYGraficar();
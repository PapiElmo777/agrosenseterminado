// js/humedad.js
const API_URL = 'http://localhost/AGROSENCE/api/api_lectura.php';

function llenarTablaHistorial(tbodyId, data, valueKey, valueLabel, decimalPlaces = 2) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Esta función SÍ espera un array, por eso 'data' aquí debe ser 'data.datos'
    const reversedData = [...data].reverse();

    reversedData.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell().textContent = item.timestamp.replace(' ', ' '); 
        row.insertCell().textContent = parseFloat(item[valueKey]).toFixed(decimalPlaces) + valueLabel;
    });
}

function cargarDatosYGraficarHumedad() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => { // 'data' es el objeto { error: false, datos: [...], total: 5 }
            
            // ✅ CORREGIDO: Usamos data.total o data.datos.length
            if (data.total === 0) return;
            
            // 🛑 ¡EL ERROR ESTABA AQUÍ! 🛑
            // Le pasamos 'data.datos' (el array) a la función, no 'data' (el objeto)
            llenarTablaHistorial('humedad-history-body', data.datos, 'humedad', ' %', 1); // ✅

            // Esto ya estaba correcto:
            const timestamps = data.datos.map(item => item.timestamp);
            const humedades = data.datos.map(item => parseFloat(item.humedad));
            
            const ctx = document.getElementById('graficaHumedad')?.getContext('2d');
            if (!ctx) return;
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps, 
                    datasets: [{
                        label: 'Humedad del Suelo (%)',
                        data: humedades,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: { responsive: true, scales: { y: { min: 20, max: 100 } } }
            });
        })
        .catch(error => console.error('Error al cargar datos de humedad:', error));
}
document.addEventListener('DOMContentLoaded', cargarDatosYGraficarHumedad);
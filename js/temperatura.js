// js/temperatura.js
const API_URL = 'http://localhost/AGROSENCE/api/api_lectura.php'; // RUTA CORREGIDA

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

function cargarDatosYGraficarTemperatura() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => { // 'data' es el objeto { error: false, datos: [...], total: 5 }
            
            // ✅ CORREGIDO: Usamos data.total
            if (data.total === 0) return;
            
            // ✅ CORREGIDO: Le pasamos 'data.datos' (el array) a la función
            llenarTablaHistorial('temperatura-history-body', data.datos, 'temperatura', ' °C', 1);

            // ✅ CORREGIDO: Usamos 'data.datos.map'
            const timestamps = data.datos.map(item => item.timestamp);
            const temperaturas = data.datos.map(item => parseFloat(item.temperatura));
            
            const ctx = document.getElementById('graficaTemperatura')?.getContext('2d');
            if (!ctx) return;
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps, 
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: temperaturas,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: false } } }
            });
        })
        .catch(error => console.error('Error al cargar datos de temperatura:', error));
}
document.addEventListener('DOMContentLoaded', cargarDatosYGraficarTemperatura);
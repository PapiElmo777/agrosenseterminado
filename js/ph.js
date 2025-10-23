// js/ph.js
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

function cargarDatosYGraficarPH() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => { // 'data' es el objeto { error: false, datos: [...], total: 5 }
            
            // ✅ CORREGIDO: Usamos data.total
            if (data.total === 0) return;
            
            // ✅ CORREGIDO: Le pasamos 'data.datos' (el array) a la función
            llenarTablaHistorial('ph-history-body', data.datos, 'ph', '', 2);

            // ✅ CORREGIDO: Usamos 'data.datos.map'
            const timestamps = data.datos.map(item => item.timestamp);
            const ph_values = data.datos.map(item => parseFloat(item.ph));
            
            const ctx = document.getElementById('graficaPH')?.getContext('2d');
            if (!ctx) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps, 
                    datasets: [{
                        label: 'Nivel de pH del Suelo',
                        data: ph_values,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: { responsive: true, scales: { y: { min: 4, max: 9 } } }
            });
        })
        .catch(error => console.error('Error al cargar datos de pH:', error));
}
document.addEventListener('DOMContentLoaded', cargarDatosYGraficarPH);
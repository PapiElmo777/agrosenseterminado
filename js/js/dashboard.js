// js/dashboard.js
const API_URL = 'http://localhost/AGROSENCE/api/api_lectura.php'; 

function dibujarGrafica(canvasId, labels, dataSet, labelText, borderColor, backgroundColor, minY, maxY) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: labelText,
                data: dataSet,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { min: minY, max: maxY, beginAtZero: false, title: { display: false } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}


function cargarDashboardData() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('HTTP Error: ' + response.statusText);
            return response.json();
        })
        .then(data => { 
            const gridContainer = document.querySelector('.dashboard-grid');
            
            if (data.error || data.total === 0) {
                if (gridContainer) gridContainer.innerHTML = '<p style="text-align:center; padding: 20px;">No hay datos en la base de datos.</p>';
                return;
            }

            const timestamps = data.datos.map(item => item.timestamp);
            // const temperaturas = data.datos.map(item => parseFloat(item.temperatura)); // ELIMINADO
            const humedades = data.datos.map(item => parseFloat(item.humedad));
            const ph_values = data.datos.map(item => parseFloat(item.ph));

            // Dibuja solo las 2 gráficass
            // dibujarGrafica('graficaDashboardTemperatura', timestamps, temperaturas, 'Temperatura (°C)', 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.2)', 15, 35); // ELIMINADO
            dibujarGrafica('graficaDashboardHumedad', timestamps, humedades, 'Humedad del Suelo (%)', 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)', 20, 100);
            dibujarGrafica('graficaDashboardPH', timestamps, ph_values, 'Nivel de pH', 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.2)', 4, 9);
        })
        .catch(error => {
            console.error('Error al cargar dashboard:', error);
            const gridContainer = document.querySelector('.dashboard-grid');
            if (gridContainer) gridContainer.innerHTML = `<p style="color:red; text-align:center;">ERROR DE API: No se pudo cargar la data. ${error.message}</p>`;
        });
}

document.addEventListener('DOMContentLoaded', cargarDashboardData);
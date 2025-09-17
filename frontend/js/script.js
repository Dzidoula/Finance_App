import Chart from 'chart.js/auto';

const ctx = document.getElementById('monDiagramme')
new Chart(ctx,
    {
        type:"bar",
        data: {
            labels:["Janvier","Février","Mars","Avril"],
            datasets:[{
                label: "Données de vente",
                data : [12,19,3,5],
                backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y:{
                    beginAtZero:true
                }
            }
        }
    }
)
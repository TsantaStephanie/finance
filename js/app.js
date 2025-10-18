// Configuration des couleurs
const CHART_COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
    '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f'
];

// Variables globales
let recettesChart, recettesFiscalesChart, recettesDouanieresChart;
let currentRecetteType = 'fiscales';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadRecettesData();
    loadDashboardStats();
}

// Navigation
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Mettre à jour les classes actives
            menuItems.forEach(mi => mi.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(section).classList.add('active');
            
            // Mettre à jour le titre
            const titles = {
                'recettes': 'Recettes',
                'depenses': 'Dépenses',
                'dashboard': 'Dashboard'
            };
            pageTitle.textContent = titles[section];
        });
    });
}

// Chargement des données des recettes
async function loadRecettesData() {
    try {
        const response = await fetch('api/get_recettes.php');
        const data = await response.json();
        
        if (data.success) {
            createRecettesChart(data.data);
            updateRecettesTable(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
    }
}

// Création du graphique circulaire des recettes
function createRecettesChart(data) {
    const ctx = document.getElementById('recettesChart').getContext('2d');
    
    // Calculer les totaux par catégorie
    const categories = {
        'Fiscales': data.fiscales.reduce((sum, item) => sum + parseFloat(item.lf_2025), 0),
        'Douanières': data.douanieres.reduce((sum, item) => sum + parseFloat(item.lf_2025), 0),
        'Non Fiscales': data.nonFiscales.reduce((sum, item) => sum + parseFloat(item.lf_2025), 0),
        'Dons': data.dons.reduce((sum, item) => sum + parseFloat(item.lf_2025), 0)
    };

    const labels = Object.keys(categories);
    const values = Object.values(categories);
    const colors = CHART_COLORS.slice(0, labels.length);

    recettesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value.toLocaleString()}M (${percentage}%)`;
                        }
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const category = labels[index];
                    showRecetteDetails(category, data);
                }
            }
        }
    });

    // Créer la légende personnalisée
    createCustomLegend(labels, colors, 'recettesLegend');
}

// Création des graphiques de détails
function showRecetteDetails(category, data) {
    let chartData, title, recetteType;
    
    switch(category) {
        case 'Fiscales':
            chartData = data.fiscales;
            title = 'Recettes Fiscales';
            recetteType = 'fiscales';
            break;
        case 'Douanières':
            chartData = data.douanieres;
            title = 'Recettes Douanières';
            recetteType = 'douanieres';
            break;
        case 'Non Fiscales':
            chartData = data.nonFiscales;
            title = 'Recettes Non Fiscales';
            recetteType = 'non-fiscales';
            break;
        case 'Dons':
            chartData = data.dons;
            title = 'Dons';
            recetteType = 'dons';
            break;
    }

    createDetailCharts(chartData, title);
    updateDetailTableFromClick(chartData, title, recetteType);
}

function createDetailCharts(data, title) {
    // Graphique des recettes fiscales
    const ctx1 = document.getElementById('recettesFiscalesChart').getContext('2d');
    if (recettesFiscalesChart) recettesFiscalesChart.destroy();
    
    const labels = data.map(item => item.nature_impot || item.nature_droit || item.type_recette || item.type_don);
    const values2024 = data.map(item => parseFloat(item.lfr_2024 || item.lf_2024));
    const values2025 = data.map(item => parseFloat(item.lf_2025));

    recettesFiscalesChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '2024',
                data: values2024,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '2025',
                data: values2025,
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title + ' - Évolution 2024-2025'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + 'M';
                        }
                    }
                }
            }
        }
    });

    // Graphique des recettes douanières (utilisé pour le deuxième graphique)
    const ctx2 = document.getElementById('recettesDouanieresChart').getContext('2d');
    if (recettesDouanieresChart) recettesDouanieresChart.destroy();
    
    recettesDouanieresChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '2024',
                data: values2024,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: '#667eea',
                borderWidth: 1
            }, {
                label: '2025',
                data: values2025,
                backgroundColor: 'rgba(118, 75, 162, 0.7)',
                borderColor: '#764ba2',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title + ' - Comparaison 2024-2025'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Mise à jour du tableau de détails
function updateDetailTable(data, title) {
    const tbody = document.getElementById('recettesTableBody');
    tbody.innerHTML = '';

    let total2024 = 0;
    let total2025 = 0;

    data.forEach(item => {
        const row = document.createElement('tr');
        const value2024 = parseFloat(item.lfr_2024 || item.lf_2024);
        const value2025 = parseFloat(item.lf_2025);
        const ecart = value2025 - value2024;
        const evolution = value2024 > 0 ? ((ecart / value2024) * 100).toFixed(1) : 0;

        total2024 += value2024;
        total2025 += value2025;

        row.innerHTML = `
            <td>${item.nature_impot || item.nature_droit || item.type_recette || item.type_don}</td>
            <td>${value2024.toLocaleString()}</td>
            <td>${value2025.toLocaleString()}</td>
            <td class="${ecart >= 0 ? 'positive' : 'negative'}">${ecart >= 0 ? '+' : ''}${ecart.toLocaleString()}</td>
            <td class="${evolution >= 0 ? 'positive' : 'negative'}">${evolution >= 0 ? '+' : ''}${evolution}%</td>
        `;
        tbody.appendChild(row);
    });

    // Ajouter la ligne de totaux et moyennes
    addTotalsRow(tbody, total2024, total2025, data.length);
}

// Mise à jour du tableau depuis un clic sur le graphique circulaire
function updateDetailTableFromClick(data, title, recetteType) {
    // Mettre à jour le sélecteur
    const select = document.getElementById('recetteType');
    select.value = recetteType;
    
    // Mettre à jour le tableau
    const tbody = document.getElementById('recettesTableBody');
    tbody.innerHTML = '';

    let total2024 = 0;
    let total2025 = 0;

    data.forEach(item => {
        const row = document.createElement('tr');
        const value2024 = parseFloat(item.lfr_2024 || item.lf_2024);
        const value2025 = parseFloat(item.lf_2025);
        const ecart = value2025 - value2024;
        const evolution = value2024 > 0 ? ((ecart / value2024) * 100).toFixed(1) : 0;

        total2024 += value2024;
        total2025 += value2025;

        row.innerHTML = `
            <td>${item.nature_impot || item.nature_droit || item.type_recette || item.type_don}</td>
            <td>${value2024.toLocaleString()}</td>
            <td>${value2025.toLocaleString()}</td>
            <td class="${ecart >= 0 ? 'positive' : 'negative'}">${ecart >= 0 ? '+' : ''}${ecart.toLocaleString()}</td>
            <td class="${evolution >= 0 ? 'positive' : 'negative'}">${evolution >= 0 ? '+' : ''}${evolution}%</td>
        `;
        tbody.appendChild(row);
    });

    // Ajouter la ligne de totaux et moyennes
    addTotalsRow(tbody, total2024, total2025, data.length);
}

// Ajout de la ligne de totaux et moyennes
function addTotalsRow(tbody, total2024, total2025, count) {
    const ecart = total2025 - total2024;
    const evolution = total2024 > 0 ? ((ecart / total2024) * 100).toFixed(1) : 0;
    const moyenne2024 = (total2024 / count).toFixed(1);
    const moyenne2025 = (total2025 / count).toFixed(1);

    // Ligne de totaux
    const totalsRow = document.createElement('tr');
    totalsRow.className = 'totals-row';
    totalsRow.innerHTML = `
        <td><strong>TOTAL</strong></td>
        <td><strong>${total2024.toLocaleString()}</strong></td>
        <td><strong>${total2025.toLocaleString()}</strong></td>
        <td class="${ecart >= 0 ? 'positive' : 'negative'}"><strong>${ecart >= 0 ? '+' : ''}${ecart.toLocaleString()}</strong></td>
        <td class="${evolution >= 0 ? 'positive' : 'negative'}"><strong>${evolution >= 0 ? '+' : ''}${evolution}%</strong></td>
    `;
    tbody.appendChild(totalsRow);

    // Ligne de moyennes
    const averagesRow = document.createElement('tr');
    averagesRow.className = 'averages-row';
    averagesRow.innerHTML = `
        <td><em>MOYENNE</em></td>
        <td><em>${moyenne2024}</em></td>
        <td><em>${moyenne2025}</em></td>
        <td><em>${(moyenne2025 - moyenne2024).toFixed(1)}</em></td>
        <td><em>${evolution}%</em></td>
    `;
    tbody.appendChild(averagesRow);
}

// Création de la légende personnalisée
function createCustomLegend(labels, colors, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${colors[index]}"></span>
            <span>${label}</span>
        `;
        container.appendChild(legendItem);
    });
}

// Mise à jour du tableau des recettes
function updateRecettesTable(data) {
    const select = document.getElementById('recetteType');
    const tbody = document.getElementById('recettesTableBody');
    const natureFilter = document.getElementById('natureFilter');
    const montantMin = document.getElementById('montantMin');
    const montantMax = document.getElementById('montantMax');
    const clearFilters = document.getElementById('clearFilters');

    let currentData = [];

    function filterData(tableData) {
        let filteredData = [...tableData];
        
        // Filtre par nature
        const natureSearch = natureFilter.value.toLowerCase();
        if (natureSearch) {
            filteredData = filteredData.filter(item => {
                const nature = (item.nature_impot || item.nature_droit || item.type_recette || item.type_don || '').toLowerCase();
                return nature.includes(natureSearch);
            });
        }
        
        // Filtre par montant minimum
        const minValue = parseFloat(montantMin.value);
        if (!isNaN(minValue)) {
            filteredData = filteredData.filter(item => {
                const value2025 = parseFloat(item.lf_2025);
                return value2025 >= minValue;
            });
        }
        
        // Filtre par montant maximum
        const maxValue = parseFloat(montantMax.value);
        if (!isNaN(maxValue)) {
            filteredData = filteredData.filter(item => {
                const value2025 = parseFloat(item.lf_2025);
                return value2025 <= maxValue;
            });
        }
        
        return filteredData;
    }

    function updateTable(tableData) {
        currentData = tableData;
        const filteredData = filterData(tableData);
        
        tbody.innerHTML = '';
        let total2024 = 0;
        let total2025 = 0;

        filteredData.forEach(item => {
            const row = document.createElement('tr');
            const value2024 = parseFloat(item.lfr_2024 || item.lf_2024);
            const value2025 = parseFloat(item.lf_2025);
            const ecart = value2025 - value2024;
            const evolution = value2024 > 0 ? ((ecart / value2024) * 100).toFixed(1) : 0;

            total2024 += value2024;
            total2025 += value2025;

            row.innerHTML = `
                <td>${item.nature_impot || item.nature_droit || item.type_recette || item.type_don}</td>
                <td>${value2024.toLocaleString()}</td>
                <td>${value2025.toLocaleString()}</td>
                <td class="${ecart >= 0 ? 'positive' : 'negative'}">${ecart >= 0 ? '+' : ''}${ecart.toLocaleString()}</td>
                <td class="${evolution >= 0 ? 'positive' : 'negative'}">${evolution >= 0 ? '+' : ''}${evolution}%</td>
            `;
            tbody.appendChild(row);
        });

        // Ajouter la ligne de totaux et moyennes
        addTotalsRow(tbody, total2024, total2025, filteredData.length);
    }

    function loadData() {
        let tableData = [];
        
        switch(select.value) {
            case 'fiscales':
                tableData = data.fiscales;
                break;
            case 'douanieres':
                tableData = data.douanieres;
                break;
            case 'non-fiscales':
                tableData = data.nonFiscales;
                break;
            case 'dons':
                tableData = data.dons;
                break;
        }

        updateTable(tableData);
    }

    // Événements
    select.addEventListener('change', loadData);
    natureFilter.addEventListener('input', () => loadData());
    montantMin.addEventListener('input', () => loadData());
    montantMax.addEventListener('input', () => loadData());
    
    clearFilters.addEventListener('click', function() {
        natureFilter.value = '';
        montantMin.value = '';
        montantMax.value = '';
        loadData();
    });

    // Charger les données initiales
    loadData();
}

// Chargement des statistiques du dashboard
async function loadDashboardStats() {
    try {
        const response = await fetch('api/get_stats.php');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalRecettes2024').textContent = data.totalRecettes2024.toLocaleString() + 'M';
            document.getElementById('totalRecettes2025').textContent = data.totalRecettes2025.toLocaleString() + 'M';
            document.getElementById('totalDepenses2024').textContent = data.totalDepenses2024.toLocaleString() + 'M';
            document.getElementById('totalDepenses2025').textContent = data.totalDepenses2025.toLocaleString() + 'M';
            document.getElementById('solde2024').textContent = data.solde2024.toLocaleString() + 'M';
            document.getElementById('solde2025').textContent = data.solde2025.toLocaleString() + 'M';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Ajout de styles pour les valeurs positives/négatives
const style = document.createElement('style');
style.textContent = `
    .positive {
        color: #28a745;
        font-weight: 600;
    }
    .negative {
        color: #dc3545;
        font-weight: 600;
    }
`;
document.head.appendChild(style);



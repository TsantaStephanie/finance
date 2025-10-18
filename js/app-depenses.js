// Variables globales pour les dépenses
let depensesChart, ministeresGanttChart, depensesFonctionnementChart, depensesInvestissementChart;
let currentDepenseType = 'fonctionnement';




// Plugin pour afficher le total au centre du graphique circulaire
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        if (chart.config.type === 'doughnut') {
            const { ctx, chartArea: { width, height } } = chart;
            ctx.save();
            
            // Calculer le total
            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            
            // Position au centre
            const x = width / 2;
            const y = height / 2;
            
            // Texte du total
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Texte principal (Total)
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = '#667eea';
            ctx.fillText(total.toLocaleString() + 'M', x, y + 10);
            
            ctx.restore();
        }
    }
};

// Enregistrer le plugin
Chart.register(centerTextPlugin);

// Modifiez initializeApp pour charger les dépenses
function initializeApp() {
    setupNavigation();
    loadRecettesData();
    loadDepensesData();
    loadDashboardStats();
}

// Chargement des données des dépenses
async function loadDepensesData() {
    try {
        const response = await fetch('api/get_depenses.php');
        const data = await response.json();
        
        if (data.success) {
            createDepensesChart(data.data);
            createMinisteresGanttChart(data.data.ministeres);
            updateDepensesTable(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des dépenses:', error);
    }
}

// FONCTIONS UTILITAIRES CORRIGÉES pour les dépenses
function getDepenseValue2024(item) {
    // Vérifier chaque colonne possible pour 2024
    if (item.annee_2024 !== undefined && item.annee_2024 !== null && item.annee_2024 !== '') {
        return parseFloat(item.annee_2024);
    }
    if (item.lfr_2024 !== undefined && item.lfr_2024 !== null && item.lfr_2024 !== '') {
        return parseFloat(item.lfr_2024);
    }
    if (item.interets_2024 !== undefined && item.interets_2024 !== null && item.interets_2024 !== '') {
        return parseFloat(item.interets_2024);
    }
    return 0;
}

function getDepenseValue2025(item) {
    // Vérifier chaque colonne possible pour 2025
    if (item.annee_2025 !== undefined && item.annee_2025 !== null && item.annee_2025 !== '') {
        return parseFloat(item.annee_2025);
    }
    if (item.lf_2025 !== undefined && item.lf_2025 !== null && item.lf_2025 !== '') {
        return parseFloat(item.lf_2025);
    }
    if (item.interets_2025 !== undefined && item.interets_2025 !== null && item.interets_2025 !== '') {
        return parseFloat(item.interets_2025);
    }
    return 0;
}

function getDepenseLabel(item) {
    return item.nature_depense || item.categorie || item.type_dette || item.libelle || item.ministere || 'Non spécifié';
}

// Création du graphique circulaire des dépenses
// Création du graphique circulaire des dépenses avec texte central
function createDepensesChart(data) {
    const ctx = document.getElementById('depensesChart').getContext('2d');
    
    // Calculer les totaux par catégorie
    const categories = {
        'Fonctionnement': data.fonctionnement.reduce((sum, item) => sum + getDepenseValue2025(item), 0),
        'Investissement': data.investissement.reduce((sum, item) => sum + getDepenseValue2025(item), 0),
        'Intérêts Dette': data.interets.reduce((sum, item) => sum + getDepenseValue2025(item), 0),
        'Soldes/Pensions': data.pensions.reduce((sum, item) => sum + getDepenseValue2025(item), 0)
    };

    const labels = Object.keys(categories);
    const values = Object.values(categories);
    const colors = CHART_COLORS.slice(0, labels.length);
    
    // Calculer le total général
    const totalGeneral = values.reduce((sum, value) => sum + value, 0);

    // Détruire le graphique existant
    if (depensesChart) {
        depensesChart.destroy();
    }

    depensesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#fff',
                cutout: '65%' // Plus grand trou au centre pour le texte
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
                            const percentage = ((value / totalGeneral) * 100).toFixed(1);
                            return `${context.label}: ${value.toLocaleString()}M (${percentage}%)`;
                        }
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const category = labels[index];
                    showDepenseDetails(category, data);
                }
            }
        }
    });

    createCustomLegend(labels, colors, 'depensesLegend');
}


// Création du diagramme de Gantt pour les ministères
function createMinisteresGanttChart(ministeresData) {
    const ctx = document.getElementById('ministeresGanttChart').getContext('2d');
    
    // Détruire le graphique existant
    if (ministeresGanttChart) {
        ministeresGanttChart.destroy();
    }
    
    // Trier les ministères par budget 2025 (décroissant)
    const sortedData = [...ministeresData].sort((a, b) => getDepenseValue2025(b) - getDepenseValue2025(a));
    
    const labels = sortedData.map(item => item.ministere);
    const data2025 = sortedData.map(item => getDepenseValue2025(item));
    
    ministeresGanttChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Budget 2025 (Milliards)',
                data: data2025,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x.toLocaleString()} Milliards`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Montant (Milliards)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + 'M';
                        }
                    }
                },
                y: {
                    ticks: {
                        autoSkip: false, // IMPORTANT: Afficher tous les labels
                        maxTicksLimit: sortedData.length, // Afficher tous les ticks
                        mirror: false,
                        padding: 10,
                        font: {
                            size: 11 // Taille ajustable
                        },
                        // Forcer l'affichage de tous les labels
                        callback: function(value, index, values) {
                            // Retourner le label correspondant à l'index
                            return this.getLabelForValue(index);
                        }
                    },
                    // Ajuster la taille de l'axe Y
                    afterFit: function(axis) {
                        axis.width = 300; // Largeur augmentée pour les longs labels
                    }
                }
            },
            // Ajustements de layout
            layout: {
                padding: {
                    left: 50, // Espace supplémentaire à gauche
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    });
}
// Affichage des détails des dépenses
function showDepenseDetails(category, data) {
    let chartData, title, depenseType;
    
    switch(category) {
        case 'Fonctionnement':
            chartData = data.fonctionnement;
            title = 'Dépenses de Fonctionnement';
            depenseType = 'fonctionnement';
            break;
        case 'Investissement':
            chartData = data.investissement;
            title = 'Dépenses d\'Investissement';
            depenseType = 'investissement';
            break;
        case 'Intérêts Dette':
            chartData = data.interets;
            title = 'Intérêts de la Dette';
            depenseType = 'interets';
            break;
        case 'Soldes/Pensions':
            chartData = data.pensions;
            title = 'Soldes et Pensions';
            depenseType = 'pensions';
            break;
    }

    createDepenseDetailCharts(chartData, title);
    updateDepenseDetailTableFromClick(chartData, title, depenseType);
}

function createDepenseDetailCharts(data, title) {
    // Graphique de ligne pour l'évolution
    const ctx1 = document.getElementById('depensesFonctionnementChart').getContext('2d');
    if (depensesFonctionnementChart) depensesFonctionnementChart.destroy();
    
    const labels = data.map(item => getDepenseLabel(item));
    const values2024 = data.map(item => getDepenseValue2024(item));
    const values2025 = data.map(item => getDepenseValue2025(item));

    depensesFonctionnementChart = new Chart(ctx1, {
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

    // Graphique en barres pour la comparaison
    const ctx2 = document.getElementById('depensesInvestissementChart').getContext('2d');
    if (depensesInvestissementChart) depensesInvestissementChart.destroy();
    
    depensesInvestissementChart = new Chart(ctx2, {
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

// Mise à jour du tableau des dépenses - VERSION CORRIGÉE
function updateDepensesTable(data) {
    const select = document.getElementById('depenseType');
    const tbody = document.getElementById('depensesTableBody');
    const natureFilter = document.getElementById('depenseNatureFilter');
    const montantMin = document.getElementById('depenseMontantMin');
    const montantMax = document.getElementById('depenseMontantMax');
    const clearFilters = document.getElementById('clearDepensesFilters');

    let currentData = [];

    function filterData(tableData) {
        let filteredData = [...tableData];
        
        // Filtre par nature
        const natureSearch = natureFilter.value.toLowerCase();
        if (natureSearch) {
            filteredData = filteredData.filter(item => {
                const nature = getDepenseLabel(item).toLowerCase();
                return nature.includes(natureSearch);
            });
        }
        
        // Filtre par montant minimum
        const minValue = parseFloat(montantMin.value);
        if (!isNaN(minValue)) {
            filteredData = filteredData.filter(item => {
                const value2025 = getDepenseValue2025(item);
                return value2025 >= minValue;
            });
        }
        
        // Filtre par montant maximum
        const maxValue = parseFloat(montantMax.value);
        if (!isNaN(maxValue)) {
            filteredData = filteredData.filter(item => {
                const value2025 = getDepenseValue2025(item);
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
            const value2024 = getDepenseValue2024(item);
            const value2025 = getDepenseValue2025(item);
            const ecart = value2025 - value2024;
            
            // CALCUL CORRIGÉ DU POURCENTAGE
            let evolution = 0;
            if (value2024 !== 0) {
                evolution = (ecart / value2024) * 100;
            } else if (value2025 > 0) {
                evolution = 100; // Nouveau poste de dépense
            }

            total2024 += value2024;
            total2025 += value2025;

            row.innerHTML = `
                <td>${getDepenseLabel(item)}</td>
                <td>${value2024.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
                <td>${value2025.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
                <td class="${ecart >= 0 ? 'positive' : 'negative'}">${ecart >= 0 ? '+' : ''}${ecart.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
                <td class="${evolution >= 0 ? 'positive' : 'negative'}">${evolution >= 0 ? '+' : ''}${evolution.toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });

        // Ajouter les totaux
        addDepensesTotalsRow(tbody, total2024, total2025, filteredData.length);
    }

    function loadData() {
        let tableData = [];
        
        switch(select.value) {
            case 'fonctionnement':
                tableData = data.fonctionnement;
                break;
            case 'investissement':
                tableData = data.investissement;
                break;
            case 'interets':
                tableData = data.interets;
                break;
            case 'pensions':
                tableData = data.pensions;
                break;
            case 'ministeres':
                tableData = data.ministeres;
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

// Fonction pour ajouter les totaux dans le tableau des dépenses
function addDepensesTotalsRow(tbody, total2024, total2025, count) {
    const totalEcart = total2025 - total2024;
    let totalEvolution = 0;
    if (total2024 !== 0) {
        totalEvolution = (totalEcart / total2024) * 100;
    } else if (total2025 > 0) {
        totalEvolution = 100;
    }

    const totalsRow = document.createElement('tr');
    totalsRow.className = 'totals-row';
    totalsRow.innerHTML = `
        <td><strong>TOTAL</strong></td>
        <td><strong>${total2024.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></td>
        <td><strong>${total2025.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></td>
        <td class="${totalEcart >= 0 ? 'positive' : 'negative'}"><strong>${totalEcart >= 0 ? '+' : ''}${totalEcart.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></td>
        <td class="${totalEvolution >= 0 ? 'positive' : 'negative'}"><strong>${totalEvolution >= 0 ? '+' : ''}${totalEvolution.toFixed(1)}%</strong></td>
    `;
    tbody.appendChild(totalsRow);

    // Ligne de moyennes
    const moyenne2024 = count > 0 ? (total2024 / count) : 0;
    const moyenne2025 = count > 0 ? (total2025 / count) : 0;
    const moyenneEcart = moyenne2025 - moyenne2024;

    const averagesRow = document.createElement('tr');
    averagesRow.className = 'averages-row';
    averagesRow.innerHTML = `
        <td><em>MOYENNE</em></td>
        <td><em>${moyenne2024.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</em></td>
        <td><em>${moyenne2025.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</em></td>
        <td><em>${moyenneEcart.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</em></td>
        <td><em>${totalEvolution.toFixed(1)}%</em></td>
    `;
    tbody.appendChild(averagesRow);
}

// Mise à jour du tableau depuis un clic sur le graphique circulaire
function updateDepenseDetailTableFromClick(data, title, depenseType) {
    const select = document.getElementById('depenseType');
    select.value = depenseType;
    
    const tbody = document.getElementById('depensesTableBody');
    tbody.innerHTML = '';

    let total2024 = 0;
    let total2025 = 0;

    data.forEach(item => {
        const row = document.createElement('tr');
        const value2024 = getDepenseValue2024(item);
        const value2025 = getDepenseValue2025(item);
        const ecart = value2025 - value2024;
        
        let evolution = 0;
        if (value2024 !== 0) {
            evolution = (ecart / value2024) * 100;
        } else if (value2025 > 0) {
            evolution = 100;
        }

        total2024 += value2024;
        total2025 += value2025;

        row.innerHTML = `
            <td>${getDepenseLabel(item)}</td>
            <td>${value2024.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
            <td>${value2025.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
            <td class="${ecart >= 0 ? 'positive' : 'negative'}">${ecart >= 0 ? '+' : ''}${ecart.toLocaleString('fr-FR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
            <td class="${evolution >= 0 ? 'positive' : 'negative'}">${evolution >= 0 ? '+' : ''}${evolution.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });

    addDepensesTotalsRow(tbody, total2024, total2025, data.length);
}
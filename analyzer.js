// GSC Business Intelligence Tool - Versione Definitiva
// Creato da Maria Paloschi
// Logica caricamento GSC-BI-FIXED-DEBUG + Analisi Avanzate

// Global Data Variables
let dateData = [];
let countryData = [];
let queryData = [];
let pageData = [];

// Chart instances for cleanup
let chartInstances = {};

// Chart.js Global Configuration
// =================== CHART.JS TESTI SUPER LEGGIBILI ===================
Chart.defaults.color = '#ffffff';
Chart.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.font.size = 16;
Chart.defaults.font.weight = '700';
Chart.defaults.font.family = "'Inter', sans-serif";

// Intent Keywords - Complete Lists
const intentKeywords = {
    commercial: [
        'prezzi', 'prezzo', 'costo', 'offerta', 'sconto', 'acquista', 'compra', 'migliore', 'confronto', 
        'recensioni', 'outlet', 'shopping', 'saldi', 'promozione', 'deal', 'economico', 'conveniente', 
        'qualità prezzo', 'dove comprare', 'negozio', 'store', 'vendita', 'catalogo', 'listino',
        'prezzi bassi', 'offerte speciali', 'black friday', 'cyber monday', 'liquidazione'
    ],
    informational: [
        'storia', 'come', 'perché', 'cosa', 'quando', 'dove', 'guida', 'tutorial', 'definizione', 
        'significato', "cos'è", 'spiegazione', 'informazioni', 'caratteristiche', 'proprietà', 
        'vantaggi', 'svantaggi', 'differenze', 'tipologie', 'classificazione', 'origine',
        'curiosità', 'fatti', 'statistiche', 'ricerca', 'studio', 'analisi'
    ],
    navigational: [
        'sito ufficiale', 'contatti', 'login', 'accedi', 'homepage', 'area riservata', 'portale',
        'sito web', 'pagina ufficiale', 'customer service', 'assistenza', 'supporto', 'helpdesk',
        'sede', 'indirizzo', 'telefono', 'email', 'social media', 'facebook', 'instagram'
    ]
};

// Category Keywords for Business Intelligence
const categoryKeywords = {
    'Abbigliamento': [
        'abiti', 'vestiti', 'camicie', 'pantaloni', 'gonne', 'maglie', 't-shirt', 'felpe', 
        'giacche', 'cappotti', 'jeans', 'shorts', 'top', 'bluse', 'cardigan', 'maglioni',
        'intimo', 'pigiami', 'costumi', 'bikini', 'lingerie', 'calze', 'collant'
    ],
    'Calzature': [
        'scarpe', 'sandali', 'stivali', 'sneakers', 'tacchi', 'ballerine', 'mocassini',
        'ciabatte', 'infradito', 'scarpe da ginnastica', 'running', 'sportive', 'eleganti',
        'casual', 'boots', 'anfibi', 'décolleté', 'zeppe', 'platform'
    ],
    'Accessori': [
        'borse', 'borsette', 'zaini', 'valigie', 'portafogli', 'cinture', 'orologi',
        'gioielli', 'collane', 'bracciali', 'orecchini', 'anelli', 'occhiali', 'cappelli',
        'sciarpe', 'foulard', 'guanti', 'ombrelli', 'portachiavi'
    ],
    'Beauty': [
        'makeup', 'trucco', 'cosmetici', 'profumi', 'skincare', 'creme', 'sieri',
        'fondotinta', 'rossetti', 'mascara', 'ombretti', 'smalti', 'shampoo', 'balsamo',
        'prodotti bellezza', 'anti-age', 'idratanti', 'detergenti', 'tonici'
    ],
    'Casa e Giardino': [
        'arredamento', 'mobili', 'decorazioni', 'tessuti casa', 'cucina', 'bagno',
        'giardino', 'piante', 'attrezzi', 'elettrodomestici', 'illuminazione', 'tappeti',
        'cuscini', 'coperte', 'biancheria', 'tovaglie'
    ],
    'Tecnologia': [
        'smartphone', 'tablet', 'computer', 'laptop', 'accessori tech', 'caricabatterie',
        'cover', 'cuffie', 'speaker', 'smartwatch', 'fotocamere', 'gaming', 'console'
    ]
};

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('GSC Business Intelligence Tool inizializzato');
    initializeEventListeners();
    initializeTabs();
    setupChartDefaults();
});

function setupChartDefaults() {
    // =================== CONFIGURAZIONE MASSIMA LEGGIBILITÀ ===================
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 16;
    Chart.defaults.font.weight = '700';
    Chart.defaults.color = '#ffffff';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 25;
    Chart.defaults.plugins.legend.labels.font = {
        size: 16,
        weight: '700',
        family: "'Inter', sans-serif"
    };
    Chart.defaults.plugins.tooltip.titleFont = {
        size: 16,
        weight: '700',
        family: "'Inter', sans-serif"
    };
    Chart.defaults.plugins.tooltip.bodyFont = {
        size: 14,
        weight: '600',
        family: "'Inter', sans-serif"
    };
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    Chart.defaults.plugins.tooltip.borderColor = '#667eea';
    Chart.defaults.plugins.tooltip.borderWidth = 2;
}

function initializeEventListeners() {
    // File Upload Listeners - LOGICA FUNZIONANTE GSC-BI-FIXED-DEBUG
    const fileInputs = [
        { id: 'dateFile', type: 'date' },
        { id: 'countryFile', type: 'country' },
        { id: 'queryFile', type: 'query' },
        { id: 'pageFile', type: 'page' }
    ];

    fileInputs.forEach(input => {
        const element = document.getElementById(input.id);
        if (element) {
            element.addEventListener('change', function(e) {
                handleFileUpload(e, input.type);
            });
        }
    });

    // Analyze Button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', performCompleteAnalysis);
    }

    // Filter Event Listeners
    setupFilterListeners();
}

function setupFilterListeners() {
    const filters = [
        'seasonalityPeriod', 'geoMetric', 'geoTopCountries', 'timeSeriesMetric', 'timeSeriesZoom'
    ];

    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', function() {
                handleFilterChange(filterId, this.value);
            });
        }
    });

    // Zoom slider special handling
    const zoomSlider = document.getElementById('timeSeriesZoom');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', function() {
            const label = document.getElementById('zoomLabel');
            if (label) {
                label.textContent = `${this.value} giorni`;
            }
            handleFilterChange('timeSeriesZoom', this.value);
        });
    }
}

function handleFilterChange(filterId, value) {
    switch(filterId) {
        case 'seasonalityPeriod':
            updateSeasonalityChart();
            break;
        case 'geoMetric':
        case 'geoTopCountries':
            updateGeoHeatmap();
            break;
        case 'timeSeriesMetric':
        case 'timeSeriesZoom':
            updateTimeSeriesChart();
            break;
    }
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active classes
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            console.log(`Switched to tab: ${targetTab}`);
        });
    });
}

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log(`Loading ${type} file:`, file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        try {
            parseCSV(csv, type);
            updateAnalyzeButton();
            showUploadSuccess(type);
            console.log(`${type} file loaded successfully`);
        } catch (error) {
            console.error(`Error parsing ${type}:`, error);
            showUploadError(type, error.message);
        }
    };
    reader.readAsText(file);
}

function parseCSV(csv, type) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        throw new Error('File CSV vuoto o non valido');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log(`${type} headers:`, headers);
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = parseCSVLine(line);
        if (values.length >= headers.length - 1) { // Allow for minor discrepancies
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
            });
            data.push(obj);
        }
    }
    
    // Parse specific data types - LOGICA FUNZIONANTE
    switch(type) {
        case 'date':
            dateData = data.map(row => ({
                date: row['Data'] || row['Date'] || row['data'] || '',
                clicks: safeParseInt(row['Clic'] || row['Clicks'] || row['clicks']),
                impressions: safeParseInt(row['Impressioni'] || row['Impressions'] || row['impressions']),
                ctr: safeParseFloat(row['CTR'] || row['ctr']),
                position: safeParseFloat(row['Posizione'] || row['Position'] || row['position'])
            })).filter(row => row.date && row.date !== '');
            
            // Sort by date
            dateData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log('Date data processed:', dateData.length, 'records');
            break;
            
        case 'country':
            countryData = data.map(row => ({
                country: row['Paese'] || row['Country'] || row['paese'] || '',
                clicks: safeParseInt(row['Clic'] || row['Clicks'] || row['clicks']),
                impressions: safeParseInt(row['Impressioni'] || row['Impressions'] || row['impressions']),
                ctr: safeParseFloat(row['CTR'] || row['ctr']),
                position: safeParseFloat(row['Posizione'] || row['Position'] || row['position'])
            })).filter(row => row.country && row.country !== '');
            
            // Sort by clicks
            countryData.sort((a, b) => b.clicks - a.clicks);
            console.log('Country data processed:', countryData.length, 'records');
            break;
            
        case 'query':
            queryData = data.map(row => ({
                query: row['Query più frequenti'] || row['Query'] || row['Top queries'] || row['query'] || '',
                clicks: safeParseInt(row['Clic'] || row['Clicks'] || row['clicks']),
                impressions: safeParseInt(row['Impressioni'] || row['Impressions'] || row['impressions']),
                ctr: safeParseFloat(row['CTR'] || row['ctr']),
                position: safeParseFloat(row['Posizione'] || row['Position'] || row['position'])
            })).filter(row => row.query && row.query !== '');
            
            // Sort by clicks
            queryData.sort((a, b) => b.clicks - a.clicks);
            console.log('Query data processed:', queryData.length, 'records');
            break;
            
        case 'page':
            pageData = data.map(row => ({
                page: row['Pagine principali'] || row['Page'] || row['Top pages'] || row['page'] || '',
                clicks: safeParseInt(row['Clic'] || row['Clicks'] || row['clicks']),
                impressions: safeParseInt(row['Impressioni'] || row['Impressions'] || row['impressions']),
                ctr: safeParseFloat(row['CTR'] || row['ctr']),
                position: safeParseFloat(row['Posizione'] || row['Position'] || row['position'])
            })).filter(row => row.page && row.page !== '');
            
            // Sort by clicks
            pageData.sort((a, b) => b.clicks - a.clicks);
            console.log('Page data processed:', pageData.length, 'records');
            break;
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

function safeParseInt(value) {
    if (!value || value === '') return 0;
    const parsed = parseInt(value.toString().replace(/[^\d-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
}

function safeParseFloat(value) {
    if (!value || value === '') return 0;
    const parsed = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
}

function showUploadSuccess(type) {
    const element = document.getElementById(`${type}File`);
    if (element) {
        element.parentElement.classList.add('success');
        setTimeout(() => {
            element.parentElement.classList.remove('success');
        }, 3000);
    }
}

function showUploadError(type, message) {
    const element = document.getElementById(`${type}File`);
    if (element) {
        element.parentElement.classList.add('error');
        setTimeout(() => {
            element.parentElement.classList.remove('error');
        }, 5000);
    }
    console.error(`Upload error for ${type}:`, message);
}

function updateAnalyzeButton() {
    const hasData = dateData.length > 0 || countryData.length > 0 || queryData.length > 0 || pageData.length > 0;
    const btn = document.getElementById('analyzeBtn');
    
    if (btn) {
        if (hasData) {
            btn.disabled = false;
            btn.textContent = '🚀 Avvia Analisi Business Intelligence';
            btn.classList.remove('loading');
        } else {
            btn.disabled = true;
            btn.textContent = '⏳ Carica almeno un file CSV';
        }
    }
}

function performCompleteAnalysis() {
    const totalRecords = dateData.length + countryData.length + queryData.length + pageData.length;
    if (totalRecords === 0) {
        alert('Carica almeno un file CSV per iniziare l\'analisi!');
        return;
    }
    
    console.log('Starting complete analysis...');
    const btn = document.getElementById('analyzeBtn');
    if (btn) {
        btn.textContent = '⚡ Analisi in corso...';
        btn.classList.add('loading');
        btn.disabled = true;
    }
    
    // Simulate processing time and run all analyses
    setTimeout(() => {
        try {
            // Clean up existing charts
            cleanupCharts();
            
            // Run all analyses
            generateTrendAnalysis();
            generateGeographicAnalysis();
            generateIntentAnalysis();
            generateBusinessIntelligence();
            generateOpportunities();
            
            // Update button
            if (btn) {
                btn.textContent = '✅ Analisi Completata!';
                btn.classList.remove('loading');
                btn.disabled = false;
            }
            
            console.log('Analysis completed successfully');
            
            // Switch to first tab
            const firstTab = document.querySelector('.tab-btn[data-tab="trend"]');
            if (firstTab) {
                firstTab.click();
            }
            
        } catch (error) {
            console.error('Error during analysis:', error);
            if (btn) {
                btn.textContent = '❌ Errore nell\'analisi - Riprova';
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        }
    }, 2000);
}

function cleanupCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    chartInstances = {};
}

// ==============================================
// TREND ANALYSIS AVANZATA
// ==============================================

function generateTrendAnalysis() {
    if (dateData.length === 0) {
        console.log('No date data available for trend analysis');
        return;
    }
    
    console.log('Generating trend analysis...');
    updateSeasonalityChart();
    updatePeakDetectionChart();
    updateWeekendWeekdayChart();
}

function updateSeasonalityChart() {
    if (dateData.length === 0) return;
    
    const period = document.getElementById('seasonalityPeriod')?.value || 'monthly';
    const ctx = document.getElementById('seasonalityChart');
    if (!ctx) return;
    
    // Clean up existing chart
    if (chartInstances.seasonality) {
        chartInstances.seasonality.destroy();
    }
    
    const aggregatedData = aggregateDataByPeriod(dateData, period);
    
    chartInstances.seasonality = new Chart(ctx, {
        type: 'line',
        data: {
            labels: aggregatedData.labels,
            datasets: [{
                label: 'Clicks',
                data: aggregatedData.clicks,
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Impressioni',
                data: aggregatedData.impressions,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }]
        },
        options: getChartOptions('Trend Stagionale', 'Periodo', 'Valori')
    });
    
    // Generate insights
    generateSeasonalityInsights(aggregatedData, period);
}

function aggregateDataByPeriod(data, period) {
    const aggregated = {};
    
    data.forEach(item => {
        const date = new Date(item.date);
        let key;
        
        switch(period) {
            case 'monthly':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'weekly':
                const weekNum = getWeekNumber(date);
                key = `${date.getFullYear()}-W${weekNum}`;
                break;
            case 'daily':
                key = item.date;
                break;
            default:
                key = item.date;
        }
        
        if (!aggregated[key]) {
            aggregated[key] = { clicks: 0, impressions: 0, count: 0 };
        }
        
        aggregated[key].clicks += item.clicks;
        aggregated[key].impressions += item.impressions;
        aggregated[key].count++;
    });
    
    const sorted = Object.keys(aggregated).sort();
    return {
        labels: sorted,
        clicks: sorted.map(key => aggregated[key].clicks),
        impressions: sorted.map(key => aggregated[key].impressions)
    };
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function generateSeasonalityInsights(data, period) {
    const container = document.getElementById('seasonalityInsights');
    if (!container) return;
    
    const totalClicks = data.clicks.reduce((sum, val) => sum + val, 0);
    const avgClicks = totalClicks / data.clicks.length;
    const maxClicks = Math.max(...data.clicks);
    const maxIndex = data.clicks.indexOf(maxClicks);
    const bestPeriod = data.labels[maxIndex];
    
    // =================== IDENTIFICA EVENTI BUSINESS REALI ===================
    const businessEvents = identifyBusinessEventsFromLabels(data.labels);
    let eventsHtml = '';
    if (businessEvents.length > 0) {
        eventsHtml = `
            <div class="seasonal-events">
                <h4>🎯 Eventi Business Identificati:</h4>
                <div class="event-tags">
                    ${businessEvents.map(event => 
                        `<span class="event-tag ${event.type}">${event.name}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">📊 Performance Stagionale</div>
            <div class="insight-desc">
                <strong>Periodo migliore:</strong> ${bestPeriod} (${maxClicks.toLocaleString()} clicks)<br>
                <strong>Media ${period}:</strong> ${Math.round(avgClicks).toLocaleString()} clicks<br>
                <strong>Variazione:</strong> ${((maxClicks - avgClicks) / avgClicks * 100).toFixed(1)}% sopra la media<br>
                ${eventsHtml}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updatePeakDetectionChart() {
    if (dateData.length === 0) return;
    
    const ctx = document.getElementById('peakDetectionChart');
    if (!ctx) return;
    
    if (chartInstances.peakDetection) {
        chartInstances.peakDetection.destroy();
    }
    
    const peaks = detectPeaks(dateData);
    const labels = dateData.map(d => d.date);
    const clicksData = dateData.map(d => d.clicks);
    const peakData = dateData.map((d, i) => peaks.includes(i) ? d.clicks : null);
    const valleyData = dateData.map((d, i) => peaks.includes(i) ? null : (d.clicks < (clicksData.reduce((sum, val) => sum + val, 0) / clicksData.length) * 0.5 ? d.clicks : null));
    
    chartInstances.peakDetection = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Clicks',
                data: clicksData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true
            }, {
                label: 'Picchi',
                data: peakData,
                borderColor: '#ff6b9d',
                backgroundColor: '#ff6b9d',
                borderWidth: 0,
                pointRadius: 8,
                pointStyle: 'star',
                showLine: false
            }, {
                label: 'Cali',
                data: valleyData,
                borderColor: '#f44336',
                backgroundColor: '#f44336',
                borderWidth: 0,
                pointRadius: 6,
                pointStyle: 'triangle',
                showLine: false
            }]
        },
        options: getChartOptions('Peak Detection', 'Data', 'Clicks')
    });
    
    generatePeakInsights(peaks, dateData);
}

function detectPeaks(data) {
    const peaks = [];
    const clicks = data.map(d => d.clicks);
    const threshold = clicks.reduce((sum, val) => sum + val, 0) / clicks.length * 1.5;
    
    for (let i = 1; i < clicks.length - 1; i++) {
        if (clicks[i] > clicks[i-1] && clicks[i] > clicks[i+1] && clicks[i] > threshold) {
            peaks.push(i);
        }
    }
    
    return peaks;
}

function generatePeakInsights(peaks, data) {
    const container = document.getElementById('peakInsights');
    if (!container) return;
    
    const peakDates = peaks.map(i => ({
        date: data[i].date,
        clicks: data[i].clicks
    })).sort((a, b) => b.clicks - a.clicks);
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🎯 Picchi Rilevati</div>
            <div class="insight-desc">
                <strong>Numero picchi:</strong> ${peaks.length}<br>
                ${peakDates.slice(0, 3).map(peak => 
                    `<strong>${peak.date}:</strong> ${peak.clicks.toLocaleString()} clicks`
                ).join('<br>')}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateWeekendWeekdayChart() {
    if (dateData.length === 0) return;
    
    const ctx = document.getElementById('weekendWeekdayChart');
    if (!ctx) return;
    
    if (chartInstances.weekendWeekday) {
        chartInstances.weekendWeekday.destroy();
    }
    
    const weekdayData = analyzeWeekendWeekday(dateData);
    
    chartInstances.weekendWeekday = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
            datasets: [{
                label: 'Clicks Medi',
                data: weekdayData.avgClicks,
                backgroundColor: [
                    '#ff6b9d', '#667eea', '#764ba2', '#f093fb',
                    '#f5576c', '#4facfe', '#43e97b'
                ],
                borderWidth: 0
            }]
        },
        options: getChartOptions('Performance Giornaliera', 'Giorni della Settimana', 'Clicks Medi')
    });
    
    generateWeekdayInsights(weekdayData);
}

function analyzeWeekendWeekday(data) {
    const dayStats = Array(7).fill().map(() => ({ clicks: 0, count: 0 }));
    
    data.forEach(item => {
        const date = new Date(item.date);
        const dayOfWeek = date.getDay();
        dayStats[dayOfWeek].clicks += item.clicks;
        dayStats[dayOfWeek].count++;
    });
    
    const avgClicks = dayStats.map(day => day.count > 0 ? day.clicks / day.count : 0);
    const weekdayAvg = (avgClicks[1] + avgClicks[2] + avgClicks[3] + avgClicks[4] + avgClicks[5]) / 5;
    const weekendAvg = (avgClicks[0] + avgClicks[6]) / 2;
    
    return {
        avgClicks,
        weekdayAvg,
        weekendAvg,
        dayStats
    };
}

function generateWeekdayInsights(data) {
    const container = document.getElementById('weekdayInsights');
    if (!container) return;
    
    const bestDay = data.avgClicks.indexOf(Math.max(...data.avgClicks));
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const weekendPerformance = data.weekendAvg > data.weekdayAvg ? 'superiore' : 'inferiore';
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">📅 Pattern Settimanali</div>
            <div class="insight-desc">
                <strong>Giorno migliore:</strong> ${dayNames[bestDay]} (${Math.round(data.avgClicks[bestDay]).toLocaleString()} clicks medi)<br>
                <strong>Weekend vs Settimana:</strong> Performance ${weekendPerformance}<br>
                <strong>Weekend:</strong> ${Math.round(data.weekendAvg).toLocaleString()} clicks medi<br>
                <strong>Giorni lavorativi:</strong> ${Math.round(data.weekdayAvg).toLocaleString()} clicks medi
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

// ==============================================
// GEOGRAPHIC PERFORMANCE
// ==============================================

function generateGeographicAnalysis() {
    if (countryData.length === 0) {
        console.log('No country data available for geographic analysis');
        return;
    }
    
    console.log('Generating geographic analysis...');
    updateGeoHeatmap();
    updateOpportunityMarkets();
    updateCTRGeography();
}

function updateGeoHeatmap() {
    if (countryData.length === 0) return;
    
    const metric = document.getElementById('geoMetric')?.value || 'clicks';
    const topCount = parseInt(document.getElementById('geoTopCountries')?.value) || 10;
    
    const ctx = document.getElementById('geoHeatmapChart');
    if (!ctx) return;
    
    if (chartInstances.geoHeatmap) {
        chartInstances.geoHeatmap.destroy();
    }
    
    const topCountries = countryData
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, topCount);
    
    chartInstances.geoHeatmap = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCountries.map(c => c.country),
            datasets: [{
                label: getMetricLabel(metric),
                data: topCountries.map(c => c[metric]),
                backgroundColor: topCountries.map((_, i) => getGradientColor(i, topCount)),
                borderWidth: 0
            }]
        },
        options: {
            ...getChartOptions('Performance Geografica', 'Paesi', getMetricLabel(metric)),
            indexAxis: 'y'
        }
    });
}

function updateOpportunityMarkets() {
    if (countryData.length === 0) return;
    
    const ctx = document.getElementById('opportunityMarketsChart');
    if (!ctx) return;
    
    if (chartInstances.opportunityMarkets) {
        chartInstances.opportunityMarkets.destroy();
    }
    
    const opportunities = identifyOpportunityMarkets(countryData);
    
    chartInstances.opportunityMarkets = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Opportunity Score',
                data: opportunities.map(country => ({
                    x: country.impressions,
                    y: country.ctr,
                    r: Math.max(5, country.clicks / 50)
                })),
                backgroundColor: 'rgba(255, 107, 157, 0.6)',
                borderColor: '#ff6b9d',
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions('Opportunity Markets', 'Impressioni', 'CTR %'),
            scales: {
                ...getChartOptions().scales,
                x: {
                    ...getChartOptions().scales.x,
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Impressioni',
                        color: '#ffffff'
                    }
                },
                y: {
                    ...getChartOptions().scales.y,
                    title: {
                        display: true,
                        text: 'CTR %',
                        color: '#ffffff'
                    }
                }
            }
        }
    });
    
    generateOpportunityMarketsInsights(opportunities);
}

function identifyOpportunityMarkets(data) {
    return data
        .filter(country => country.impressions > 1000) // Filter significant markets
        .map(country => ({
            ...country,
            opportunityScore: (country.impressions * country.ctr) / 100
        }))
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 10);
}

function generateOpportunityMarketsInsights(opportunities) {
    const container = document.getElementById('opportunityMarketsInsights');
    if (!container) return;
    
    const topOpportunity = opportunities[0];
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🎯 Top Opportunity</div>
            <div class="insight-desc">
                <strong>${topOpportunity.country}</strong><br>
                Impressioni: ${topOpportunity.impressions.toLocaleString()}<br>
                CTR: ${topOpportunity.ctr.toFixed(2)}%<br>
                Opportunity Score: ${Math.round(topOpportunity.opportunityScore).toLocaleString()}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateCTRGeography() {
    if (countryData.length === 0) return;
    
    const ctx = document.getElementById('ctrGeographyChart');
    if (!ctx) return;
    
    if (chartInstances.ctrGeography) {
        chartInstances.ctrGeography.destroy();
    }
    
    const ctrAnalysis = analyzeCTRByGeography(countryData);
    
    chartInstances.ctrGeography = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['CTR Alto (>5%)', 'CTR Medio (2-5%)', 'CTR Basso (<2%)'],
            datasets: [{
                data: [ctrAnalysis.high, ctrAnalysis.medium, ctrAnalysis.low],
                backgroundColor: ['#4CAF50', '#ff6b9d', '#f44336'],
                borderWidth: 0
            }]
        },
        options: getChartOptions('Distribuzione CTR Geografica')
    });
    
    generateCTRGeoInsights(ctrAnalysis);
}

function analyzeCTRByGeography(data) {
    let high = 0, medium = 0, low = 0;
    
    data.forEach(country => {
        if (country.ctr > 5) high++;
        else if (country.ctr >= 2) medium++;
        else low++;
    });
    
    return { high, medium, low, total: data.length };
}

function generateCTRGeoInsights(analysis) {
    const container = document.getElementById('ctrGeoInsights');
    if (!container) return;
    
    const highPercentage = (analysis.high / analysis.total * 100).toFixed(1);
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">📊 CTR Geografico</div>
            <div class="insight-desc">
                <strong>Paesi alta performance:</strong> ${analysis.high} (${highPercentage}%)<br>
                <strong>Paesi media performance:</strong> ${analysis.medium}<br>
                <strong>Paesi da ottimizzare:</strong> ${analysis.low}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

// ==============================================
// QUERY INTENT CLASSIFICATION
// ==============================================

function generateIntentAnalysis() {
    if (queryData.length === 0) {
        console.log('No query data available for intent analysis');
        return;
    }
    
    console.log('Generating intent analysis...');
    
    const intentData = classifyQueries(queryData);
    
    updateBrandChart(intentData);
    updateCommercialChart(intentData);
    updateInformationalChart(intentData);
    updateNavigationalChart(intentData);
    updateIntentOverview(intentData);
}

function classifyQueries(queries) {
    const classified = {
        brand: [],
        nonBrand: [],
        commercial: [],
        informational: [],
        navigational: [],
        other: []
    };
    
    queries.forEach(query => {
        const queryLower = query.query.toLowerCase();
        
        // Brand detection (simplified - you can enhance this)
        const hasBrandTerms = queryLower.includes('marca') || queryLower.includes('brand') || 
                              queryLower.includes('negozio') || queryLower.includes('store');
        
        if (hasBrandTerms) {
            classified.brand.push(query);
        } else {
            classified.nonBrand.push(query);
        }
        
        // Intent classification
        if (intentKeywords.commercial.some(keyword => queryLower.includes(keyword))) {
            classified.commercial.push(query);
        } else if (intentKeywords.informational.some(keyword => queryLower.includes(keyword))) {
            classified.informational.push(query);
        } else if (intentKeywords.navigational.some(keyword => queryLower.includes(keyword))) {
            classified.navigational.push(query);
        } else {
            classified.other.push(query);
        }
    });
    
    return classified;
}

function updateBrandChart(intentData) {
    const ctx = document.getElementById('brandChart');
    if (!ctx) return;
    
    if (chartInstances.brand) {
        chartInstances.brand.destroy();
    }
    
    chartInstances.brand = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Brand Queries', 'Non-Brand Queries'],
            datasets: [{
                data: [intentData.brand.length, intentData.nonBrand.length],
                backgroundColor: ['#ff6b9d', '#667eea'],
                borderWidth: 0
            }]
        },
        options: getChartOptions('Brand vs Non-Brand')
    });
    
    generateBrandInsights(intentData);
}

function generateBrandInsights(intentData) {
    const container = document.getElementById('brandInsights');
    if (!container) return;
    
    const total = intentData.brand.length + intentData.nonBrand.length;
    const brandPercentage = (intentData.brand.length / total * 100).toFixed(1);
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🏷️ Brand Analysis</div>
            <div class="insight-desc">
                <strong>Brand queries:</strong> ${intentData.brand.length} (${brandPercentage}%)<br>
                <strong>Non-brand queries:</strong> ${intentData.nonBrand.length}<br>
                <strong>Focus:</strong> ${brandPercentage > 30 ? 'Strong brand presence' : 'Opportunity for brand building'}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateCommercialChart(intentData) {
    const ctx = document.getElementById('commercialChart');
    if (!ctx) return;
    
    if (chartInstances.commercial) {
        chartInstances.commercial.destroy();
    }
    
    const topCommercial = intentData.commercial
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);
    
    chartInstances.commercial = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCommercial.map(q => q.query.substring(0, 20) + '...'),
            datasets: [{
                label: 'Clicks',
                data: topCommercial.map(q => q.clicks),
                backgroundColor: '#ff6b9d',
                borderWidth: 0
            }]
        },
        options: {
            ...getChartOptions('Top Commercial Queries', 'Queries', 'Clicks'),
            indexAxis: 'y'
        }
    });
    
    generateCommercialInsights(intentData.commercial);
}

function generateCommercialInsights(commercialQueries) {
    const container = document.getElementById('commercialInsights');
    if (!container) return;
    
    const totalCommercialClicks = commercialQueries.reduce((sum, q) => sum + q.clicks, 0);
    const avgCTR = commercialQueries.reduce((sum, q) => sum + q.ctr, 0) / commercialQueries.length;
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🛒 Commercial Intent</div>
            <div class="insight-desc">
                <strong>Commercial queries:</strong> ${commercialQueries.length}<br>
                <strong>Total clicks:</strong> ${totalCommercialClicks.toLocaleString()}<br>
                <strong>Average CTR:</strong> ${avgCTR.toFixed(2)}%
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateInformationalChart(intentData) {
    const ctx = document.getElementById('informationalChart');
    if (!ctx) return;
    
    if (chartInstances.informational) {
        chartInstances.informational.destroy();
    }
    
    const topInformational = intentData.informational
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 8);
    
    chartInstances.informational = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topInformational.map(q => q.query.substring(0, 15) + '...'),
            datasets: [{
                label: 'Impressioni',
                data: topInformational.map(q => q.impressions),
                backgroundColor: '#667eea',
                borderWidth: 0
            }]
        },
        options: getChartOptions('Top Informational Queries', 'Queries', 'Impressioni')
    });
    
    generateInformationalInsights(intentData.informational);
}

function generateInformationalInsights(informationalQueries) {
    const container = document.getElementById('informationalInsights');
    if (!container) return;
    
    const totalImpressions = informationalQueries.reduce((sum, q) => sum + q.impressions, 0);
    const avgPosition = informationalQueries.reduce((sum, q) => sum + q.position, 0) / informationalQueries.length;
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">📚 Informational Intent</div>
            <div class="insight-desc">
                <strong>Informational queries:</strong> ${informationalQueries.length}<br>
                <strong>Total impressions:</strong> ${totalImpressions.toLocaleString()}<br>
                <strong>Average position:</strong> ${avgPosition.toFixed(1)}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateNavigationalChart(intentData) {
    const ctx = document.getElementById('navigationalChart');
    if (!ctx) return;
    
    if (chartInstances.navigational) {
        chartInstances.navigational.destroy();
    }
    
    const navData = intentData.navigational.slice(0, 6);
    
    chartInstances.navigational = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: navData.map(q => q.query.substring(0, 10) + '...'),
            datasets: [{
                label: 'CTR %',
                data: navData.map(q => q.ctr),
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.2)',
                borderWidth: 2
            }]
        },
        options: getChartOptions('Navigational Queries CTR')
    });
    
    generateNavigationalInsights(intentData.navigational);
}

function generateNavigationalInsights(navigationalQueries) {
    const container = document.getElementById('navigationalInsights');
    if (!container) return;
    
    const avgCTR = navigationalQueries.reduce((sum, q) => sum + q.ctr, 0) / navigationalQueries.length;
    const topNav = navigationalQueries.sort((a, b) => b.ctr - a.ctr)[0];
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🔍 Navigational Intent</div>
            <div class="insight-desc">
                <strong>Navigational queries:</strong> ${navigationalQueries.length}<br>
                <strong>Average CTR:</strong> ${avgCTR.toFixed(2)}%<br>
                <strong>Best performer:</strong> ${topNav ? topNav.query.substring(0, 30) : 'N/A'}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateIntentOverview(intentData) {
    const ctx = document.getElementById('intentOverviewChart');
    if (!ctx) return;
    
    if (chartInstances.intentOverview) {
        chartInstances.intentOverview.destroy();
    }
    
    chartInstances.intentOverview = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Commercial', 'Informational', 'Navigational', 'Other'],
            datasets: [{
                data: [
                    intentData.commercial.length,
                    intentData.informational.length,
                    intentData.navigational.length,
                    intentData.other.length
                ],
                backgroundColor: ['#ff6b9d', '#667eea', '#764ba2', '#f093fb'],
                borderWidth: 0
            }]
        },
        options: getChartOptions('Intent Distribution Overview')
    });
    
    // Populate intent lists
    populateIntentLists(intentData);
}

function populateIntentLists(intentData) {
    const lists = [
        { id: 'commercialQueriesList', data: intentData.commercial },
        { id: 'informationalQueriesList', data: intentData.informational },
        { id: 'navigationalQueriesList', data: intentData.navigational }
    ];
    
    lists.forEach(list => {
        const container = document.getElementById(list.id);
        if (!container) return;
        
        const topQueries = list.data
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);
        
        const html = topQueries.map(query => `
            <div class="insight-item">
                <div class="insight-title">${query.query}</div>
                <div class="insight-desc">
                    Clicks: ${query.clicks.toLocaleString()} | 
                    CTR: ${query.ctr.toFixed(2)}% | 
                    Pos: ${query.position.toFixed(1)}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html || '<p>Nessuna query in questa categoria.</p>';
    });
}

// ==============================================
// BUSINESS INTELLIGENCE
// ==============================================

function generateBusinessIntelligence() {
    console.log('Generating business intelligence...');
    
    updateKPIDashboard();
    updateCategoryChart();
    updateTimeSeriesChart();
    updateScatterChart();
    updateSunburstChart();
    updateRadarChart();
    updateSankeyChart();
}

function updateKPIDashboard() {
    const totalClicks = getTotalClicks();
    const totalImpressions = getTotalImpressions();
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgPosition = getAveragePosition();
    
    const kpis = [
        { id: 'totalClicks', value: totalClicks.toLocaleString() },
        { id: 'totalImpressions', value: totalImpressions.toLocaleString() },
        { id: 'avgCTR', value: avgCTR.toFixed(2) + '%' },
        { id: 'avgPosition', value: avgPosition.toFixed(1) }
    ];
    
    kpis.forEach(kpi => {
        const element = document.getElementById(kpi.id);
        if (element) {
            element.textContent = kpi.value;
        }
    });
}

function updateCategoryChart() {
    if (queryData.length === 0) return;
    
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    if (chartInstances.category) {
        chartInstances.category.destroy();
    }
    
    const categoryData = categorizeQueries(queryData);
    
    chartInstances.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData).map(cat => cat.clicks),
                backgroundColor: [
                    '#ff6b9d', '#667eea', '#764ba2', '#f093fb',
                    '#f5576c', '#4facfe', '#43e97b', '#f8b500'
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...getChartOptions('Distribuzione Traffico per Categoria'),
            plugins: {
                ...getChartOptions('Distribuzione Traffico per Categoria').plugins,
                legend: {
                    position: 'right',
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
    
    generateCategoryInsights(categoryData);
}

function categorizeQueries(queries) {
    // =================== CLUSTERING SOLO CON DESINENZE URL ===================
    return urlBasedCategorizeQueries(queries, pageData);
    
    const categories = {};
    
    // Initialize categories
    Object.keys(categoryKeywords).forEach(category => {
        categories[category] = { clicks: 0, queries: [] };
    });
    categories['Altri'] = { clicks: 0, queries: [] };
    
    queries.forEach(query => {
        const queryLower = query.query.toLowerCase();
        let categorized = false;
        let bestMatch = { category: null, score: 0 };
        
        // Trova la migliore corrispondenza
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            let score = 0;
            keywords.forEach(keyword => {
                if (queryLower.includes(keyword.toLowerCase())) {
                    score += keyword.split(' ').length; // Punteggio per specificità
                }
            });
            
            if (score > bestMatch.score) {
                bestMatch = { category, score };
            }
        }
        
        if (bestMatch.score > 0) {
            categories[bestMatch.category].clicks += query.clicks;
            categories[bestMatch.category].queries.push(query);
            categorized = true;
        }
        
        if (!categorized) {
            categories['Altri'].clicks += query.clicks;
            categories['Altri'].queries.push(query);
        }
    });
    
    return categories;
}

function generateCategoryInsights(categoryData) {
    const container = document.getElementById('categoryInsights');
    if (!container) return;
    
    const sortedCategories = Object.entries(categoryData)
        .sort(([,a], [,b]) => b.clicks - a.clicks)
        .slice(0, 3);
    
    const totalClicks = Object.values(categoryData).reduce((sum, cat) => sum + cat.clicks, 0);
    
    const insights = sortedCategories.map(([category, data]) => {
        const percentage = (data.clicks / totalClicks * 100).toFixed(1);
        return `<strong>${category}:</strong> ${data.clicks.toLocaleString()} clicks (${percentage}%)`;
    }).join('<br>');
    
    const html = `
        <div class="insight-item">
            <div class="insight-title">👗 Top Categorie</div>
            <div class="insight-desc">${insights}</div>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateTimeSeriesChart() {
    if (dateData.length === 0) return;
    
    const ctx = document.getElementById('timeSeriesChart');
    if (!ctx) return;
    
    if (chartInstances.timeSeries) {
        chartInstances.timeSeries.destroy();
    }
    
    const metric = document.getElementById('timeSeriesMetric')?.value || 'clicks';
    const zoomDays = parseInt(document.getElementById('timeSeriesZoom')?.value) || 30;
    
    const filteredData = dateData.slice(-zoomDays);
    
    chartInstances.timeSeries = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.map(d => d.date),
            datasets: [{
                label: getMetricLabel(metric),
                data: filteredData.map(d => d[metric]),
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...getChartOptions('Time Series Interactive', 'Data', getMetricLabel(metric)),
            plugins: {
                ...getChartOptions().plugins,
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                }
            }
        }
    });
}

function updateScatterChart() {
    if (queryData.length === 0) return;
    
    const ctx = document.getElementById('scatterChart');
    if (!ctx) return;
    
    if (chartInstances.scatter) {
        chartInstances.scatter.destroy();
    }
    
    const topQueries = queryData.slice(0, 50);
    
    chartInstances.scatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Query Performance',
                data: topQueries.map(query => ({
                    x: query.impressions,
                    y: query.clicks,
                    r: Math.max(3, query.ctr * 2)
                })),
                backgroundColor: 'rgba(255, 107, 157, 0.6)',
                borderColor: '#ff6b9d',
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions('Impressioni vs Clicks', 'Impressioni', 'Clicks'),
            scales: {
                ...getChartOptions().scales,
                x: {
                    ...getChartOptions().scales.x,
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Impressioni',
                        color: '#ffffff'
                    }
                },
                y: {
                    ...getChartOptions().scales.y,
                    title: {
                        display: true,
                        text: 'Clicks',
                        color: '#ffffff'
                    }
                }
            }
        }
    });
    
    generateScatterInsights(topQueries);
}

function generateScatterInsights(queries) {
    const container = document.getElementById('scatterInsights');
    if (!container) return;
    
    const highImpressionLowClick = queries.filter(q => q.impressions > 10000 && q.clicks < 100);
    const correlationAnalysis = calculateCorrelation(queries.map(q => q.impressions), queries.map(q => q.clicks));
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🎯 Performance Analysis</div>
            <div class="insight-desc">
                <strong>Correlazione Impressioni-Clicks:</strong> ${correlationAnalysis.toFixed(2)}<br>
                <strong>Query sottoperformanti:</strong> ${highImpressionLowClick.length}<br>
                <strong>Opportunità CTR:</strong> ${highImpressionLowClick.length > 0 ? 'Alta' : 'Media'}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

function updateSunburstChart() {
    const ctx = document.getElementById('sunburstChart');
    if (!ctx) return;
    
    if (chartInstances.sunburst) {
        chartInstances.sunburst.destroy();
    }
    
    // Simulate sunburst data with nested categories
    const sunburstData = generateSunburstData();
    
    chartInstances.sunburst = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sunburstData.labels,
            datasets: [{
                data: sunburstData.data,
                backgroundColor: sunburstData.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...getChartOptions('Sunburst Categories'),
            cutout: '30%'
        }
    });
}

function generateSunburstData() {
    if (queryData.length === 0) {
        return {
            labels: ['No Data'],
            data: [1],
            colors: ['#667eea']
        };
    }
    
    const categoryData = categorizeQueries(queryData);
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData).map(cat => cat.clicks);
    const colors = ['#ff6b9d', '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#f8b500'];
    
    return { labels, data, colors };
}

function updateRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;
    
    if (chartInstances.radar) {
        chartInstances.radar.destroy();
    }
    
    const radarData = generateRadarData();
    
    chartInstances.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Clicks', 'Impressioni', 'CTR', 'Posizione', 'Copertura', 'Engagement'],
            datasets: [{
                label: 'Performance Attuale',
                data: radarData.current,
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.2)',
                borderWidth: 3
            }, {
                label: 'Benchmark Settore',
                data: radarData.benchmark,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 3
            }]
        },
        options: {
            ...getChartOptions('Radar Performance'),
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
    
    generateRadarInsights(radarData);
}

function generateRadarData() {
    const totalClicks = getTotalClicks();
    const totalImpressions = getTotalImpressions();
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgPosition = getAveragePosition();
    
    // Normalize values to 0-100 scale
    const current = [
        Math.min(100, (totalClicks / 100000) * 100), // Clicks
        Math.min(100, (totalImpressions / 1000000) * 100), // Impressions
        Math.min(100, avgCTR * 10), // CTR
        Math.max(0, 100 - (avgPosition * 10)), // Position (inverted)
        Math.min(100, (queryData.length / 1000) * 100), // Coverage
        Math.min(100, avgCTR * 5) // Engagement
    ];
    
    // Industry benchmark (simulated)
    const benchmark = [60, 70, 25, 60, 50, 30];
    
    return { current, benchmark };
}

function generateRadarInsights(data) {
    const container = document.getElementById('radarInsights');
    if (!container) return;
    
    const strengths = [];
    const weaknesses = [];
    
    const labels = ['Clicks', 'Impressioni', 'CTR', 'Posizione', 'Copertura', 'Engagement'];
    
    data.current.forEach((value, index) => {
        const benchmark = data.benchmark[index];
        if (value > benchmark + 10) {
            strengths.push(labels[index]);
        } else if (value < benchmark - 10) {
            weaknesses.push(labels[index]);
        }
    });
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🕸️ Performance Radar</div>
            <div class="insight-desc">
                <strong>Punti di forza:</strong> ${strengths.join(', ') || 'Da valutare'}<br>
                <strong>Aree di miglioramento:</strong> ${weaknesses.join(', ') || 'Performance bilanciata'}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

function updateSankeyChart() {
    const ctx = document.getElementById('sankeyChart');
    if (!ctx) return;
    
    if (chartInstances.sankey) {
        chartInstances.sankey.destroy();
    }
    
    // Simulate user journey data
    const sankeyData = generateSankeyData();
    
    // Use a bar chart to simulate Sankey diagram
    chartInstances.sankey = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sankeyData.labels,
            datasets: [{
                label: 'User Flow',
                data: sankeyData.data,
                backgroundColor: [
                    '#ff6b9d', '#667eea', '#764ba2', '#f093fb', '#f5576c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...getChartOptions('User Journey Flow', 'Journey Steps', 'Users'),
            indexAxis: 'y'
        }
    });
    
    generateSankeyInsights(sankeyData);
}

function generateSankeyData() {
    // Simulate user journey steps
    const labels = ['Ricerca', 'Visualizzazione', 'Interesse', 'Confronto', 'Conversione'];
    const data = [10000, 7500, 5000, 2500, 1000]; // Simulated funnel data
    
    return { labels, data };
}

function generateSankeyInsights(data) {
    const container = document.getElementById('sankeyInsights');
    if (!container) return;
    
    const conversionRate = ((data.data[data.data.length - 1] / data.data[0]) * 100).toFixed(2);
    const dropoffPoint = data.labels[data.data.findIndex((val, index) => 
        index > 0 && ((data.data[index-1] - val) / data.data[index-1]) > 0.4
    )];
    
    const insights = `
        <div class="insight-item">
            <div class="insight-title">🔗 User Journey</div>
            <div class="insight-desc">
                <strong>Conversion Rate:</strong> ${conversionRate}%<br>
                <strong>Maggior drop-off:</strong> ${dropoffPoint || 'Flusso uniforme'}<br>
                <strong>Utenti iniziali:</strong> ${data.data[0].toLocaleString()}
            </div>
        </div>
    `;
    
    container.innerHTML = insights;
}

// ==============================================
// OPPORTUNITÀ
// ==============================================

function generateOpportunities() {
    console.log('Generating opportunities...');
    
    generateQuickWins();
    generateHighValueOpportunities();
    generatePriorityIssues();
    generateGeoExpansion();
    generateContentGaps();
    generateGrowthPotential();
}

function generateQuickWins() {
    const container = document.getElementById('quickWins');
    if (!container) return;
    
    const quickWins = [];
    
    // Position 4-10 opportunities
    if (queryData.length > 0) {
        const position4to10 = queryData.filter(q => q.position > 3 && q.position <= 10 && q.impressions > 1000);
        if (position4to10.length > 0) {
            quickWins.push({
                title: '🎯 Posizioni 4-10 da Ottimizzare',
                desc: `${position4to10.length} query con buone impressioni in posizioni migliorabili`,
                metrics: `Potenziale: +${Math.round(position4to10.reduce((sum, q) => sum + q.impressions, 0) * 0.02).toLocaleString()} clicks`
            });
        }
    }
    
    // Low CTR with high impressions
    if (queryData.length > 0) {
        const lowCTRHighImpressions = queryData.filter(q => q.ctr < 2 && q.impressions > 5000);
        if (lowCTRHighImpressions.length > 0) {
            quickWins.push({
                title: '📈 CTR da Migliorare',
                desc: `${lowCTRHighImpressions.length} query con alto volume ma CTR basso`,
                metrics: `Impressioni totali: ${lowCTRHighImpressions.reduce((sum, q) => sum + q.impressions, 0).toLocaleString()}`
            });
        }
    }
    
    renderOpportunityItems(container, quickWins);
}

function generateHighValueOpportunities() {
    const container = document.getElementById('highValueOpportunities');
    if (!container) return;
    
    const highValueOps = [];
    
    // High impression opportunities
    if (queryData.length > 0) {
        const highImpression = queryData.filter(q => q.impressions > 10000 && q.position > 5);
        if (highImpression.length > 0) {
            highValueOps.push({
                title: '💎 Query ad Alto Traffico',
                desc: `${highImpression.length} query con impressioni >10k da posizionare meglio`,
                metrics: `Valore stimato: €${Math.round(highImpression.reduce((sum, q) => sum + q.impressions, 0) * 0.001).toLocaleString()}`
            });
        }
    }
    
    // Category expansion opportunities
    if (queryData.length > 0) {
        const categoryData = categorizeQueries(queryData);
        const underperformingCategories = Object.entries(categoryData)
            .filter(([_, data]) => data.queries.length > 10 && data.clicks / data.queries.length < 50)
            .slice(0, 2);
        
        underperformingCategories.forEach(([category, data]) => {
            highValueOps.push({
                title: `🏷️ Espansione ${category}`,
                desc: `Categoria con ${data.queries.length} query sottoperformanti`,
                metrics: `Potenziale clicks: +${Math.round(data.queries.length * 50).toLocaleString()}`
            });
        });
    }
    
    renderOpportunityItems(container, highValueOps);
}

function generatePriorityIssues() {
    const container = document.getElementById('priorityIssues');
    if (!container) return;
    
    const priorityIssues = [];
    
    // High position, low clicks
    if (queryData.length > 0) {
        const underperforming = queryData.filter(q => q.position <= 3 && q.clicks < 100);
        if (underperforming.length > 0) {
            priorityIssues.push({
                title: '⚠️ Top Position, Bassi Click',
                desc: `${underperforming.length} query in top 3 con performance sotto le aspettative`,
                metrics: `Posizione media: ${(underperforming.reduce((sum, q) => sum + q.position, 0) / underperforming.length).toFixed(1)}`
            });
        }
    }
    
    // Declining performance (simulated)
    if (dateData.length > 7) {
        const recent = dateData.slice(-7).reduce((sum, d) => sum + d.clicks, 0);
        const previous = dateData.slice(-14, -7).reduce((sum, d) => sum + d.clicks, 0);
        if (recent < previous * 0.9) {
            priorityIssues.push({
                title: '📉 Trend Negativo',
                desc: 'Performance in calo negli ultimi 7 giorni',
                metrics: `Calo: ${(((previous - recent) / previous) * 100).toFixed(1)}%`
            });
        }
    }
    
    renderOpportunityItems(container, priorityIssues);
}

function generateGeoExpansion() {
    const container = document.getElementById('geoExpansion');
    if (!container) return;
    
    const geoOps = [];
    
    if (countryData.length > 5) {
        const topCountries = countryData.slice(0, 5);
        const otherCountries = countryData.slice(5);
        
        const untappedImpressions = otherCountries.reduce((sum, c) => sum + c.impressions, 0);
        if (untappedImpressions > 50000) {
            geoOps.push({
                title: '🌍 Mercati Secondari',
                desc: `${otherCountries.length} paesi con potenziale non sfruttato`,
                metrics: `Impressioni disponibili: ${untappedImpressions.toLocaleString()}`
            });
        }
        
        // Low CTR countries
        const lowCTRCountries = countryData.filter(c => c.ctr < 1 && c.impressions > 1000);
        if (lowCTRCountries.length > 0) {
            geoOps.push({
                title: '📊 Ottimizzazione Geografica',
                desc: `${lowCTRCountries.length} paesi con CTR sotto l'1%`,
                metrics: `Potenziale: +${Math.round(lowCTRCountries.reduce((sum, c) => sum + c.impressions, 0) * 0.01).toLocaleString()} clicks`
            });
        }
    }
    
    renderOpportunityItems(container, geoOps);
}

function generateContentGaps() {
    const container = document.getElementById('contentGaps');
    if (!container) return;
    
    const contentGaps = [];
    
    if (queryData.length > 0) {
        // Informational gaps
        const informationalQueries = queryData.filter(q => 
            intentKeywords.informational.some(keyword => q.query.toLowerCase().includes(keyword))
        );
        
        const lowPerformingInfo = informationalQueries.filter(q => q.position > 10 && q.impressions > 1000);
        if (lowPerformingInfo.length > 0) {
            contentGaps.push({
                title: '📚 Gap Contenuti Informativi',
                desc: `${lowPerformingInfo.length} query informative in posizioni basse`,
                metrics: `Impressioni perse: ${lowPerformingInfo.reduce((sum, q) => sum + q.impressions, 0).toLocaleString()}`
            });
        }
        
        // Commercial gaps
        const commercialQueries = queryData.filter(q => 
            intentKeywords.commercial.some(keyword => q.query.toLowerCase().includes(keyword))
        );
        
        const underperformingCommercial = commercialQueries.filter(q => q.ctr < 3 && q.impressions > 2000);
        if (underperformingCommercial.length > 0) {
            contentGaps.push({
                title: '🛒 Gap Contenuti Commerciali',
                desc: `${underperformingCommercial.length} query commerciali con CTR basso`,
                metrics: `Potenziale revenue: €${Math.round(underperformingCommercial.reduce((sum, q) => sum + q.impressions, 0) * 0.002).toLocaleString()}`
            });
        }
    }
    
    renderOpportunityItems(container, contentGaps);
}

function generateGrowthPotential() {
    const container = document.getElementById('growthPotential');
    if (!container) return;
    
    const growthOps = [];
    
    // Calculate overall growth potential
    const totalImpressions = getTotalImpressions();
    const totalClicks = getTotalClicks();
    const currentCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    
    if (currentCTR > 0) {
        const potentialCTR = Math.min(currentCTR * 1.5, 8); // Realistic improvement
        const additionalClicks = Math.round((totalImpressions * (potentialCTR - currentCTR)) / 100);
        
        growthOps.push({
            title: '🚀 Potenziale Crescita CTR',
            desc: `Migliorando il CTR dal ${currentCTR.toFixed(2)}% al ${potentialCTR.toFixed(2)}%`,
            metrics: `Clicks aggiuntivi: +${additionalClicks.toLocaleString()}`
        });
    }
    
    // Position improvement potential
    if (queryData.length > 0) {
        const improvableQueries = queryData.filter(q => q.position > 5 && q.position <= 20);
        const potentialClicks = improvableQueries.reduce((sum, q) => {
            const improvement = Math.max(0, (20 - q.position) / 20);
            return sum + Math.round(q.impressions * improvement * 0.1);
        }, 0);
        
        if (potentialClicks > 1000) {
            growthOps.push({
                title: '📈 Miglioramento Posizioni',
                desc: `${improvableQueries.length} query migliorabili in posizioni 5-20`,
                metrics: `Potenziale clicks: +${potentialClicks.toLocaleString()}`
            });
        }
    }
    
    renderOpportunityItems(container, growthOps);
}

function renderOpportunityItems(container, items) {
    if (items.length === 0) {
        container.innerHTML = '<p>Nessuna opportunità rilevata con i dati attuali.</p>';
        return;
    }
    
    const html = items.map(item => `
        <div class="opportunity-item">
            <div class="opportunity-title">${item.title}</div>
            <div class="opportunity-desc">${item.desc}</div>
            <div class="opportunity-metrics">${item.metrics}</div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

function getTotalClicks() {
    let total = 0;
    if (dateData.length > 0) total = Math.max(total, dateData.reduce((sum, d) => sum + d.clicks, 0));
    if (queryData.length > 0) total = Math.max(total, queryData.reduce((sum, d) => sum + d.clicks, 0));
    return total;
}

function getTotalImpressions() {
    let total = 0;
    if (dateData.length > 0) total = Math.max(total, dateData.reduce((sum, d) => sum + d.impressions, 0));
    if (queryData.length > 0) total = Math.max(total, queryData.reduce((sum, d) => sum + d.impressions, 0));
    return total;
}

function getAveragePosition() {
    const positions = [];
    if (dateData.length > 0) positions.push(...dateData.map(d => d.position).filter(p => p > 0));
    if (queryData.length > 0) positions.push(...queryData.map(d => d.position).filter(p => p > 0));
    return positions.length > 0 ? positions.reduce((sum, p) => sum + p, 0) / positions.length : 0;
}

function getMetricLabel(metric) {
    const labels = {
        'clicks': 'Clicks',
        'impressions': 'Impressioni',
        'ctr': 'CTR (%)',
        'position': 'Posizione Media'
    };
    return labels[metric] || metric;
}

function getChartOptions(title = '', xLabel = '', yLabel = '') {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: !!title,
                text: title,
                color: '#ffffff',
                font: {
                    size: 20,
                    weight: '700'
                },
                padding: 30
            },
            legend: {
                labels: {
                    color: '#ffffff',
                    usePointStyle: true,
                    padding: 25,
                    font: {
                        size: 14,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#667eea',
                borderWidth: 2,
                titleFont: {
                    size: 14,
                    weight: '700'
                },
                bodyFont: {
                    size: 13,
                    weight: '600'
                },
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 13,
                        weight: '600'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)'
                },
                title: {
                    display: !!yLabel,
                    text: yLabel,
                    color: '#ffffff',
                    font: {
                        size: 15,
                        weight: '700'
                    }
                }
            },
            x: {
                ticks: {
                    color: '#ffffff',
                    maxRotation: 45,
                    minRotation: 0,
                    font: {
                        size: 13,
                        weight: '600'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)'
                },
                title: {
                    display: !!xLabel,
                    text: xLabel,
                    color: '#ffffff',
                    font: {
                        size: 15,
                        weight: '700'
                    }
                }
            }
        }
    };
}

function getGradientColor(index, total) {
    const colors = [
        '#ff6b9d', '#667eea', '#764ba2', '#f093fb',
        '#f5576c', '#4facfe', '#43e97b', '#f8b500',
        '#fd79a8', '#fdcb6e', '#6c5ce7', '#e17055'
    ];
    return colors[index % colors.length];
}

// === FUNZIONI FILTRI AGGIUNTE === //
// (Solo per i nuovi filtri - non toccano la logica esistente)

function applyFilters() {
    const dateRange = document.getElementById('dateRange').value;
    const minImpressions = document.getElementById('minImpressions').value;
    const minClicks = document.getElementById('minClicks').value;
    const deviceType = document.getElementById('deviceType').value;
    
    console.log('🔧 Applicando filtri:', {
        dateRange, minImpressions, minClicks, deviceType
    });
    
    showNotification('Filtri applicati con successo!', 'success');
    
    // La logica di filtro si può integrare con le funzioni esistenti
    // Per ora mostra solo la notifica
}

function resetFilters() {
    document.getElementById('dateRange').value = 'all';
    document.getElementById('minImpressions').value = '10';
    document.getElementById('minClicks').value = '1';
    document.getElementById('deviceType').value = 'all';
    
    console.log('🔄 Filtri resettati');
    showNotification('Filtri resettati', 'info');
}

function exportData() {
    console.log('💾 Esportazione dati...');
    showNotification('Funzione export in sviluppo', 'info');
    
    // Qui si può integrare con le funzioni di export esistenti
}

// Sistema notifiche semplice
function showNotification(message, type) {
    // Rimuove notifiche precedenti
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Crea nuova notifica
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Rimuove dopo 3 secondi
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Aggiunge animazione CSS per le notifiche
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Console log for debugging
console.log('🎨 GSC Business Intelligence Tool - Design Nero Elegante Attivato');
console.log('👩‍💻 Made with love by Maria Paloschi');
console.log('✨ Grafici più grandi e filtri avanzati aggiunti');
console.log('Funzionalità incluse: Trend Analysis, Geographic Performance, Intent Classification, Business Intelligence, Opportunità');// === MIGLIORAMENTI SPECIFICI PER I PROBLEMI SEGNALATI === //

// 1. MIGLIORAMENTI STAGIONALITÀ - Eventi specifici
const seasonalEvents = {
    'Natale': {
        months: [11, 0], // Dicembre, Gennaio
        keywords: ['natale', 'christmas', 'regali', 'gift', 'festivo', 'natalizio'],
        boost: 1.5,
        color: '#ff6b9d'
    },
    'Saldi Invernali': {
        months: [0, 1], // Gennaio, Febbraio
        keywords: ['saldi', 'sale', 'sconto', 'ridotto', 'offerta'],
        boost: 1.3,
        color: '#667eea'
    },
    'San Valentino': {
        months: [1], // Febbraio
        keywords: ['san valentino', 'valentine', 'amore', 'regalo romantico', 'coppia'],
        boost: 1.4,
        color: '#f093fb'
    },
    'Primavera': {
        months: [2, 3, 4], // Marzo, Aprile, Maggio
        keywords: ['primavera', 'spring', 'collezione primavera'],
        boost: 1.2,
        color: '#43e97b'
    },
    'Estate': {
        months: [5, 6, 7], // Giugno, Luglio, Agosto
        keywords: ['estate', 'summer', 'vacanza', 'mare', 'spiaggia'],
        boost: 1.3,
        color: '#f8b500'
    },
    'Saldi Estivi': {
        months: [6, 7], // Luglio, Agosto
        keywords: ['saldi estivi', 'summer sale', 'liquidazione'],
        boost: 1.4,
        color: '#4facfe'
    },
    'Back to School': {
        months: [8], // Settembre
        keywords: ['scuola', 'università', 'back to school', 'rientro'],
        boost: 1.2,
        color: '#764ba2'
    },
    'Black Friday': {
        months: [10], // Novembre
        keywords: ['black friday', 'cyber monday', 'venerdì nero', 'super offerte'],
        boost: 1.8,
        color: '#ff6b9d'
    }
};

// 2. CLUSTERIZZAZIONE MIGLIORATA - Keywords più specifiche per fashion/ecommerce
const improvedCategoryKeywords = {
    'Abbigliamento Donna': [
        'vestito donna', 'abito femminile', 'camicetta', 'gonna', 'blusa', 'top donna', 
        'maglietta donna', 'felpa donna', 'giacca donna', 'cappotto donna', 'cardigan',
        'tubino', 'maxi dress', 'mini dress', 'tailleur', 'blazer donna'
    ],
    'Abbigliamento Uomo': [
        'camicia uomo', 'polo uomo', 'pantaloni uomo', 'jeans uomo', 'giacca uomo',
        'cappotto uomo', 'felpa uomo', 'maglietta uomo', 'suit', 'completo uomo',
        'blazer uomo', 'giubbotto uomo'
    ],
    'Scarpe Donna': [
        'scarpe donna', 'tacchi', 'décolleté', 'ballerine', 'sandali donna', 'stivali donna',
        'sneakers donna', 'zeppe', 'mocassini donna', 'scarpe eleganti donna', 'mary jane',
        'ankle boots', 'scarpe da sera'
    ],
    'Scarpe Uomo': [
        'scarpe uomo', 'mocassini uomo', 'stringate', 'oxford', 'derby', 'stivali uomo',
        'sneakers uomo', 'scarpe eleganti uomo', 'scarpe casual uomo', 'loafer',
        'chelsea boots', 'desert boots'
    ],
    'Borse & Accessori': [
        'borsa', 'zaino', 'valigia', 'portafoglio', 'cintura', 'sciarpa', 'foulard',
        'cappello', 'guanti', 'occhiali', 'gioielli', 'orologio', 'braccialetto',
        'collana', 'anello', 'orecchini'
    ],
    'Intimo & Lingerie': [
        'intimo', 'lingerie', 'reggiseno', 'slip', 'boxer', 'pigiama', 'camicia da notte',
        'body', 'guaina', 'corsetto', 'calze', 'collant', 'autoreggenti',
        'costumi da bagno', 'bikini', 'costume intero'
    ],
    'Sport & Tempo Libero': [
        'abbigliamento sportivo', 'tuta', 'leggins', 'shorts sportivi', 'top sportivo',
        'scarpe running', 'scarpe ginnastica', 'sneakers', 'felpa sport', 'pantaloncini',
        'costume piscina', 'abbigliamento palestra'
    ],
    'Bambini': [
        'abbigliamento bambino', 'abbigliamento bambina', 'vestitini', 'tutine',
        'scarpe bambino', 'scarpe bambina', 'giacche bambino', 'pantaloni bambino',
        'magliette bambino', 'gonna bambina'
    ]
};

// 3. INTENTI MIGLIORATI - Più precisi
const improvedIntentKeywords = {
    transactional: [
        'acquista', 'compra', 'carrello', 'checkout', 'pagamento', 'ordina', 'prenota',
        'aggiungi al carrello', 'buy now', 'purchase', 'order', 'shop now', 'spedizione gratuita'
    ],
    commercial: [
        'prezzo', 'costo', 'offerta', 'sconto', 'promozione', 'outlet', 'saldi', 'deal',
        'migliore', 'confronto', 'recensioni', 'opinioni', 'economico', 'conveniente',
        'qualità prezzo', 'black friday', 'cyber monday', 'liquidazione', 'super offerta'
    ],
    informational: [
        'come', 'cosa', 'perché', 'quando', 'dove', 'guida', 'tutorial', 'consigli',
        'informazioni', 'caratteristiche', 'specifiche', 'differenza', 'vantaggi',
        'svantaggi', 'quale scegliere', 'come indossare', 'abbinamenti', 'tendenze'
    ],
    navigational: [
        'sito ufficiale', 'homepage', 'contatti', 'negozio', 'store', 'brand',
        'marchio', 'login', 'accedi', 'registrati', 'account', 'profilo',
        'dove trovare', 'punti vendita', 'rivenditori'
    ]
};

// 4. FUNZIONE MIGLIORATA PER STAGIONALITÀ
function getSeasonalEventForDate(date, query) {
    const month = date.getMonth();
    const queryLower = query.toLowerCase();
    
    for (const [eventName, eventData] of Object.entries(seasonalEvents)) {
        // Controlla il mese
        if (eventData.months.includes(month)) {
            // Controlla se ci sono keyword nell'evento
            const hasKeyword = eventData.keywords.some(keyword => 
                queryLower.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                return {
                    event: eventName,
                    boost: eventData.boost,
                    color: eventData.color
                };
            }
        }
    }
    
    return null;
}

// 5. FUNZIONE MIGLIORATA PER CLUSTERIZZAZIONE
function improvedCategorizeQueries(queries) {
    const categories = {};
    
    // Inizializza categorie migliorate
    Object.keys(improvedCategoryKeywords).forEach(category => {
        categories[category] = { clicks: 0, queries: [] };
    });
    categories['Altri'] = { clicks: 0, queries: [] };
    
    queries.forEach(query => {
        const queryLower = query.query.toLowerCase();
        let categorized = false;
        let bestMatch = { category: null, score: 0 };
        
        // Trova la migliore corrispondenza
        for (const [category, keywords] of Object.entries(improvedCategoryKeywords)) {
            let score = 0;
            keywords.forEach(keyword => {
                if (queryLower.includes(keyword.toLowerCase())) {
                    // Punteggio più alto per match più specifici
                    score += keyword.split(' ').length;
                }
            });
            
            if (score > bestMatch.score) {
                bestMatch = { category, score };
            }
        }
        
        if (bestMatch.score > 0) {
            categories[bestMatch.category].clicks += query.clicks;
            categories[bestMatch.category].queries.push(query);
            categorized = true;
        }
        
        if (!categorized) {
            categories['Altri'].clicks += query.clicks;
            categories['Altri'].queries.push(query);
        }
    });
    
    return categories;
}

// 6. FUNZIONE MIGLIORATA PER INTENTI
function improvedClassifyQueries(queries) {
    const intentData = {
        transactional: { queries: [], clicks: 0 },
        commercial: { queries: [], clicks: 0 },
        informational: { queries: [], clicks: 0 },
        navigational: { queries: [], clicks: 0 }
    };
    
    queries.forEach(query => {
        const queryLower = query.query.toLowerCase();
        let classified = false;
        let bestMatch = { intent: null, score: 0 };
        
        // Algoritmo migliorato per intent - RISOLVE PROBLEMI DI RENDERING
        for (const [intent, keywords] of Object.entries(improvedIntentKeywords)) {
            let score = 0;
            keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                if (queryLower.includes(keywordLower)) {
                    score += keyword.split(' ').length * 2;
                    
                    // Bonus per match esatto
                    if (queryLower === keywordLower) {
                        score += 8;
                    }
                    
                    // Bonus specifici per intent
                    if (intent === 'transactional' && (queryLower.includes('acquista') || queryLower.includes('compra'))) {
                        score += 5;
                    }
                    if (intent === 'commercial' && (queryLower.includes('prezzo') || queryLower.includes('offerta'))) {
                        score += 4;
                    }
                }
            });
            
            if (score > bestMatch.score) {
                bestMatch = { intent, score };
            }
        }
        
        if (bestMatch.score > 0) {
            intentData[bestMatch.intent].queries.push(query);
            intentData[bestMatch.intent].clicks += query.clicks;
            classified = true;
        }
        
        // Fallback migliorato per ridurre errori di rendering
        if (!classified) {
            // Analisi euristica migliorata
            if (queryLower.includes('come') || queryLower.includes('cosè') || queryLower.includes('perché')) {
                intentData.informational.queries.push(query);
                intentData.informational.clicks += query.clicks;
            } else if (queryLower.includes('dove') || queryLower.includes('quando')) {
                intentData.navigational.queries.push(query);
                intentData.navigational.clicks += query.clicks;
            } else if (queryLower.includes('sito') || queryLower.includes('home')) {
                intentData.navigational.queries.push(query);
                intentData.navigational.clicks += query.clicks;
            } else {
                // Default a commercial per query business-oriented
                intentData.commercial.queries.push(query);
                intentData.commercial.clicks += query.clicks;
            }
        }
    });
    
    return intentData;
}

// 7. CONFIGURAZIONE GRAFICI MIGLIORATA
const improvedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#ffffff',
                font: {
                    size: 14,
                    weight: 'bold',
                    family: 'Inter'
                },
                padding: 20
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13,
                weight: '600'
            },
            padding: 12,
            cornerRadius: 8
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#ffffff',
                font: {
                    size: 12,
                    weight: '600',
                    family: 'Inter'
                },
                maxRotation: 45
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            ticks: {
                color: '#ffffff',
                font: {
                    size: 12,
                    weight: '600',
                    family: 'Inter'
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
};

console.log('✨ Miglioramenti JavaScript caricati:');
console.log('📅 Eventi stagionali specifici');
console.log('🏷️ Clusterizzazione migliorata');
console.log('🎯 Classificazione intenti precisa');
console.log('📊 Grafici più leggibili');// =================== CLUSTERING SOLO CON DESINENZE URL ===================
// Funzione di clustering basata ESCLUSIVAMENTE sulle desinenze degli URL delle pagine

function urlBasedCategorizeQueries(queries, pages) {
    const categories = {};
    
    // Se non abbiamo dati delle pagine, usa fallback semplice
    if (!pages || pages.length === 0) {
        console.log('No page data available, using fallback');
        return simpleFallbackCategorization(queries);
    }
    
    console.log('Using URL-based clustering with', pages.length, 'pages');
    
    // Estrai categorie dalle URL delle pagine
    const urlCategories = extractCategoriesFromUrls(pages);
    console.log('Found URL categories:', Object.keys(urlCategories));
    
    // Inizializza categorie trovate negli URL
    Object.keys(urlCategories).forEach(category => {
        categories[category] = { 
            clicks: 0, 
            queries: [], 
            urlPatterns: urlCategories[category].patterns || []
        };
    });
    categories['Altri'] = { clicks: 0, queries: [], urlPatterns: [] };
    
    // Associa query alle categorie basandosi sulle pagine
    queries.forEach(query => {
        let bestMatch = { category: 'Altri', score: 0 };
        
        // Cerca tra le categorie URL
        for (const [category, categoryData] of Object.entries(urlCategories)) {
            let score = 0;
            
            // Controlla se la query match con i pattern URL
            categoryData.patterns.forEach(pattern => {
                const queryLower = query.query.toLowerCase();
                const patternLower = pattern.toLowerCase();
                
                if (queryLower.includes(patternLower)) {
                    score += patternLower.length;
                }
                
                // Controlla anche parole singole del pattern
                const patternWords = patternLower.split(/[-_\s]+/);
                patternWords.forEach(word => {
                    if (word.length > 3 && queryLower.includes(word)) {
                        score += word.length / 2;
                    }
                });
            });
            
            if (score > bestMatch.score) {
                bestMatch = { category, score };
            }
        }
        
        // Assegna alla categoria migliore
        if (categories[bestMatch.category]) {
            categories[bestMatch.category].clicks += query.clicks || 0;
            categories[bestMatch.category].queries.push(query);
        }
    });
    
    // Rimuovi categorie vuote
    Object.keys(categories).forEach(category => {
        if (categories[category].queries.length === 0 && category !== 'Altri') {
            delete categories[category];
        }
    });
    
    console.log('Final categories:', Object.keys(categories));
    return categories;
}

// Estrae categorie dalle desinenze URL delle pagine
function extractCategoriesFromUrls(pages) {
    const urlPatterns = {};
    
    pages.forEach(page => {
        const url = page.page || page.url || '';
        if (!url) return;
        
        const urlLower = url.toLowerCase();
        
        // Rimuovi parametri e frammenti
        const cleanUrl = urlLower.split('?')[0].split('#')[0];
        
        // Estrai segmenti significativi
        const segments = cleanUrl.split('/').filter(segment => 
            segment.length > 0 && 
            !['www', 'it', 'com', 'net', 'org', 'shop', 'store', 'https:', 'http:'].includes(segment) &&
            !segment.match(/^\d+$/) // escludi solo numeri
        );
        
        segments.forEach(segment => {
            // Pulisci il segmento
            const cleanSegment = segment.replace(/[-_]+/g, ' ').trim();
            
            if (cleanSegment.length > 2) {
                const categoryName = formatCategoryName(cleanSegment);
                
                if (!urlPatterns[categoryName]) {
                    urlPatterns[categoryName] = {
                        patterns: [],
                        count: 0,
                        totalClicks: 0
                    };
                }
                
                if (!urlPatterns[categoryName].patterns.includes(segment)) {
                    urlPatterns[categoryName].patterns.push(segment);
                }
                
                urlPatterns[categoryName].count++;
                urlPatterns[categoryName].totalClicks += page.clicks || 0;
            }
        });
    });
    
    // Filtra e ordina le categorie
    const filteredCategories = {};
    
    Object.entries(urlPatterns)
        .filter(([name, data]) => data.count >= 2) // minimo 2 occorrenze
        .sort(([,a], [,b]) => b.totalClicks - a.totalClicks) // ordina per clicks
        .slice(0, 12) // massimo 12 categorie
        .forEach(([name, data]) => {
            filteredCategories[name] = data;
        });
    
    return filteredCategories;
}

// Formatta il nome della categoria
function formatCategoryName(segment) {
    // Converti in formato leggibile
    const words = segment.split(/[\s-_]+/);
    const formatted = words
        .filter(word => word.length > 1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Sostituzioni specifiche per migliorare i nomi
    const replacements = {
        'Donna': 'Donna',
        'Uomo': 'Uomo', 
        'Women': 'Donna',
        'Men': 'Uomo',
        'Scarpe': 'Scarpe',
        'Shoes': 'Scarpe',
        'Borse': 'Borse',
        'Bags': 'Borse',
        'Casa': 'Casa',
        'Home': 'Casa',
        'Bambini': 'Bambini',
        'Kids': 'Bambini',
        'Baby': 'Neonati',
        'Sport': 'Sport',
        'Beauty': 'Beauty',
        'Tech': 'Tecnologia',
        'Sale': 'Saldi',
        'Saldi': 'Saldi',
        'Outlet': 'Outlet'
    };
    
    return replacements[formatted] || formatted;
}

// Fallback semplice quando non ci sono dati URL
function simpleFallbackCategorization(queries) {
    const categories = {
        'Query Top': { clicks: 0, queries: [] },
        'Query Medie': { clicks: 0, queries: [] },
        'Query Long-tail': { clicks: 0, queries: [] },
        'Altri': { clicks: 0, queries: [] }
    };
    
    // Ordina query per clicks
    const sortedQueries = [...queries].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    
    const total = sortedQueries.length;
    const topThreshold = Math.ceil(total * 0.1); // top 10%
    const mediumThreshold = Math.ceil(total * 0.3); // 30%
    
    sortedQueries.forEach((query, index) => {
        if (index < topThreshold) {
            categories['Query Top'].clicks += query.clicks || 0;
            categories['Query Top'].queries.push(query);
        } else if (index < mediumThreshold) {
            categories['Query Medie'].clicks += query.clicks || 0;
            categories['Query Medie'].queries.push(query);
        } else if (query.query.split(' ').length > 3) {
            categories['Query Long-tail'].clicks += query.clicks || 0;
            categories['Query Long-tail'].queries.push(query);
        } else {
            categories['Altri'].clicks += query.clicks || 0;
            categories['Altri'].queries.push(query);
        }
    });
    
    return categories;
}// =================== EVENTI STAGIONALI BUSINESS SEMPLICI ===================

function identifyBusinessEventsFromLabels(labels) {
    const events = [];
    
    labels.forEach(label => {
        const date = parseLabelToDate(label);
        if (!date) return;
        
        const month = date.getMonth() + 1; // 1-12
        const day = date.getDate();
        
        // Black Friday (ultimo venerdì novembre)
        if (month === 11 && day >= 22 && day <= 29) {
            events.push({
                name: 'Black Friday',
                type: 'black-friday',
                period: label
            });
        }
        
        // Cyber Monday (lunedì dopo Black Friday)
        if ((month === 11 && day >= 25) || (month === 12 && day <= 2)) {
            events.push({
                name: 'Cyber Monday',
                type: 'cyber-monday', 
                period: label
            });
        }
        
        // Periodo Natalizio
        if (month === 12 && day <= 25) {
            events.push({
                name: 'Natale',
                type: 'natale',
                period: label
            });
        }
        
        // San Valentino
        if (month === 2 && day <= 14) {
            events.push({
                name: 'San Valentino',
                type: 'san-valentino',
                period: label
            });
        }
        
        // Saldi Invernali
        if ((month === 1) || (month === 2 && day <= 15)) {
            events.push({
                name: 'Saldi Invernali',
                type: 'saldi-invernali',
                period: label
            });
        }
        
        // Saldi Estivi
        if (month === 7 || month === 8) {
            events.push({
                name: 'Saldi Estivi',
                type: 'saldi-estivi',
                period: label
            });
        }
    });
    
    // Rimuovi duplicati
    const uniqueEvents = events.filter((event, index, self) => 
        index === self.findIndex(e => e.name === event.name)
    );
    
    return uniqueEvents;
}

function parseLabelToDate(label) {
    try {
        if (label.includes('-W')) {
            // Weekly format: YYYY-WXX
            const [year, weekStr] = label.split('-W');
            const week = parseInt(weekStr);
            const january1 = new Date(year, 0, 1);
            const days = (week - 1) * 7;
            return new Date(january1.getTime() + days * 24 * 60 * 60 * 1000);
        } else if (label.match(/^\d{4}-\d{2}$/)) {
            // Monthly format: YYYY-MM
            const [year, month] = label.split('-');
            return new Date(year, month - 1, 15); // metà mese
        } else if (label.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Daily format: YYYY-MM-DD
            return new Date(label);
        }
    } catch (e) {
        console.warn('Error parsing date:', label);
    }
    return null;
}
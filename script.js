// EGO DUST CS2 Server Status Script
const SERVER_IP = '95.173.175.34';
const SERVER_PORT = '27015';
const TRACKER_API = `https://tracker.oyunyoneticisi.com/?ip=${SERVER_IP}&port=${SERVER_PORT}`;
const USERBAR_API = `http://tracker.oyunyoneticisi.com/userbar.php?ip=${SERVER_IP}&port=${SERVER_PORT}&t=2`;

// Server data cache
let serverData = {
    players: [],
    playerCount: 0,
    maxPlayers: 32,
    map: 'de_dust2',
    status: 'offline',
    lastUpdate: null
};

// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    startAutoRefresh();
});

function initializePage() {
    // Initialize theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeToggle(true);
    }
    
    // Initial server data fetch
    refreshServerData();
    
    // Initialize activity chart
    initializeActivityChart();
}

function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.toggle('light-theme');
    
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeToggle(isLight);
}

function updateThemeToggle(isLight) {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    
    if (themeIcon && themeText) {
        themeIcon.textContent = isLight ? '☀️' : '🌙';
        themeText.textContent = isLight ? 'AÇIK TEMA' : 'KOYU TEMA';
    }
}

function refreshServerData() {
    updateStatus('Sunucu bilgileri güncelleniyor...', 'loading');
    
    // Try to fetch real server data from tracker image
    const serverImage = document.getElementById('serverImage');
    if (serverImage) {
        serverImage.src = `${USERBAR_API}&_t=${Date.now()}`;
        
        // Listen for image load to extract info
        serverImage.onload = function() {
            // Since we can't parse the image directly, we'll show basic info
            // and let the tracker image show the real data
            const basicData = {
                playerCount: 'Yükleniyor...',
                maxPlayers: 32,
                map: 'Tracker\'dan yükleniyor...',
                status: 'online',
                gameMode: 'CS2 Server',
                vacSecure: 'Güvenli'
            };
            
            updateServerInfo(basicData);
            updateServerStatus('online');
            
            // Show message that real data is in the tracker image
            const playersList = document.getElementById('playersList');
            if (playersList) {
                playersList.innerHTML = `
                    <div class="tracker-message">
                        <h3>🎮 Canlı Oyuncu Bilgileri</h3>
                        <p>Gerçek oyuncu listesi ve sunucu detayları yukarıdaki tracker görselinde gösterilmektedir.</p>
                        <p>Bu görsel otomatik olarak güncellenir ve şu bilgileri içerir:</p>
                        <ul>
                            <li>• Çevrimiçi oyuncu sayısı</li>
                            <li>• Aktif harita</li>
                            <li>• Sunucu durumu</li>
                            <li>• Ping bilgisi</li>
                        </ul>
                        <button onclick="showServerInfoModal()" class="tracker-detail-btn">
                            📊 Sunucu Detayları
                        </button>
                    </div>
                `;
            }
        };
        
        serverImage.onerror = function() {
            updateServerStatus('offline');
            updateStatus('Sunucu bilgilerine ulaşılamıyor', 'offline');
        };
    }
    
    serverData.lastUpdate = new Date();
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = formatTime(serverData.lastUpdate);
    }
}

function generateMockServerData() {
    const turkishNames = [
        'EgoDust_Pro', 'AteşKuşu', 'KurtAdam_TR', 'YıldızSavaşçısı', 'GölgeAvcısı',
        'TurkishSniper', 'IstanbulWarrior', 'AnkaraLegend', 'BursaGamer', 'IzmirPro',
        'CS2_Master', 'HeadHunter_TR', 'SilentKiller', 'TurkishEagle', 'RedBull_Gamer',
        'ProPlayer_TR', 'GamerBoy_34', 'TurkishLion', 'CS_Legend', 'EgoDustFan'
    ];
    
    const playerCount = Math.floor(Math.random() * 20) + 8;
    const players = [];
    
    for (let i = 0; i < playerCount; i++) {
        const randomName = turkishNames[Math.floor(Math.random() * turkishNames.length)];
        const randomScore = Math.floor(Math.random() * 30);
        const randomPing = Math.floor(Math.random() * 50) + 10;
        
        players.push({
            name: `${randomName}_${Math.floor(Math.random() * 999)}`,
            score: randomScore,
            ping: randomPing,
            time: Math.floor(Math.random() * 120) + 5
        });
    }
    
    players.sort((a, b) => b.score - a.score);
    
    const maps = ['de_dust2', 'de_mirage', 'de_inferno', 'de_cache', 'de_overpass', 'de_train'];
    
    return {
        players: players,
        playerCount: playerCount,
        maxPlayers: 32,
        map: maps[Math.floor(Math.random() * maps.length)],
        status: 'online',
        gameMode: 'Competitive',
        vacSecure: 'Evet'
    };
}

function updateServerInfo(data) {
    const elements = {
        playerCount: document.getElementById('playerCount'),
        currentMap: document.getElementById('currentMap'),
        serverStatus: document.getElementById('serverStatus'),
        totalPlayers: document.getElementById('totalPlayers'),
        maxPlayers: document.getElementById('maxPlayers'),
        gameMode: document.getElementById('gameMode'),
        vacSecure: document.getElementById('vacSecure')
    };
    
    if (elements.playerCount) elements.playerCount.textContent = `${data.playerCount}/${data.maxPlayers}`;
    if (elements.currentMap) elements.currentMap.textContent = data.map;
    if (elements.serverStatus) elements.serverStatus.textContent = 'Çevrimiçi';
    if (elements.totalPlayers) elements.totalPlayers.textContent = data.playerCount;
    if (elements.maxPlayers) elements.maxPlayers.textContent = data.maxPlayers;
    if (elements.gameMode) elements.gameMode.textContent = data.gameMode;
    if (elements.vacSecure) elements.vacSecure.textContent = data.vacSecure;
}

function updatePlayersList(players) {
    const playersList = document.getElementById('playersList');
    if (!playersList) return;
    
    if (players.length === 0) {
        playersList.innerHTML = `
            <div class="no-players">
                <p>Şu anda sunucuda oyuncu bulunmuyor</p>
            </div>
        `;
        return;
    }
    
    const playersHTML = players.map((player, index) => `
        <div class="player-item ${index < 3 ? 'top-player' : ''}">
            <div class="player-rank">${index + 1}</div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-stats">
                    <span class="score">Skor: ${player.score}</span>
                    <span class="ping">Ping: ${player.ping}ms</span>
                    <span class="time">Süre: ${player.time}dk</span>
                </div>
            </div>
        </div>
    `).join('');
    
    playersList.innerHTML = playersHTML;
}

function updateServerStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (statusIndicator && statusText) {
        statusIndicator.className = `status-indicator ${status}`;
        
        switch(status) {
            case 'online':
                statusText.textContent = 'ÇEVRİMİÇİ • 24/7';
                break;
            case 'offline':
                statusText.textContent = 'ÇEVRİMDIŞI';
                break;
            case 'loading':
                statusText.textContent = 'KONTROL EDİLİYOR...';
                break;
        }
    }
}

function updateStatus(message, type) {
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.textContent = message;
    }
    updateServerStatus(type);
}

function startAutoRefresh() {
    setInterval(refreshServerData, 30000);
    
    setInterval(() => {
        const serverImage = document.getElementById('serverImage');
        if (serverImage) {
            serverImage.src = `${USERBAR_API}&_t=${Date.now()}`;
        }
    }, 60000);
}

function initializeActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const hours = [];
    const playerCounts = [];
    
    for (let i = 0; i < 24; i++) {
        hours.push(`${i.toString().padStart(2, '0')}:00`);
        let baseCount = 5;
        if (i >= 18 || i <= 2) baseCount = 20;
        if (i >= 12 && i <= 17) baseCount = 15;
        if (i >= 6 && i <= 11) baseCount = 8;
        
        playerCounts.push(baseCount + Math.floor(Math.random() * 10));
    }
    
    drawActivityChart(ctx, canvas, hours, playerCounts);
    
    const avgPlayers = Math.floor(playerCounts.reduce((a, b) => a + b, 0) / playerCounts.length);
    const peakHour = hours[playerCounts.indexOf(Math.max(...playerCounts))];
    
    const avgElement = document.getElementById('avgPlayers');
    const peakElement = document.getElementById('peakHour');
    
    if (avgElement) avgElement.textContent = `${avgPlayers} oyuncu`;
    if (peakElement) peakElement.textContent = peakHour;
}

function drawActivityChart(ctx, canvas, hours, data) {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = '#ff8c00';
    ctx.fillStyle = 'rgba(255, 140, 0, 0.1)';
    ctx.lineWidth = 2;
    
    const maxValue = Math.max(...data);
    const stepX = (width - padding * 2) / (data.length - 1);
    const stepY = (height - padding * 2) / maxValue;
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - value * stepY;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - value * stepY;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    ctx.fillStyle = '#ff8c00';
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - value * stepY;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function copyIP() {
    const ip = `${SERVER_IP}:${SERVER_PORT}`;
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('IP adresi kopyalandı!');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('IP adresi kopyalandı!');
    });
}

function joinServer() {
    const steamUrl = `steam://connect/${SERVER_IP}:${SERVER_PORT}`;
    window.location.href = steamUrl;
    showNotification('Steam açılıyor...');
}

function openTracker() {
    window.open(TRACKER_API, '_blank');
}

function showServerInfoModal() {
    const modal = document.createElement('div');
    modal.className = 'server-info-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎮 EGO DUST - Sunucu Bilgileri</h2>
                    <button class="modal-close" onclick="closeServerInfoModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="server-info-grid">
                        <div class="info-section">
                            <h3>📊 Sunucu Detayları</h3>
                            <div class="info-item">
                                <span class="label">Sunucu Adı:</span>
                                <span class="value">EGO DUST CS2 Server</span>
                            </div>
                            <div class="info-item">
                                <span class="label">IP Adresi:</span>
                                <span class="value">95.173.175.34:27015</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Oyun:</span>
                                <span class="value">Counter-Strike 2</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Maksimum Oyuncu:</span>
                                <span class="value">32</span>
                            </div>
                            <div class="info-item">
                                <span class="label">VAC Güvenli:</span>
                                <span class="value">✅ Evet</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Bölge:</span>
                                <span class="value">Türkiye</span>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h3>🗺️ Harita Rotasyonu</h3>
                            <div class="map-list">
                                <div class="map-item">de_dust2</div>
                                <div class="map-item">de_mirage</div>
                                <div class="map-item">de_inferno</div>
                                <div class="map-item">de_cache</div>
                                <div class="map-item">de_overpass</div>
                                <div class="map-item">de_train</div>
                                <div class="map-item">de_nuke</div>
                                <div class="map-item">de_vertigo</div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h3>⚙️ Sunucu Özellikleri</h3>
                            <div class="features-list">
                                <div class="feature-item">🔫 Competitive Modu</div>
                                <div class="feature-item">🎯 128 Tick Rate</div>
                                <div class="feature-item">🛡️ Anti-Cheat Koruması</div>
                                <div class="feature-item">📊 İstatistik Takibi</div>
                                <div class="feature-item">🏆 Rank Sistemi</div>
                                <div class="feature-item">💬 Voice Chat</div>
                                <div class="feature-item">🔄 Otomatik Restart</div>
                                <div class="feature-item">⚡ Düşük Ping</div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h3>📋 Sunucu Kuralları</h3>
                            <div class="rules-list">
                                <div class="rule-item">1. Hile yasaktır</div>
                                <div class="rule-item">2. Küfür ve hakaret yasaktır</div>
                                <div class="rule-item">3. Spam yapmayın</div>
                                <div class="rule-item">4. Takım arkadaşlarınızı öldürmeyin</div>
                                <div class="rule-item">5. Mikrofonu gereksiz kullanmayın</div>
                                <div class="rule-item">6. Adminlere saygılı olun</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button onclick="copyIP()" class="action-btn copy-btn">
                            📋 IP Kopyala
                        </button>
                        <button onclick="joinServer()" class="action-btn join-btn">
                            🎮 Sunucuya Katıl
                        </button>
                        <button onclick="window.open('${TRACKER_API}', '_blank')" class="action-btn tracker-btn">
                            📊 Canlı İstatistikler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeServerInfoModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServerInfoModal();
        }
    });
}

function closeServerInfoModal() {
    const modal = document.querySelector('.server-info-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff8c00;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

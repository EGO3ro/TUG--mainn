// CS2 Server Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Game Mode Button Interactions
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            modeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const modeName = this.querySelector('span').textContent;
            showNotification(`${modeName} modu seçildi!`);
        });
    });

    // Action Button Interactions
    const joinServerBtn = document.querySelector('.join-server');
    const viewStatsBtn = document.querySelector('.view-stats');
    const leaderboardBtn = document.querySelector('.leaderboard');
    const discordBtn = document.querySelector('.discord');

    if (joinServerBtn) {
        joinServerBtn.addEventListener('click', function() {
            showNotification('Sunucuya bağlanılıyor...', 'success');
            // Simulate connection delay
            setTimeout(() => {
                showNotification('Sunucuya başarıyla bağlandı!', 'success');
            }, 2000);
        });
    }

    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', function() {
            showModal('İstatistikler', `
                <div class="stats-content">
                    <div class="stat-item">
                        <span class="stat-label">Toplam Öldürme:</span>
                        <span class="stat-value">1,247</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Ölüm:</span>
                        <span class="stat-value">892</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">K/D Oranı:</span>
                        <span class="stat-value">1.40</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Kazanma Oranı:</span>
                        <span class="stat-value">68%</span>
                    </div>
                </div>
            `);
        });
    }

    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function() {
            showModal('Liderlik Tablosu', `
                <div class="leaderboard-content">
                    <div class="leader-item">
                        <span class="rank">1.</span>
                        <span class="player">ProGamer2024</span>
                        <span class="score">2,450</span>
                    </div>
                    <div class="leader-item">
                        <span class="rank">2.</span>
                        <span class="player">EliteShooter</span>
                        <span class="score">2,380</span>
                    </div>
                    <div class="leader-item">
                        <span class="rank">3.</span>
                        <span class="player">HeadshotKing</span>
                        <span class="score">2,290</span>
                    </div>
                </div>
            `);
        });
    }

    if (discordBtn) {
        discordBtn.addEventListener('click', function() {
            showNotification('Discord sunucusuna yönlendiriliyor...', 'info');
            // Simulate opening Discord
            setTimeout(() => {
                window.open('https://discord.gg/example', '_blank');
            }, 1000);
        });
    }

    // Copy IP functionality
    const copyIpBtn = document.querySelector('.copy-ip');
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', function() {
            const ipAddress = document.querySelector('.ip-address').textContent;
            navigator.clipboard.writeText(ipAddress).then(() => {
                showNotification('IP adresi kopyalandı!', 'success');
                this.textContent = 'KOPYALANDI!';
                setTimeout(() => {
                    this.textContent = 'KOPYALA';
                }, 2000);
            });
        });
    }

    // Copy main IP functionality (welcome section)
    const copyIpMainBtn = document.querySelector('.copy-ip-main');
    if (copyIpMainBtn) {
        copyIpMainBtn.addEventListener('click', function() {
            const ipAddress = document.querySelector('.ip-address-main').textContent;
            navigator.clipboard.writeText(ipAddress).then(() => {
                showNotification('Sunucu IP adresi kopyalandı!', 'success');
                this.textContent = 'KOPYALANDI!';
                setTimeout(() => {
                    this.textContent = 'KOPYALA';
                }, 2000);
            });
        });
    }

    // Real-time server info updates
    function updateServerInfo() {
        const playerCount = document.querySelector('.info-card:first-child .info-content p');
        const currentPlayers = Math.floor(Math.random() * 10) + 15; // 15-24 players
        if (playerCount) {
            playerCount.textContent = `${currentPlayers}/32`;
        }

        const ping = document.querySelector('.info-card:last-child .info-content p');
        const currentPing = Math.floor(Math.random() * 20) + 10; // 10-30ms
        if (ping) {
            ping.textContent = `${currentPing}ms`;
        }
    }

    // Update server info every 5 seconds
    setInterval(updateServerInfo, 5000);

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#ff8c00'};
            color: #000000;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInNotification 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Modal system
    function showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyles = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: #1a1a1a;
                border: 2px solid #ff8c00;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #333;
            }
            .modal-header h3 {
                color: #ff8c00;
                font-size: 1.3rem;
            }
            .modal-close {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
            }
            .modal-body {
                padding: 20px;
            }
            .stats-content, .leaderboard-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .stat-item, .leader-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                background: rgba(40,40,40,0.8);
                border-radius: 5px;
            }
            .stat-label, .player {
                color: #cccccc;
            }
            .stat-value, .score {
                color: #ff8c00;
                font-weight: 600;
            }
            .rank {
                color: #00ff00;
                font-weight: 700;
            }
        `;
        
        if (!document.querySelector('#modal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'modal-styles';
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Add CSS animations for notifications
    const animationStyles = `
        @keyframes slideInNotification {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutNotification {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .mode-btn.active {
            border-color: #00ff00 !important;
            background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%) !important;
            color: #000000 !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Initialize with competitive mode selected
    const competitiveBtn = document.querySelector('.mode-btn.competitive');
    if (competitiveBtn) {
        competitiveBtn.classList.add('active');
    }

    // Welcome message
    setTimeout(() => {
        showNotification('Ego Dust\'a hoş geldiniz!', 'success');
    }, 1000);
});

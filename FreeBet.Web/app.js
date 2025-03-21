// DOM елементи
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const matchesContainer = document.querySelector('.matches-container');
const leaderboardContainer = document.querySelector('.leaderboard-container');

// Показване на модалния прозорец
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// Затваряне на модалния прозорец
closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Затваряне при клик извън модалния прозорец
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Обработка на формата за вход
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    
    try {
        // Тук ще добавим заявка към API-то за изпращане на SMS
        const response = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        if (response.ok) {
            // Тук ще добавим логика за въвеждане на кода
            alert('Код за потвърждение е изпратен на вашия телефон');
        } else {
            alert('Възникна грешка при изпращането на кода');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Възникна грешка при изпращането на кода');
    }
});

// Примерни данни за мачове (ще се заменят с данни от API-то)
const sampleMatches = [
    {
        id: 1,
        homeTeam: 'Левски',
        awayTeam: 'ЦСКА',
        time: '19:45',
        date: '2024-03-21'
    },
    {
        id: 2,
        homeTeam: 'Лудогорец',
        awayTeam: 'Ботев Пд',
        time: '17:30',
        date: '2024-03-21'
    },
    {
        id: 3,
        homeTeam: 'Черно море',
        awayTeam: 'Берое',
        time: '20:00',
        date: '2024-03-21'
    }
];

// Функция за показване на мачовете
function displayMatches(matches) {
    matchesContainer.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-time">${match.time}</div>
            <div class="match-teams">
                <span class="home-team">${match.homeTeam}</span>
                <span class="vs">vs</span>
                <span class="away-team">${match.awayTeam}</span>
            </div>
            <div class="betting-options">
                <button class="bet-btn" data-match="${match.id}" data-bet="1">1</button>
                <button class="bet-btn" data-match="${match.id}" data-bet="X">X</button>
                <button class="bet-btn" data-match="${match.id}" data-bet="2">2</button>
            </div>
        </div>
    `).join('');

    // Добавяме стилове за картите с мачове
    const style = document.createElement('style');
    style.textContent = `
        .match-card {
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .match-time {
            color: var(--primary-color);
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .match-teams {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .vs {
            color: #666;
        }

        .betting-options {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
        }

        .bet-btn {
            padding: 0.5rem 1rem;
            border: 1px solid var(--primary-color);
            border-radius: 0.25rem;
            background: white;
            color: var(--primary-color);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .bet-btn:hover {
            background: var(--primary-color);
            color: white;
        }

        .bet-btn.selected {
            background: var(--primary-color);
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Показваме примерните мачове
displayMatches(sampleMatches);

// Добавяме функционалност за избор на залог
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('bet-btn')) {
        const matchId = e.target.dataset.match;
        const betValue = e.target.dataset.bet;
        
        // Премахваме селекцията от другите бутони за същия мач
        const matchButtons = document.querySelectorAll(`.bet-btn[data-match="${matchId}"]`);
        matchButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Добавяме селекция на избрания бутон
        e.target.classList.add('selected');
        
        // Тук ще добавим логика за запазване на залога
        console.log(`Избран залог: Мач ${matchId}, Залог ${betValue}`);
    }
}); 
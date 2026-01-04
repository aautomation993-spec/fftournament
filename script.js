// Discord Webhook URLs
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1436715123552288810/CjpWjgxmjmm0IXG_X2fZ6DCQTStinRLce3JmmF1W0qh0-31mDMGWTlWxammbs5xg4mUP";
const CONTACT_WEBHOOK_URL = "https://discord.com/api/webhooks/1457401734191386677/QV6GTlo5ReXB4JghBZhV4W8KFqwcO5Sgoou_YXXzaS7nLTnL8tgsnv0AXiW98m-uIE2P";



// Tournament Data (Simulated)
const tournaments = [
    { name: "Summer Dhamaka", date: "2023-08-15T18:00:00", prize: "NRS 1,00,000", entry: "NRS 200" },
    { name: "Winter Dhamaka", date: "2023-12-01T20:00:00", prize: "NRS 1,00,000", entry: "NRS 200" },
    { name: "Spring Dhamaka", date: "2024-03-20T19:00:00", prize: "NRS 1,00,000", entry: "NRS 200" }
];

// Leaderboard Data (Simulated, in real app fetch from Discord)
const leaderboard = [
    { rank: 1, player: "rajeeb", kills: 150, WON:10000 },
    { rank: 2, player: "kailash", kills: 140, WON:5000 },
    { rank: 3, player: "bimash", kills: 135, WON:1500 },
    { rank: 4, player: "kaleychor", kills: 130, WON:600 },
    { rank: 5, player: "gore harami", kills: 125, WON:230 }
];

// Populate Tournament Cards
function populateTournaments() {
    const container = document.querySelector('.tournament-cards');
    tournaments.forEach(tournament => {
        const card = document.createElement('div');
        card.className = 'tournament-card';
        card.innerHTML = `
            <h3>${tournament.name}</h3>
            <p>Date: ${new Date(tournament.date).toLocaleDateString()}</p>
            <p>Prize Pool: ${tournament.prize}</p>
            <p>Entry Fee: ${tournament.entry}</p>
            <div class="countdown" data-date="${tournament.date}"></div>
        `;
        container.appendChild(card);
    });
    startCountdowns();
}

// Countdown Timer
function startCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        const targetDate = new Date(element.dataset.date).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                element.innerHTML = "Tournament Started!";
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });
}

// Populate Leaderboard
function populateLeaderboard() {
    const tbody = document.querySelector('#leaderboard-table tbody');
    leaderboard.forEach(player => {
        const row = document.createElement('tr');
        if (player.rank <= 3) row.className = 'top-3';
        row.innerHTML = `
            <td>${player.rank}</td>
            <td>${player.player}</td>
            <td>${player.kills}</td>
            <td>${player.WON}</td>
        `;
        tbody.appendChild(row);
    });
}

// Form Validation and Submission
const registrationForm = document.getElementById('registration-form');
registrationForm.addEventListener('submit', handleRegistration);

async function handleRegistration(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!validateForm(data)) return;

    // Play send sound
    const sendSound = document.getElementById('send-sound');
    sendSound.play();

    // Send to Discord instantly
    try {
        await sendToDiscord(data);
        // Show success popup with green tick
        showSuccessPopup();
        e.target.reset();
    } catch (error) {
        console.error("Error sending to Discord:", error);
        showPopup("Registration failed. Please try again or contact support.");
    }
}

function validateForm(data) {
    const errors = [];
    if (!data.name) errors.push("Name is required");
    if (!data['player-id']) errors.push("Player ID is required");
    if (!data['team-name']) errors.push("Team Name is required");
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) errors.push("Valid email is required");
    if (!data.phone) errors.push("Phone is required");

    const errorDiv = document.getElementById('form-errors');
    if (errors.length > 0) {
        errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        return false;
    }
    errorDiv.innerHTML = '';
    return true;
}

function sendToDiscord(data) {
    const embed = {
        title: "New Tournament Registration",
        color: 0xff0000, // Red color for RGB border
        description: `**Name:** ${data.name}\n**Player ID:** ${data['player-id']}\n**Team Name:** ${data['team-name']}\n**Email:** ${data.email}\n**Phone:** ${data.phone}`,
        timestamp: new Date().toISOString()
    };
    fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(error => console.error("Error sending to Discord:", error));
}

function sendContactToDiscord(data) {
    const embed = {
        title: "New Contact Message",
        color: 0x00ff00, // Green color
        description: `**Name:** ${data.name}\n**Phone:** ${data.phone}\n**Message:** ${data.message}`,
        timestamp: new Date().toISOString()
    };
    fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(error => console.error("Error sending contact to Discord:", error));
}

// Contact Form
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', handleContact);

async function handleContact(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.phone || !data.message) {
        alert("Please fill all fields");
        return;
    }

    // Play send sound
    const sendSound = document.getElementById('send-sound');
    sendSound.play();

    // Send to Discord
    try {
        await sendContactToDiscord(data);
        // Show success popup with green tick
        showContactSuccessPopup();
        e.target.reset();
    } catch (error) {
        console.error("Error sending to Discord:", error);
        showPopup("Message failed to send. Please try again.");
    }
}

// Popup Management
function showPopup(message) {
    const popup = document.getElementById('notification-popup');
    document.getElementById('popup-message').textContent = message;
    popup.style.display = 'block';
}

function showSuccessPopup() {
    const popup = document.getElementById('notification-popup');
    document.getElementById('popup-message').innerHTML = '<div style="background-color: #90EE90; padding: 10px; border-radius: 5px;"><span style="color: white; font-size: 2rem;">✓</span> Success</div>';
    popup.style.display = 'block';
}

function showContactSuccessPopup() {
    const popup = document.getElementById('notification-popup');
    document.getElementById('popup-message').innerHTML = '<div style="background-color: #90EE90; padding: 10px; border-radius: 5px;"><span style="color: white; font-size: 2rem;">✓</span> Success</div>';
    popup.style.display = 'block';
}

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('notification-popup').style.display = 'none';
});

// Theme Customizer (Basic implementation)
function applyTheme(theme) {
    document.body.className = theme;
}

// Scroll functions
function scrollToRegister() {
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTournaments() {
    document.getElementById('tournaments').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateTournaments();
    populateLeaderboard();
});

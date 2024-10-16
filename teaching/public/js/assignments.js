document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    fetch(`https://0d97-118-167-198-53.ngrok-free.app/assignments?user=${username}`)  // 使用本地端 URL
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('game-container');
        data.assignments.forEach(game => {
            const div = document.createElement('div');
            div.className = 'game-box';
            div.innerHTML = `
                <h2>${game.title}</h2>
                <p>${game.description}</p>
                <button onclick="startGame(${game.id}, '${username}')">開始遊戲</button>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('logout-button').addEventListener('click', function() {
        if (confirm('您確定要登出嗎？')) {
            window.location.href = '/';
        }
    });
});

function startGame(gameId, username) {
    if (gameId === 1) {
        window.location.href = `game1.html?user=${username}`;
    } else {
        alert(`開始遊戲 ${gameId}`);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    fetch('https://0d97-118-167-198-53.ngrok-free.app/admin/scores')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('scores-container');
        for (const user in data.scores) {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-scores';
            userDiv.innerHTML = `<h3>使用者 ${user}</h3>`;
            data.scores[user].forEach(score => {
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'score';
                scoreDiv.textContent = `遊戲 ${score.gameId}: ${score.score} 分`;
                userDiv.appendChild(scoreDiv);
            });
            container.appendChild(userDiv);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('logout-button').addEventListener('click', function() {
        if (confirm('您確定要登出嗎？')) {
            window.location.href = '/';
        }
    });

    document.getElementById('assign-game-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const gameId = parseInt(document.getElementById('game-id').value);

        fetch('http://localhost:8000/admin/assign-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, gameId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('遊戲指派成功');
            } else {
                alert('遊戲指派失敗');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://0d97-118-167-198-53.ngrok-free.app/login', {  // 使用本地端 URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 登入成功，根據使用者類型跳轉到相應頁面
            if (username === 'admin') {
                window.location.href = '/html/admin.html';
            } else {
                window.location.href = `/html/assignments.html?user=${username}`;
            }
        } else {
            document.getElementById('error-message').textContent = '登入失敗，請檢查您的使用者名稱和密碼。';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = '發生錯誤，請稍後再試。';
    });
});
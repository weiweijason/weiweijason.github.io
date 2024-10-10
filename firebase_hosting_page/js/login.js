const auth = firebase.auth();

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('登入成功');
            window.location.href = 'mathgame_index.html';
        })
        .catch((error) => {
            alert('登入失敗: ' + error.message);
        });
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('註冊成功');
            window.location.href = 'mathgame_index.html';
        })
        .catch((error) => {
            alert('註冊失敗: ' + error.message);
        });
}
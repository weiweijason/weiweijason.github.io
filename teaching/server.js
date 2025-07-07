const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 8000;

const users = {
    '001': '0000000',
    '002': '0000000',
    'admin': 'admin0000'
};

const assignments = {
    '001': [
        { id: 1, title: '遊戲 1', description: '9X9乘法遊戲' }
    ],
    '002': [
        { id: 1, title: '遊戲 1', description: '9X9乘法遊戲' },
        { id: 2, title: '遊戲 2', description: '挑戰乘法' },
        { id: 3, title: '遊戲 3', description: '數學謎題' }
    ]
};

const scores = {
    '001': [],
    '002': [],
    'admin': []
};

app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/assignments', (req, res) => {
    const username = req.query.user;
    if (username && assignments[username]) {
        res.json({ assignments: assignments[username] });
    } else {
        res.status(401).json({ error: '未授權' });
    }
});

app.post('/submit-score', (req, res) => {
    const { username, gameId, score } = req.body;
    if (username && scores[username]) {
        scores[username].push({ gameId, score });
        res.json({ success: true });
    } else {
        res.status(400).json({ error: '無效的使用者' });
    }
});

app.get('/admin/scores', (req, res) => {
    if (req.session.user === 'admin') {
        res.json({ scores });
    } else {
        res.status(401).json({ error: '未授權' });
    }
});

app.post('/admin/assign-game', (req, res) => {
    const { username, gameId } = req.body;
    if (req.session.user === 'admin') {
        if (users[username]) {
            if (!assignments[username]) {
                assignments[username] = [];
            }
            assignments[username].push({ id: gameId, title: `遊戲 ${gameId}`, description: `遊戲 ${gameId} 描述` });
            res.json({ success: true });
        } else {
            res.status(400).json({ error: '無效的使用者' });
        }
    } else {
        res.status(401).json({ error: '未授權' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`伺服器正在 http://localhost:${PORT} 運行`);
});
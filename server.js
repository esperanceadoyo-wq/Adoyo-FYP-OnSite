const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/signup', (req, res) => {
  const name = req.body.full_name || 'User';
  res.redirect('/onboarding.html?name=' + encodeURIComponent(name));
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

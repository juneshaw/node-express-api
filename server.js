const express = require('express');
const app = express();

console.log('process env: ', process.env);
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.get('/', (req, res) => {
    res.send('Hello from API!');
});

app.get('/error', (req, res) => {
    res.send('Error from API!');
});

// Listen for requests on environment port if specified, or 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
})
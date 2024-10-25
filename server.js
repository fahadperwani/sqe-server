const app = require('./app'); // Import the app
const { PORT } = require('./config');

// Listen to the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

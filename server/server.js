const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();



// Middleware
const corsOptions = {
    origin: "http://localhost:3000" // frontend URI (ReactJS)
};
app.use(express.json());
app.use(cors(corsOptions));

// Routes
//Unknown for now

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`App is Listening on PORT ${PORT}`));

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});
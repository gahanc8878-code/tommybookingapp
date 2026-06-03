import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database functions
//import { getAdmin } from './database.js';
//import { getTickets, getTicket, createTicket, deleteTicket, closeTicket, saveResolvedTicket, getResolvedTickets } from './database.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "staticfiles" directory
app.use(express.static(path.join(__dirname, 'staticfiles')));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'staticfiles/html/', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'staticfiles/html/', 'about.html'));
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
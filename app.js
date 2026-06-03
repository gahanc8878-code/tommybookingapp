import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBookingsByDate, createBooking, isSlotOverlapping, getAllBookings, deleteBooking } from './database.js';

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

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'staticfiles/html/', 'booking.html'));
});

// Get bookings for a specific date
app.get('/api/bookings/:date', async (req, res) => {
    try {
        const bookings = await getBookingsByDate(req.params.date);
        res.json(bookings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { date, start_time, end_time, name } = req.body;

        if (!date || !start_time || !end_time || !name) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        if (end_time <= start_time) {
            return res.status(400).json({ error: 'End time must be after start time' });
        }

        const overlapping = await isSlotOverlapping(date, start_time, end_time);
        if (overlapping) {
            return res.status(400).json({ error: 'Tommy is already booked during that time' });
        }

        await createBooking(date, start_time, end_time, name);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Delete a booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await deleteBooking(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Wrong password' });
    }
});

// Get all bookings (admin)
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
});

// Admin page
app.get('/tommy', (req, res) => {
    res.sendFile(path.join(__dirname, 'staticfiles/html/', 'admin.html'));
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
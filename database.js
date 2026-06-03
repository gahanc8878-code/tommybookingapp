import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

export async function getBookingsByDate(date) {
    const [rows] = await pool.query(
        'SELECT * FROM bookings WHERE date = ? ORDER BY start_time',
        [date]
    );
    return rows;
}

export async function createBooking(date, start_time, end_time, name) {
    const [result] = await pool.query(
        'INSERT INTO bookings (date, start_time, end_time, name) VALUES (?, ?, ?, ?)',
        [date, start_time, end_time, name]
    );
    return result;
}

export async function isSlotOverlapping(date, start_time, end_time) {
    const [rows] = await pool.query(
        'SELECT id FROM bookings WHERE date = ? AND start_time < ? AND end_time > ?',
        [date, end_time, start_time]
    );
    return rows.length > 0;
}

export async function deleteBooking(id) {
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
}

export async function getAllBookings() {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY date, start_time');
    return rows;
}
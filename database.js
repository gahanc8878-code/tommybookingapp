import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

export async function getBookings() {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY date, time');
    return rows;
}

export async function createBooking(name, reason, date, time) {
    const [result] = await pool.query(
        'INSERT INTO bookings (name, reason, date, time) VALUES (?, ?, ?, ?)',
        [name, reason, date, time]
    );
    return result;
}

export async function isSlotTaken(date, time) {
    const [rows] = await pool.query(
        'SELECT id FROM bookings WHERE date = ? AND time = ?',
        [date, time]
    );
    return rows.length > 0;
}

export async function deleteBooking(id) {
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
}
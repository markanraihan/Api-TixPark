const express = require('express');
require('dotenv').config()

const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`server berhasil berjalan di port ${PORT}`);
})
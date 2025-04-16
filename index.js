const express = require('express');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
    res.send('halo dunia');
});

app.listen(PORT, () => {
    console.log(`server berhasil berjalan di port ${PORT}`);
})
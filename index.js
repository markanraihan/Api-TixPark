const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
    res.send('halo dunia');
});

app.listen(PORT, () => {
    console.log(`server berhasil running di port ${PORT}`);
})
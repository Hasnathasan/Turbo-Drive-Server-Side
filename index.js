const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middlewars
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
    res.send("Toy Marketplace Server is Running");
})


app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
})
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();


const cors = require('cors')
// app.use(cors());

const corsOptions = { 
 
  AccessControlAllowOrigin: '*',  
  origin: '*',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}
app.use(cors(corsOptions))

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.use('/api/auth', authRoutes);


app.get("/", (req, res) => {
    res.send("✅ Backend is alive!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

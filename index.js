import express from "express";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors middleware

const app = express();

const mongo_username = 'arbcsoutherncal'
const mongo_password = 'losososnumber1'
const uri = `mongodb+srv://arbcsoutherncal:${mongo_password}@registration.axuxdls.mongodb.net/?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a MongoDB schema and model
const memberSchema = new mongoose.Schema({
  schoolName: String,
  firstName: String,
  lastName: String,
  grade: String,
  email: String,
  password: String,
  city: String,
});

const Member = mongoose.model("Member", memberSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "https://backend-dtjy.vercel.app/", // Replace with your front-end domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use the cors middleware with the specified options
// Serve static files (e.g., HTML forms)
app.use(express.static("public"));

// Route to handle the form submission
app.post("/new", (req, res) => {
  const {
    schoolName,
    firstName,
    lastName,
    grade,
    email,
    password,
    city,
  } = req.body;

  // Create a new member document
  const newMember = new Member({
    schoolName,
    firstName,
    lastName,
    grade,
    email,
    password,
    city,
  });

  // Save the member document to the database
  newMember.save((err) => {
    if (err) {
      res.status(500).send("Error saving member");
    } else {
      res.status(200).send("Member created successfully");
    }
  });
});


const port = 9000
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
import express from "express";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors middleware
import bcrypt from "bcrypt";

const app = express();

const mongo_username = 'arbcsoutherncal'
const mongo_password = 'losososnumber1'
const salt_rounds = 10;

bcrypt.hash(mongo_password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
  });


const uri = `mongodb+srv://arbcsoutherncal:${hashedPassword}@registration.axuxdls.mongodb.net/?retryWrites=true&w=majority`;

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
  phone: String,
});

const Member = mongoose.model("Member", memberSchema);

const corsOptions = {
  origin: "*", // Replace with your front-end domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use the cors middleware with the specified options
// Serve static files (e.g., HTML forms)
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.post("/new", async (req, res) => {
    const { schoolName, firstName, lastName, grade, email, password, city, phone } =
        req.body;

    // Create a new member document
    const newMember = new Member({
        schoolName,
        firstName,
        lastName,
        grade,
        email,
        password,
        city,
        phone,
    });

    // Save the member document to the database
    //   newMember.save((err) => {
    //     if (err) {
    //       res.status(500).send("Error saving member");
    //     } else {
    //       res.status(200).send("Member created successfully");
    //     }
    //   });
    try {
        await newMember.save();
        res.status(200).send("Member created successfully");
    } catch (err) {
        res.status(500).send("Error saving member");
    }
});


const port = 9000
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

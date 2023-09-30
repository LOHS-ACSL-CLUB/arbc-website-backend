import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors middleware
import "dotenv/config";

const app = express();

const uri = `mongodb+srv://arbcsoutherncal:${process.env.MONGO_PASSWORD}@registration.axuxdls.mongodb.net/?retryWrites=true&w=majority`;

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
    email: {
        type: String,
        unique: true,
    },
    password: String,
    city: String,
    phone: {
        type: String,
        unique: true,
    }
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
    const {
        schoolName,
        firstName,
        lastName,
        grade,
        email,
        password,
        city,
        phone,
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
        phone,
    });

    // Save the member document to the database
    try {
        await newMember.save();
        res.status(200).send("Member created successfully");
        console.log("Request handled successfully");
    } catch (err) {
        if (err.code === 11000 && (err.keyPattern.email) {
            res.status(400).send("Email address already used.");
        }
        else if (err.code === 11000 && (err.keyPattern.phone)) {
            res.status(400).send("Phone number already used.");
        } 
        else {
            res.status(500).send("Error saving member");
        }
    }
});

//team registering
const teamSchema = new mongoose.Schema({
    teamName:{
        type: String,
        unique: true,
    },
    pointOfContactEmail:{
        type: String,
        unique: true,
    },
    pointOfContactPhone:{
        type: String,
        unique: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
        },
    ],
});

const Team = mongoose.model("Team", teamSchema);

app.post("/team", async (req, res) => {
    const { teamName, pointOfContactEmail, pointOfContactPhone, memberEmails } = req.body;

    // Find member documents by email
    const members = await Member.find({ email: { $in: memberEmails } });

    if (members.length < 1 || members.length > 4) {
        res.status(400).send("Invalid number of members. A team must have 1 to 4 members.");
    } else {
        const newTeam = new Team({
            teamName,
            pointOfContactEmail,
            pointOfContactPhone,
            members: members.map((member) => member._id),
        });

        try {
            await newTeam.save();
            res.status(200).send("Team created successfully");
        } catch (err) {
            if (err.code === 11000 && (err.keyPattern.teamName) {
                res.status(400).send("Team name already exist.");
            }
            else if (err.code === 11000 && (err.keyPattern.pointOfContactEmail) {
                res.status(400).send("Point of Contact Email already used.");
            }
            else if (err.code === 11000 && (err.keyPattern.pointOfContactPhone) {
                res.status(400).send("Point of Contact Number already used.");
            }
            else {
                res.status(500).send("Error saving member");
            }
        }
    }
});

const port = 9000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

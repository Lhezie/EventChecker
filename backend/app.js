import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "node-cron";
import nodemailer from "nodemailer";
import User from "./src/models/User.js";
import { body, validationResult } from "express-validator";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/send-test-email", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Recipient email (to) is required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'gmail' if using Gmail
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject: "🎉 Test Email from Birthday App",
      text: `Hi there! This is a test email sent from your backend setup.`,
      html: `<p><strong>Hi there!</strong></p><p>This is a <em>test email</em> sent from your <code>/send-test-email</code> route.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Test email sent to ${to}` });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ error: "Failed to send test email" });
  }
});


// Add a new user
app.post(
  "/add-user",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("dob")
      .notEmpty()
      .withMessage("Date of birth is required")
      .custom((value) => {
        const inputDate = new Date(value);
        const today = new Date();
        if (inputDate > today) {
          throw new Error("DOB cannot be in the future");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, dob } = req.body;

    try {
      const user = new User({ username, email, dob: new Date(dob) });
      await user.save();
      res.status(201).json({ message: "User added successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add user" });
    }
  }
);
// Cron job to send birthday emails
cron.schedule("0 7 * * *", async () => {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  try {
    const users = await User.find();
    const birthdayUsers = users.filter((user) => {
      const dob = new Date(user.dob);
      return dob.getMonth() === month && dob.getDate() === day;
    });

    if (birthdayUsers.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      for (const user of birthdayUsers) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: `Happy Birthday 🎉 , ${user.username}! 🎂`,
          text: `
      Hey ${user.username},
      
      I am Wishing you the happiest of birthdays today!
      
      May your day be filled with laughter, love, and everything that makes you smile. I am so grateful to have you in my corner and hope this year brings you closer to your dreams.
      
      Celebrate big!!  You deserve it Love!!
      
      Lots of Love && hugs, 
      Lhezie 
      
          `,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #e63946;">🎉 Happy Birthday 🎉 , ${user.username}! 🎂</h2>
              <p>
                 I am Wishing you the happiest of birthdays today!
              <p>
               May your day be filled with laughter, love, and everything that makes you smile. I am so grateful to have you in my corner and hope this year brings you closer to your dreams.
      
              </p>
              <p>
                Celebrate big!!  You deserve it Love!!
              </p>
              <p style="margin-top: 30px;">Cheers to more life, more laughter, and more cake!</p>
              <p>— Lhezie</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
      }
    }
  } catch (err) {
    console.error("Error sending birthday emails:", err);
  }
});

export default app;

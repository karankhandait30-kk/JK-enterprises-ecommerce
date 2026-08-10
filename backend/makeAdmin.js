const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const user = await User.findOneAndUpdate(
      { email: "Karankhandait40@gmail.com" },
      { isAdmin: true },
      { new: true }
    ).select("-password");

    if (!user) {
      console.log("User not found.");
      process.exit(1);
    }

    console.log("Admin created successfully!");
    console.log({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    process.exit(0);

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
const path = require("path");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");
const dns = require("dns");
const mongoose = require("mongoose");
const User = require("./models/user");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});

async function resetPassword() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable missing");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected.");

    const email = (await rl.question("Enter your registered email: "))
      .trim()
      .toLowerCase();
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with that email.");
      return;
    }

    const password = await rl.question(
      "Enter your NEW password (minimum 8 characters): "
    );
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // The model hashes the password and requires its confirmation on save.
    user.password = password;
    user.passwordConfirm = password;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    console.log("Password reset successful. You can now log in.");
  } finally {
    rl.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

resetPassword().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exitCode = 1;
});

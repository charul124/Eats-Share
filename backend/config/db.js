const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red.underline.bold(`Error: ${error.message}`));
    console.error(error); // Detailed logging for better debugging
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = { connectDB };

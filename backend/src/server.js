const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://akhileshreddy811_db_user:6MQywIJtJR8oLeCo@cluster0.t0i7d7t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const startServer = async () => {
  // Connect to Database
  await connectDatabase();

  // Listen for requests
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("🔐 MONGODB_URI:", MONGODB_URI);
  });
};

startServer();

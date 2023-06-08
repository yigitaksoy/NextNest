require("dotenv").config();
const admin = require("firebase-admin");
const { serviceAccount, firebaseConfig } = require("./firebaseConfig.js");

let initialized = false;
let appInstance = null;

const connectToDatabase = async () => {
  try {
    if (!initialized) {
      if (!admin.apps.length) {
        // Parse the private key as an object
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        );

        // Initialize Firebase Admin SDK and store the app instance
        appInstance = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: firebaseConfig.databaseURL,
        });
      }

      initialized = true;
    }

    return admin.apps.length ? admin.app() : appInstance; // Return the admin instance
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = {
  connectToDatabase,
};

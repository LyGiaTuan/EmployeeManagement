const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../../firebaseKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore(app);

module.exports = db;

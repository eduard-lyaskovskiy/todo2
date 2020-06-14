const admin = require("firebase-admin");
// const serviceAccount = require("../../key/todos2-3506e-firebase-adminsdk-l0o16-abb2f86368.json");
admin.initializeApp();
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://todos2-3506e.firebaseio.com",
// });
const db = admin.firestore();

module.exports = { admin, db };

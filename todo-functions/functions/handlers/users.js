const { db, admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
const { validateSignupData, validateLoginData, reduceUserDetails } = require("../util/validations");

firebase.initializeApp(config);

//REGISTER
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        user: req.body.user,
    };

    // validate data
    const { valid, errors } = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors);
    }
    // validate data end
    const noImg = "no-img.png";

    let tokenId, userId;
    db.doc(`/users/${newUser.user}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ user: "this username is already taken" });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((token) => {
            tokenId = token;
            const userCredentials = {
                user: newUser.user,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId,
            };
            db.doc(`users/${newUser.user}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ tokenId });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({ user: "email is already use" });
            } else {
                res.status(500).json({ general: "Something went wrong please try again" });
            }
        });
};

// LOGIN
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    // validate data
    const { valid, errors } = validateLoginData(user);

    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({ general: "Wrong credentials please try again" });
            } else {
                return res.status(500).json({ general: "Something went wrong please try again" });
            }
        });
};

// Adding user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.user}`)
        .update(userDetails)
        .then(() => {
            return res.json({ message: "Details updated!" });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};
// Get any user details

exports.getUserFetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.user}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection("todos").where("user", "==", req.params.user).orderBy("createdAt", "desc").get();
            } else {
                return res.status(404).json({ error: "User not found!" });
            }
        })
        .then((data) => {
            userData.todos = [];
            data.forEach((doc) => {
                userData.todos.push({
                    title: doc.data().title,
                    createdAt: doc.data().createdAt,
                    user: doc.data().user,
                    userImage: doc.data().userImage,
                    commentCount: doc.data().commentCount,
                    todoId: doc.id,
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`users/${req.user.user}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
            }
        })
        .then((data) => {
            return db.collection("notifications").where("recipient", "==", req.user.user).orderBy("createdAt", "desc").limit(10).get();
        })
        .then((data) => {
            userData.notifications = [];
            data.forEach((doc) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    read: doc.data().read,
                    todoId: doc.data().todoId,
                    type: doc.data().type,
                    createdAt: doc.data().createdAt,
                    notificationsId: doc.id,
                });
                return res.json({ userData });
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// UPLOAD PROFILE IMAGE
exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({ headers: req.headers });
    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type" });
        }
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        admin
            .storage()
            .bucket(`${config.storageBucket}`)
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contenttype: imageToBeUploaded.mimetype,
                    },
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.user}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: "Image uploaded!" });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: err.code });
            });
    });
    busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
    const batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch
        .commit()
        .then(() => {
            return res.json({ message: "Notifictaions marked read" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");
const { getAllTodos, addTodo, getTodo, commentOnTodo, deleteTodo } = require("./handlers/todos");
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserFetails, markNotificationsRead } = require("./handlers/users");

// TODOS ROUTE
app.get("/todos", getAllTodos);
app.post("/todo", FBAuth, addTodo);
app.get("/todo/:todoId", getTodo);
app.delete("/todo/:todoId", FBAuth, deleteTodo);
app.post("/todo/:todoId/comment", FBAuth, commentOnTodo);

//USER ROUTE
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:user", getUserFetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region("europe-west3").https.onRequest(app);

exports.createNotificationOnComment = functions
    .region("europe-west3")
    .firestore.document("comments/{id}")
    .onCreate((snapshot) => {
        return db
            .doc(`todos/${snapshot.data().todoId}`)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().user,
                        sender: snapshot.data().user,
                        type: "comment",
                        read: false,
                        todoId: doc.id,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

exports.createNotificationOnDoneTodo = functions
    .region("europe-west3")
    .firestore.document("todos/{todoId}")
    .onDelete((snapshot, context) => {
        const todoId = context.params.todoId;
        return db
            .doc(`todos/${todoId}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: snapshot.data().user,
                        sender: snapshot.data().user,
                        type: "done",
                        read: false,
                        todoId: doc.id,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

exports.createNotificationOnAddTodo = functions
    .region("europe-west3")
    .firestore.document("todos/{todoId}")
    .onCreate((snapshot, context) => {
        const todoId = context.params.todoId;
        return db
            .doc(`todos/${todoId}`)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().user,
                        sender: snapshot.data().user,
                        type: "add",
                        read: false,
                        todoId: doc.id,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

exports.onUserImageChange = functions
    .region("europe-west3")
    .firestore.document("users/{userId}")
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            return db
                .collection("todos")
                .where("user", "==", change.before.data().user)
                .ger()
                .then((data) => {
                    data.forEach((doc) => {
                        const todo = db.doc(`/todos/${doc.id}`);
                        batch.update(todo, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                });
        }
    });

exports.onTodoDeleted = functions
    .region("europe-west3")
    .firestore.document("todos/{todoId}")
    .onDelete((snap, context) => {
        const todoId = context.params.todoId;
        const batch = db.batch();
        return db
            .collection("comments")
            .where("todoId", "==", todoId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => {
                console.error(err);
            });
    });

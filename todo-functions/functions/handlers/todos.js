const { db } = require("../util/admin");

exports.getAllTodos = (req, res) => {
    console.log("START");
    db.collection("todos")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let todos = [];
            data.forEach((doc) => {
                todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
                    userUser: doc.data().userUser,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    userImage: doc.data().userImage,
                });
            });
            return res.json(todos);
        })
        .catch((err) => console.error(err));
};

exports.addTodo = (req, res) => {
    if (req.body.title.trim() === "") {
        return res.status(400).json({ title: "Must not be empty" });
    }
    const newTodo = {
        title: req.body.title,
        userUser: req.user.user,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        commentCount: 0,
    };

    db.collection("todos")
        .add(newTodo)
        .then((doc) => {
            const resTodo = newTodo;
            resTodo.todoId = doc.id;
            res.json(resTodo);
        })
        .catch((err) => {
            res.status(500).json({ message: `something went wrong` });
            console.error(err);
        });
};

exports.getTodo = (req, res) => {
    console.log("START");
    let todoData = {};
    db.doc(`/todos/${req.params.todoId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Todo not found!" });
            }
            todoData = doc.data();
            todoData.todoId = doc.id;
            return db.collection("comments").orderBy("createdAt", "desc").where("todoId", "==", req.params.todoId).get();
        })
        .then((data) => {
            todoData.comments = [];
            data.forEach((doc) => {
                todoData.comments.push(doc.data());
            });
            return res.json(todoData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.commentOnTodo = (req, res) => {
    if (req.body.body.trim() === "") {
        return res.status(400).json({ comment: "Must not be empty" });
    }

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        todoId: req.params.todoId,
        userUser: req.user.user,
        userImage: req.user.imageUrl,
    };

    db.doc(`/todos/${req.params.todoId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Todo not found!" });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection("comments").add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.deleteTodo = (req, res) => {
    const document = db.doc(`/todos/${req.params.todoId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Todo not found" });
            }
            if (doc.data.user !== req.params.user) {
                return res.status(403).json({ error: "Permission denied" });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return res.json({ message: "todo deleted " });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

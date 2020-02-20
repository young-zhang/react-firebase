import * as functions from "firebase-functions";
import * as express from "express";
import {getAllScreams, postOneScream, getScream, likeScream, unlikeScream, commentOnScream, deleteScream} from "./handlers/screams";
import {login, signup, addUserDetails, getAuthenticatedUser, uploadImage, getUserDetails, markNotificationsRead} from "./handlers/users";
import fbAuth from "./util/fbAuth";
import {db} from "./util/admin";
import {Notification, Comment} from "./types"

const app = express();

// Scream routes
app.get("/screams", getAllScreams);
app.post("/scream", fbAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", fbAuth, deleteScream);
app.get("/scream/:screamId/like", fbAuth, likeScream);
app.get("/scream/:screamId/unlike", fbAuth, unlikeScream);
app.post("/scream/:screamId/comment", fbAuth, commentOnScream);

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", fbAuth, uploadImage);
app.post("/user", fbAuth, addUserDetails);
app.get("/user", fbAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", fbAuth, markNotificationsRead);

exports.api = functions //.region("us-east4") // North VA
    .https.onRequest(app);

exports.createNotificationOnLike = functions //.region("us-east4") // North VA
    .firestore
    .document("likes/{likeId}")
    .onCreate((like, context) => {
        // const {likeId} = context.params;
        const {screamId} = like.data();
        return db.doc(`/screams/${screamId}`)
            .get()
            .then(scream => {
                if (scream.exists && scream.data().userHandle !== like.data().userHandle) {
                    const recipient = scream.data().userHandle;
                    const sender = like.data().userHandle;
                    // console.log(`.then(scream => // ${sender}!==${recipient}`);
                    let notification: Notification = {
                        createdAt: new Date(),
                        recipient,
                        sender,
                        type: "like",
                        read: false,
                        screamId: scream.id
                    };
                    return db
                        .doc(`/notifications/${like.id}`)
                        .set(notification)
                        // .then(() => console.log(`Wrote: /notifications/${like.id} successfully!`))
                        .catch((err) => console.error(err));
                }
                return null;
            })
            //.then(() => console.log(".onCreate() finished"))
            .catch((err) => console.error(err));
    });

exports.deleteNotificationOnUnLike = functions //.region("us-east4") // North VA
    .firestore
    .document('likes/{likeId}')
    .onDelete((like, context) => {
        //const {likeId} = context.params;
        return db
            .doc(`/notifications/${like.id}`)
            .delete()
            //.then(() => console.log(".onDelete() finished"))
            .catch((err) => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions //.region("us-east4") // North VA
    .firestore
    .document("comments/{id}")
    .onCreate((comment, context) => {
        const {screamId} = comment.data();
        return db.doc(`/screams/${screamId}`)
            .get()
            .then(scream => {
                if (scream.exists && scream.data().userHandle !== comment.data().userHandle) {
                    const recipient = scream.data().userHandle;
                    const sender = comment.data().userHandle;
                    let notification: Notification = {
                        createdAt: new Date(),
                        recipient,
                        sender,
                        type: 'comment',
                        read: false,
                        screamId: scream.id
                    };
                    return db.doc(`/notifications/${comment.id}`)
                        .set(notification);
                }
                return null;
            })
            //.then(() => console.log(".onCreate() for comment finished"))
            .catch((err) => console.error(err));
    });
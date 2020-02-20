import * as functions from "firebase-functions";
import * as express from "express";
import {getAllScreams, postOneScream, getScream, likeScream, unlikeScream, commentOnScream, deleteScream} from "./handlers/screams";
import {login, signup, addUserDetails, getAuthenticatedUser, uploadImage} from "./handlers/users";
import fbAuth from "./util/fbAuth";

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

exports.api = functions //.region("us-east4") // North VA
    .https.onRequest(app);
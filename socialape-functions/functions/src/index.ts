import * as functions from 'firebase-functions';
import * as express from 'express';
import {getAllScreams, postOneScream} from "./handlers/screams";
import {login, signup, uploadImage} from "./handlers/users";
import fbAuth from "./util/fbAuth";

const app = express();

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', fbAuth, postOneScream);

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);

exports.api = functions //.region('us-east4') // North VA
    .https.onRequest(app);
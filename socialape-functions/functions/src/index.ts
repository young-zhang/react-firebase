import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as express from 'express';
import firebaseConfig from "./firebaseConfig";

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

const app = express();

app.get('/screams', (req, res) => {
    db.collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            const screams: any = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data() // I get to use the ... operator because TypeScript!
                });
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

app.post('/scream', (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({error: 'Method not allowed'});
    }
    else {
        const {body, userHandle} = req.body;
        const newScream = {
            body: body,
            userHandle: userHandle,
            createdAt: new Date().toISOString()
        };
        console.error(newScream);
        db.collection('screams')
            .add(newScream)
            .then(doc => {
                res.json({message: `document ${doc.id} created successfully`});
            })
            .catch(err => {
                res.status(500).json({error: 'something went wrong'});
                console.error(err);
            });
    }
});

app.post('/signup', (req, res) => {
    const {email, password, handle, confirmPassword} = req.body;

    db.doc(`/users/${handle}`).get()
        .then(doc => {
            if (doc.exists) {
                res.status(400).json({handle: 'this handle is already taken'});
                return;
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            }
        })
        .then(data => {
            if (data && data.user) {
                return data.user.getIdToken();
            }
            else {
                res.status(500).json({error: "data.user is undefined"});
                return;
            }
        })
        .then(token => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                res.status(400).json({error: 'Email is already in use.'});
            }
            else {
                res.status(500).json({error: err.code});
            }
        });
});

exports.api = functions //.region('us-east4') // North VA
    .https.onRequest(app);
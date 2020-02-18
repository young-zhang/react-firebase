import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as express from 'express';
import firebaseConfig from "../firebaseConfig";

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
const app = express();

app.get('/screams', (req, res) => {
    admin.firestore()
        .collection('screams')
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
        admin.firestore().collection('screams')
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
    const {email, password} = req.body; // , confirmPassword, handle

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
            if (data.user) {
                res.status(201).json({message: `user ${data.user.uid} signed up successfully`});
            }
            else {
                res.status(500).json({error: "data.user is not defined"});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
});

exports.api = functions //.region('us-east4') // North VA
    .https.onRequest(app);
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as express from 'express';
import firebaseConfig from "./firebaseConfig";
import DecodedIdToken = admin.auth.DecodedIdToken;
// import * as core from "express-serve-static-core";
import {Request, Response, NextFunction} from "express";

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

const app = express();

app.get('/screams', (req: Request, res: Response) => {
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

const fbAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        let idToken = req.headers.authorization.split('Bearer ')[1];
        admin.auth()
            .verifyIdToken(idToken)
            .then((decodedToken: DecodedIdToken) => {
                req.user = decodedToken;
                return db.collection('users')
                    .where('userId', '==', req.user.uid)
                    .limit(1)
                    .get();
            })
            .then(data => {
                req.user['handle'] = data.docs[0].data().handle;
                return next();
            })
            .catch(err => {
                console.error('Error while verifying token ', err);
                return res.status(403).json(err);
            });
        return;
    }
    else {
        console.error('No token found');
        return res.status(403).json({error: 'Unauthorized'});
    }
};

app.post('/scream', fbAuth, (req: Request, res: Response) => {
    if (req.method !== 'POST') {
        res.status(400).json({error: 'Method not allowed'});
    }
    else {
        const {body} = req.body;
        const newScream = {
            body: body,
            userHandle: req.user['handle'],
            createdAt: new Date() //.toISOString()
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

const isEmpty = (str: string) => {
    return (!(str && str.trim().length > 0));
};

const isEmail = (email: string) => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

interface LoginErrors {
    email?: string
    password?: string
    confirmPassword?: string
    handle?: string
}

app.post('/signup', (req: Request, res: Response) => {
    const {email, password, handle, confirmPassword} = req.body;

    let errors: LoginErrors = {};
    if (isEmpty(email)) {
        errors.email = 'Email must not be empty';
    }
    else if (!isEmail(email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(password)) errors.password = 'Password must not be empty';
    if (password !== confirmPassword) errors.confirmPassword = 'Password and confirmation must match';
    if (isEmpty(handle)) errors.handle = 'Handle must not be empty';

    if (Object.keys(errors).length > 0)
        return res.status(400).json(errors);

    let userToken: string | undefined;
    let userId: string;

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
                userId = data.user.uid;
                return data.user.getIdToken();
            }
            return;
        })
        .then(token => {
            if (token) {
                userToken = token;
                const userCredentials = {
                    handle,
                    email,
                    createdAt: new Date(), //.toISOString(),
                    userId
                };
                return db.doc(`/users/${handle}`).set(userCredentials);
            }
            return;
        })
        .then(writeResult => {
            if (writeResult) {
                return res.status(201).json({token: userToken});
            }
            return;
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
    return;
});

app.post('/login', (req: Request, res: Response) => {
    const {email, password} = req.body;

    let errors: LoginErrors = {};
    if (isEmpty(email)) errors.email = 'Email must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';

    if (Object.keys(errors).length > 0)
        return res.status(400).json(errors);

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(cred => {
            if (cred && cred.user) return cred.user.getIdToken();
            return;
        })
        .then(token => {
            if (token) return res.status(200).json({token});
            return;
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/wrong-password")
                return res.status(403).json({general: 'Wrong credentials, please try again'});
            return res.status(500).json({error: err.code});
        });
    return;
});

exports.api = functions //.region('us-east4') // North VA
    .https.onRequest(app);
import * as firebase from "firebase";
import {Request, Response} from "express";
import {db} from "../util/admin";
import {validateLoginData, validateSignupData} from "../util/validators";
import * as BusBoy from 'busboy'
import * as path from 'path';
import * as os from 'os';

export const signup = (req: Request, res: Response) => {
    const {valid, errors, handle, email, password} = validateSignupData(req);
    if (!valid) return res.status(400).json(errors);

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
};

export const login = (req: Request, res: Response) => {
    const {valid, errors, email, password} = validateLoginData(req);
    if (!valid) return res.status(400).json(errors);

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
};

export const uploadImage = (req: Request, res: Response) => {
};
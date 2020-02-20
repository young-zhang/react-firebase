import * as firebase from "firebase";
import * as admin from "firebase-admin";
import {Request, Response} from "express";
import * as BusBoy from 'busboy'
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as temp from 'temp';
import {db} from "../util/admin";
import {validateLoginData, validateSignupData, reduceUserDetails} from "../util/validators";
import firebaseConfig from "../firebaseConfig";
import Timestamp = firebase.firestore.Timestamp;

export const signup = (req: Request, res: Response) => {
    const {valid, errors, handle, email, password} = validateSignupData(req);
    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-image.png';

    let userToken: string | undefined, userId: string;
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
                    imageUrl: noImg,
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

// Add user details
export const addUserDetails = (req: Request, res: Response) => {
    let userDetails = reduceUserDetails(req);
    db.doc(`/users/${req.user.handle}`)
        .update(userDetails)
        .then(() => {
            return res.json({message: 'Details added successfully'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
};

export interface UserData {
    credentials: {
        bio?: string
        createdAt?: Timestamp | Date
        email?: string
        handle?: string
        imageUrl?: string
        location?: string
        userId?: string
        website?: string
    }
    likes: any[]
}

// get own user details
export const getAuthenticatedUser = (req: Request, res: Response) => {
    let userData: UserData = {credentials: {}, likes: []};
    db.doc(`/users/${req.user.handle}`)
        .get()
        .then(doc => {
            if (doc && doc.exists) {
                Object.assign(userData.credentials, doc.data());
                // @ts-ignore
                userData.credentials.createdAt = doc.data().createdAt.toDate();

                return db
                    .collection('likes')
                    .where('userHandle', '==', req.user.handle)
                    .get();
            }
            return;
        })
        .then(data => {
            if (data) {
                data.forEach(doc => {
                    userData.likes.push(doc.data())
                });
                return res.json(userData);
            }
            return;
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};

const getImageUrl = (filename: string) => {
    return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${filename}?alt=media`;
};

// Upload a profile image for user
export const uploadImage = (req: Request, res: Response) => {
    const busboy = new BusBoy({headers: req.headers});

    let imageToBeUploaded = {filepath: "", mimetype: ""};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            res.status(400).json({error: 'Wrong file type'});
        }
        else {
            const imageExtension = path.extname(filename);
            let filepath = temp.path({suffix: imageExtension});
            imageToBeUploaded = {filepath, mimetype};
            file.pipe(fs.createWriteStream(filepath));
        }
    });
    busboy.on('finish', () => {
        admin.storage().bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    contentType: imageToBeUploaded.mimetype,
                }
            })
            .then(r => {
                return db
                    .doc(`/users/${req.user.handle}`)
                    .update({imageUrl: path.basename(imageToBeUploaded.filepath)});
            })
            .then(wr => {
                res.json({message: 'Image uploaded successfully'});
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({error: err.code});
            });
    });
    // @ts-ignore
    busboy.end(req.rawBody);
};
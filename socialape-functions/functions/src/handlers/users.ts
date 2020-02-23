import * as firebase from "firebase";
import * as admin from "firebase-admin";
import {Request, Response} from "express";
import * as BusBoy from "busboy"
import * as path from "path";
import * as fs from "fs";
import * as temp from "temp";
import {db} from "../util/admin";
import {validateLoginData, validateSignupData, reduceUserDetails} from "../util/validators";
import firebaseConfig from "../firebaseConfig";
import {User, Notification, Scream} from "../types";

export const signup = (req: Request, res: Response) => {
    const {valid, errors, handle, email, password} = validateSignupData(req);
    if (!valid) return res.status(400).json(errors);

    const noImg = "no-image.png";

    let userToken: string | undefined, userId: string;
    db.doc(`/users/${handle}`).get()
        .then(doc => {
            if (doc.exists) {
                res.status(400).json({handle: "this handle is already taken"});
                return null;
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
            return null;
        })
        .then(token => {
            userToken = token;
            const userCredentials = {
                handle,
                email,
                createdAt: new Date(), //.toISOString(),
                imageUrl: noImg,
                userId
            };
            return db.doc(`/users/${handle}`).set(userCredentials);
        })
        .then(writeResult => {
            return res.status(201).json({token: userToken});
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                res.status(400).json({error: "Email is already in use."});
            }
            else {
                res.status(500).json({error: err.code});
            }
        });
    return null;
};

export const login = (req: Request, res: Response) => {
    const {valid, errors, email, password} = validateLoginData(req);
    if (!valid) return res.status(400).json(errors);

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(cred => {
            return cred.user.getIdToken();
        })
        .then(token => {
            res.status(200).json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/wrong-password")
                return res.status(403).json({general: "Wrong credentials, please try again"});
            return res.status(500).json({error: err.code});
        });
    return null;
};

// Add user details
export const addUserDetails = (req: Request, res: Response) => {
    let userDetails = reduceUserDetails(req);
    db.doc(`/users/${req.user.handle}`)
        .update(userDetails)
        .then(() => {
            return res.json({message: "Details added successfully"});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
};

// get any user's details
export const getUserDetails = (req: Request, res: Response) => {
    const {handle} = req.params;
    let userData: User = {credentials: {}, screams: [], likes: []};
    db.doc(`/users/${handle}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                Object.assign(userData.credentials, doc.data());
                userData.credentials.createdAt = doc.data().createdAt.toDate();
                return db.collection("screams")
                    .where("userHandle", "==", handle)
                    .orderBy("createdAt", "desc")
                    .get();
            }
            else {
                res.status(404).json({error: "User not found"});
                return null;
            }
        })
        .then(data => {
            data.forEach(doc => {
                let scream: Scream = {comments: []};
                Object.assign(scream, doc.data());
                scream.createdAt = doc.data().createdAt.toDate();
                userData.screams.push(scream);
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};

// get own user details
export const getAuthenticatedUser = (req: Request, res: Response) => {
    const {handle, imageUrl} = req.user;
    let userData: User = {credentials: {}, likes: []};
    db.doc(`/users/${req.user.handle}`)
        .get()
        .then(doc => {
            if (doc && doc.exists) {
                Object.assign(userData.credentials, doc.data());
                userData.credentials.createdAt = doc.data().createdAt.toDate();

                return db
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .get();
            }
            return null;
        })
        .then(data => {
            data.forEach(doc => userData.likes.push(doc.data()));
            return db
                .collection("notifications")
                .where("recipient", "==", handle)
                .orderBy("createdAt", "desc")
                .limit(10)
                .get();
        })
        .then(data => {
            userData.notifications = []
            data.forEach(doc => {
                let notification: Notification = {};
                notification.createdAt = doc.data().createdAt.toDate();
                notification.notificationId = doc.id;
                Object.assign(notification, doc.data());
                userData.notifications.push(notification);
            });
            return res.json(userData);
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

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            res.status(400).json({error: "Wrong file type"});
        }
        else {
            const imageExtension = path.extname(filename);
            let filepath = temp.path({suffix: imageExtension});
            imageToBeUploaded = {filepath, mimetype};
            file.pipe(fs.createWriteStream(filepath));
        }
    });
    busboy.on("finish", () => {
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
                res.json({message: "Image uploaded successfully"});
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({error: err.code});
            });
    });
    // @ts-ignore
    busboy.end(req.rawBody);
};

export const markNotificationsRead = (req: Request, res: Response) => {
    const {handle, imageUrl} = req.user;
    let batch = db.batch();
    // @ts-ignore
    req.body.forEach(notifyId => {
        const notification = db.doc(`/notifications/${notifyId}`);
        batch.update(notification, {read: true});
    });
    batch.commit()
        .then(() => {
            return res.json({message: "Notifications marked read"});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};
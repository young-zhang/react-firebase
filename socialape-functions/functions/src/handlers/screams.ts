import {Request, Response} from "express";
import {db} from "../util/admin";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {object} from "firebase-functions/lib/providers/storage";

interface Comment {
    commentId?: string
    screamId?: string
    userHandle?: string
    userImage?: string
    createdAt?: Timestamp | Date
    body?: string
}

interface Scream {
    screamId?: string
    createdAt?: Timestamp | Date
    userHandle?: string
    userImage?: string
    body?: string
    likeCount?: number
    commentCount?: number
    comments: Comment[]
}

interface Like {
    screamId?: string
    userHandle?: string
}

export const getAllScreams = (req: Request, res: Response) => {
    db.collection("screams")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            const screams: Scream[] = [];
            data.forEach(doc => {
                const {body, createdAt, userHandle, imageUrl} = doc.data();
                let scream: Scream = {
                    screamId: doc.id,
                    body,
                    createdAt: createdAt.toDate(),
                    userHandle,
                    userImage: imageUrl,
                    comments: []
                };
                screams.push(scream);
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
};

export const postOneScream = (req: Request, res: Response) => {
    if (req.method !== "POST") {
        res.status(400).json({error: "Method not allowed"});
    }
    else {
        const {handle, imageUrl} = req.user;
        const {body} = req.body;
        const newScream: Scream = {
            body: body,
            userHandle: handle,
            userImage: imageUrl,
            createdAt: new Date(),
            likeCount: 0,
            commentCount: 0,
            comments: []
        };
        console.error(newScream);
        db.collection("screams")
            .add(newScream)
            .then(doc => {
                res.json({message: `document ${doc.id} created successfully`});
            })
            .catch(err => {
                res.status(500).json({error: "something went wrong"});
                console.error(err);
            });
    }
};

export const getScream = (req: Request, res: Response) => {
    let screamData: Scream = {comments: []};
    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                Object.assign(screamData, doc.data());
                // @ts-ignore
                screamData.createdAt = doc.data().createdAt.toDate();
                screamData.screamId = doc.id;
                return db
                    .collection("comments")
                    .orderBy("createdAt", "desc") // error 9, requires an index
                    .where("screamId", "==", screamData.screamId)
                    .get();
            }
            else {
                res.status(404).json({error: "Scream not found"});
                return;
            }
        })
        .then(data => {
            // @ts-ignore
            data.forEach(doc => {
                let comment: Comment = {};
                Object.assign(comment, doc.data());
                comment.createdAt = doc.data().createdAt.toDate();
                comment.commentId = doc.id;
                screamData.comments.push(comment);
            });
            return res.json(screamData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

export const commentOnScream = (req: Request, res: Response) => {
    const {handle, imageUrl} = req.user;
    const {body} = req.body;
    const {screamId} = req.params;
    if (body.trim().len === 0) return res.status(400).json({error: "Must not be empty"});

    let newComment: Comment = {
        screamId,
        userHandle: handle,
        userImage: imageUrl,
        createdAt: new Date(),
        body,
    };

    db.doc(`/screams/${screamId}`)
        .get()
        .then(doc => {
            if (doc && doc.exists) {
                // @ts-ignore
                let commentCount = doc.data().commentCount && doc.data().commentCount > 0 ? doc.data().commentCount : 0;
                commentCount++;
                return doc.ref.update({commentCount});
            }
            else {
                res.status(404).json({error: "Scream not found"});
                return;
            }
        })
        .then(() => {
            return db
                .collection("comments")
                .add(newComment);
        })
        .then(() => {
            // doc created successfully
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.code});
        });

    return;
};

const updateLikes = (req: Request, res: Response, action: "like" | "unlike") => {
    const {handle, imageUrl} = req.user;
    const {screamId} = req.params;
    const likeDocument = db
        .collection("likes")
        .where("userHandle", "==", handle)
        .where("screamId", "==", screamId)
        .limit(1);
    const screamDocument = db.doc(`/screams/${screamId}`);
    let screamData: Scream = {comments: []};
    screamDocument
        .get()
        .then(doc => {
            if (doc && doc.exists) {
                Object.assign(screamData, doc.data());
                // @ts-ignore
                screamData.createdAt = doc.data().createdAt.toDate();
                if (!screamData.likeCount) screamData.likeCount = 0;
                if (!screamData.commentCount) screamData.commentCount = 0;
                return likeDocument.get();
            }
            else {
                res.status(404).json({error: "Scream not found"});
                return;
            }
        })
        .then(data => { // data should contain a like document
            if (!data) return;
            let likeCount = (screamData && screamData.likeCount) ? screamData.likeCount : 0;
            if (action == "like" && data.empty) {
                db.collection("likes")
                    .add({screamId, userHandle: handle})
                    .then(() => {
                        likeCount++;
                        return screamDocument.update({likeCount});
                    })
                    .then(() => {
                        screamData.likeCount = likeCount;
                        res.json(screamData);
                    });
            }
            else if (action == "unlike" && !data.empty) {
                const {id} = data.docs[0];
                db.doc(`/likes/${id}`)
                    .delete()
                    .then(() => {
                        if (likeCount > 0) likeCount--;
                        return screamDocument.update({likeCount});
                    })
                    .then(() => {
                        screamData.likeCount = likeCount;
                        res.json(screamData);
                    });
            }
            else {
                if (action === "like")
                    res.status(400).json({error: "Scream already liked"});
                else if (action === "unlike")
                    res.status(400).json({error: "Scream not liked"});
                return;
            }
        })
        .catch(err => {
            res.status(500).json({error: err.code});
        });
    return;
};

export const likeScream = (req: Request, res: Response) => updateLikes(req, res, "like");
export const unlikeScream = (req: Request, res: Response) => updateLikes(req, res, "unlike");
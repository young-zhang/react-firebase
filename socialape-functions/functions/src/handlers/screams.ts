import {Request, Response} from "express";
import {db} from "../util/admin";
import {Scream, Comment, Like} from "../types";

export const getAllScreams = (req: Request, res: Response) => {
    db.collection("screams")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            const screams: Scream[] = [];
            data.forEach(doc => {
                let scream: Scream = {comments: []};
                Object.assign(scream, doc.data());
                scream.createdAt = doc.data().createdAt.toDate();
                scream.screamId = doc.id;
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
                return null;
            }
        })
        .then(data => {
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
                let commentCount = doc.data().commentCount && doc.data().commentCount > 0 ? doc.data().commentCount : 0;
                commentCount++;
                return doc.ref.update({commentCount});
            }
            else {
                res.status(404).json({error: "Scream not found"});
                return null;
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

    return null;
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
                screamData.createdAt = doc.data().createdAt.toDate();
                if (!screamData.likeCount) screamData.likeCount = 0;
                if (!screamData.commentCount) screamData.commentCount = 0;
                return likeDocument.get();
            }
            else {
                res.status(404).json({error: "Scream not found"});
                return null;
            }
        })
        .then(data => { // data should contain a like document
            if (!data) return;
            let likeCount = (screamData && screamData.likeCount) ? screamData.likeCount : 0;
            if (action == "like" && data.empty) {
                const like: Like = {screamId, userHandle: handle};
                db.collection("likes")
                    .add(like)
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

export const deleteScream = (req: Request, res: Response) => {
    const {handle, imageUrl} = req.user;
    const {screamId} = req.params;
    const document = db.doc(`/screams/${screamId}`);
    document.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(404).json({error: "Scream not found"});
                return null;
            }
            if (doc.data().userHandle !== handle) {
                res.status(403).json({error: "Unauthorized"});
                return null;
            }
            return document.delete();
        })
        .then(() => {
            res.json({message: "Scream deleted successflly"});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
};
import {Request, Response} from "express";
import {db} from "../util/admin";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export const getAllScreams = (req: Request, res: Response) => {
    db.collection("screams")
        .orderBy("createdAt", "desc")
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
};

export const postOneScream = (req: Request, res: Response) => {
    if (req.method !== "POST") {
        res.status(400).json({error: "Method not allowed"});
    }
    else {
        const {body} = req.body;
        const newScream = {
            body: body,
            userHandle: req.user["handle"],
            createdAt: new Date() //.toISOString()
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

interface Comment {
    commentId?: string
    screamId?: string
    userHandle?: string
    createdAt?: Timestamp | Date
    body?: string
}

interface Scream {
    screamId?: string
    createdAt?: Timestamp | Date
    userHandle?: string
    body?: string
    comments: Comment[]
}

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
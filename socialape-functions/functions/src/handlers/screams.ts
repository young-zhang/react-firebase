import {Request, Response} from "express";
import {db} from "../util/admin";

export const getAllScreams = (req: Request, res: Response) => {
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
};

export const postOneScream = (req: Request, res: Response) => {
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
};
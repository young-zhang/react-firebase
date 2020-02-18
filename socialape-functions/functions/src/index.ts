import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

//import firebaseConfig from "../firebaseConfig";

//admin.initializeApp(firebaseConfig);
admin.initializeApp();
const app = express();

app.get('/screams', (req, res)=> {
    admin.firestore().collection('screams').get()
        .then(data => {
            const screams: any = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

export const createScream = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({error: 'Method not allowed'});
    }
    else {
        const {body, userHandle} = req.body;
        const newScream = {
            body: body,
            userHandle: userHandle,
            createdAt: admin.firestore.Timestamp.fromDate(new Date())
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

exports.api = functions.https.onRequest(app);
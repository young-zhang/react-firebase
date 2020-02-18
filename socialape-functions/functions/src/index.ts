import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import firebaseConfig from "../firebaseConfig";

//admin.initializeApp(firebaseConfig);
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello world!");
});

export const getScreams = functions.https.onRequest((request, response) => {
    admin.firestore().collection('screams').get()
        .then(data => {
            const screams: FirebaseFirestore.DocumentData[] = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return response.json(screams);
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
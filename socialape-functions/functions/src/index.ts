import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(); // app id set in .firebaserc

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
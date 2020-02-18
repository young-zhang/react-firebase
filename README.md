# Full Stack React &amp; Firebase Tutorial

This repo follows the YouTube video [Full Stack & Firebase Tutorial - Build a social media app](https://youtu.be/m_u6P5k0vP0?t=1)

[9:35](https://youtu.be/m_u6P5k0vP0?t=575) `npm install -g firebase-tools`

[10:18](https://youtu.be/m_u6P5k0vP0?t=618) `firebase login`

[10:47](https://youtu.be/m_u6P5k0vP0?t=647)
`md socialape-functions`

`cd socialape-functions`

`firebase init`

Select `Functions: Configure and deploy Cloud Functions`; `Use an existing project`; `socialape--xxxx`

[What is the practice on committing firebase files in a NodeJS app?](https://stackoverflow.com/questions/43527359/what-is-the-practice-on-committing-firebase-files-in-a-nodejs-app)

[12:04](https://youtu.be/m_u6P5k0vP0?t=724) `firebase deploy`

[20:48](https://youtu.be/m_u6P5k0vP0?t=1248) if trying createScream, and you get `Error: Value for argument "data" is not a valid Firestore document.`, 
make sure the POST request is sending data as JSON and not Text. See https://i.stack.imgur.com/Mb3re.png

`firebase serve` to server the application locally.

If you get the error `Error: Could not load the default credentials.`, go to Firebase Console's *Project Settings*, select *Service accounts*, 
and *Generate new private key*, then set GOOGLE_APPLICATION_CREDENTIALS to the key JSON file:

`set GOOGLE_APPLICATION_CREDENTIALS=F:\serviceAccountKey.json`

[26:22](https://youtu.be/m_u6P5k0vP0?t=1582) Handling GET requests to createScream.

[28:38](https://youtu.be/m_u6P5k0vP0?t=1718) Install Express:

`cd functions`

`npm install --save express`
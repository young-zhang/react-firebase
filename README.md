# Full Stack React &amp; Firebase Tutorial

This repo follows the YouTube video [Full Stack & Firebase Tutorial - Build a social media app](https://youtu.be/m_u6P5k0vP0?t=1)

## After cloning the repo
Create a file  `/socialape-functions/functions/src/firebaseConfig.ts` and fill it with your webapp config:

```
// copy paste the following from Settings | General | Your apps | Firebase SDK snippet
const firebaseConfig = {
    apiKey: "**",
    authDomain: "**",
    databaseURL: "**",
    projectId: "**",
    storageBucket: "**",
    messagingSenderId: "**",
    appId: "**",
    measurementId: "**"
};

export default firebaseConfig;
```

Then

```
cd socialape-functions
cd functions
npm install
npm run build
```

To debug, run `firebase emulators:start --inspect-functions`

## Notes

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

[28:38](https://youtu.be/m_u6P5k0vP0?t=1718) Install [express](https://github.com/expressjs/express#readme):

```
cd functions
npm install --save express
```

[43:28](https://youtu.be/m_u6P5k0vP0?t=2608) Install firebase NPM
```
cd functions
npm install --save firebase
```

[1:22:38](https://youtu.be/m_u6P5k0vP0?t=4958) [Extend Express Request object using Typescript](https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript)

[1:50:37](https://youtu.be/m_u6P5k0vP0?t=6637) Install [busboy](https://github.com/mscdex/busboy#readme):
```
cd functions
npm install --save busboy@0.3.0 @types/busboy
```
or, if you want to 
[use the latest version of busboy, without corresponding types](https://medium.com/@amandeepkochhar/typescript-error-could-not-find-a-declaration-file-for-module-xyz-dfbe6e45c2bd),
add `"noImplicitAny": false,` to `tsconfig.json`.

[1:55:32](https://youtu.be/m_u6P5k0vP0?t=6932) Also, I use [node-temp](https://github.com/bruce/node-temp) instead of the crazy way of generating temp file names with `Math.random()`:
```
npm install temp @types/temp
```

[2:09:43](https://youtu.be/m_u6P5k0vP0?t=7783) The use of `req.rawBody` [is deprecated](https://github.com/expressjs/express/issues/897). 
For now, one can simply use:
```
// @ts-ignore
busboy.end(req.rawBody);
```

[4:26:33](https://youtu.be/m_u6P5k0vP0?t=15993) `npm install -g create-react-app`, then
`create-react-app socialape-client --template typescript`

[4:31:00](https://youtu.be/m_u6P5k0vP0?t=16260) 
```
npm install --save react-router-dom
npm install @types/react-router-dom
```

[4:34:12](https://youtu.be/m_u6P5k0vP0?t=16452) `npm install -save @material-ui/core`

[4:51:02](https://youtu.be/m_u6P5k0vP0?t=17462) `npm install --save axios`

[5:14:08](https://youtu.be/m_u6P5k0vP0?t=18848) `npm install --save dayjs` [dayjs](https://github.com/iamkun/dayjs) is
a lightweight alternative to [momentjs](https://momentjs.com/).

---

## Misc Resources
- [ECMAScript 2019 Language Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [What the heck is the event loop anyway?](https://youtu.be/8aGhZQkoFbQ)
- [TypeScript Resources](https://github.com/nairobijs/Typescript-Resources)
- [Plain JavaScript vs React](https://www.robinwieruch.de/why-frameworks-matter)
- [React app sample with TypeScript](https://github.com/mui-org/material-ui/tree/master/examples/create-react-app-with-typescript)
- [Using TypeScript With Material UI](https://material-ui.com/guides/typescript/). 

To use `withStyles` with `withRouter` in TypeScript,
the component should be created like this:
```
import {createStyles} from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";

const styles = createStyles({
    // styles
}

interface Props {
    // properties
}

interface State {
    // states
}

class CustomComponent extends Component<Props & RouteComponentProps<Props> & WithStyles<typeof styles>, State> {
    // ...
}

export default withStyles(styles)(withRouter(CustomComponent));
```
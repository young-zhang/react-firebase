# Full Stack React &amp; Firebase Tutorial

This repo follows [Classed](https://www.youtube.com/channel/UC2-slOJImuSc20Drbf88qvg)'s tutorial series: 
[Full Stack & Firebase Tutorial - Build a social media app](https://www.youtube.com/watch?v=RkBfu-W7tt0&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP),
which is also available [here as one single video](https://youtu.be/m_u6P5k0vP0).
The JavaScript repos for the [Firebase Functions](https://github.com/hidjou/classsed-react-firebase-functions)
and [React Client](https://github.com/hidjou/classsed-react-firebase-client) can be perused to see what differences exist
between my TypeScript and the instructor's JavaScript implementations.

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

[5:58:42](https://youtu.be/m_u6P5k0vP0?t=21522) `npm install --save jwt-decode @types/jwt-decode`

[6:03:29](https://youtu.be/m_u6P5k0vP0?t=21809) How to [use spread properties in Typescript+React](https://stackoverflow.com/questions/40326224/typescript-equivalent-of-rest-spread-props-in-react-stateless-component),
and [Typescript - how to omit properties so a subset can be transferred with spread?](https://stackoverflow.com/questions/52195740/typescript-how-to-omit-properties-so-a-subset-can-be-transferred-with-spread)

[#18](https://youtu.be/fjWk7cZFxoM?list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP) Redux Setup:
[What Does Redux Do? (and when should you use it?)](https://daveceddia.com/what-does-redux-do/) and
[Immutability in JavaScript using Redux](https://www.toptal.com/javascript/immutability-in-javascript-using-redux). Also
[Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript/). And
[Use Redux Devtools Extension Package from NPM](https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm)
```
npm install --save redux react-redux redux-thunk @types/react-redux
```

[#20](https://youtu.be/7BG_3JTmkKU?list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP) Profile section:
[Material Icons](https://material-ui.com/components/material-icons/) `npm install --save @material-ui/icons`

---

## Misc Resources
- [ECMAScript 2019 Language Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [What the heck is the event loop anyway?](https://youtu.be/8aGhZQkoFbQ)
- [TypeScript Resources](https://github.com/nairobijs/Typescript-Resources)
- [Plain JavaScript vs React](https://www.robinwieruch.de/why-frameworks-matter)
- [React vs Vue](https://www.mindk.com/blog/react-vs-vue/)
- [React app sample with TypeScript](https://github.com/mui-org/material-ui/tree/master/examples/create-react-app-with-typescript)
- [React Router Introduction](https://youtu.be/cKnc8gXn80Q)
- [Protected routes and authentication with React Router v4](https://youtu.be/ojYbcon588A)
- [React Typescript Tutorial](https://youtu.be/Z5iWr6Srsj8)
- [How to Use React Router in Typescript](https://www.pluralsight.com/guides/react-router-typescript)
- [TypeScript and React: Children](https://fettblog.eu/typescript-react/children/)
- [React children composition patterns with TypeScript](https://medium.com/@martin_hotell/react-children-composition-patterns-with-typescript-56dfc8923c64)
- [Example Code for Use of Strong Typing in Redx](https://github.com/alexzywiak/react-redux-typescript) and an [explanation](https://alexzywiak.github.io/react-redux-with-typescript/index.html).
- [Using TypeScript With Material UI](https://material-ui.com/guides/typescript/).
- [Getting Started With Redux and TypeScript](https://rjzaworski.com/2016/08/getting-started-with-redux-and-typescript) and [repo](https://github.com/rjz/typescript-react-redux).
- [Strongly-typed React Redux Code with TypeScript](https://www.carlrippon.com/strongly-typed-react-redux-code-with-typescript/)
- [React & Redux in TypeScript](https://github.com/piotrwitek/react-redux-typescript-guide)

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

class CustomComponent extends Component<Props & RouteComponentProps & WithStyles<typeof styles>, State> {
    // ...
}

export default withStyles(styles)(withRouter(CustomComponent));
```
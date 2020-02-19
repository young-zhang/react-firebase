import {NextFunction, Request, Response} from "express";
import DecodedIdToken = admin.auth.DecodedIdToken;
import {admin, db} from "./admin";

export default function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        let idToken = req.headers.authorization.split('Bearer ')[1];
        admin.auth()
            .verifyIdToken(idToken)
            .then((decodedToken: DecodedIdToken) => {
                req.user = decodedToken;
                return db.collection('users')
                    .where('userId', '==', req.user.uid)
                    .limit(1)
                    .get();
            })
            .then(data => {
                req.user['handle'] = data.docs[0].data().handle;
                return next();
            })
            .catch(err => {
                console.error('Error while verifying token ', err);
                return res.status(403).json(err);
            });
        return;
    }
    else {
        console.error('No token found');
        return res.status(403).json({error: 'Unauthorized'});
    }
};

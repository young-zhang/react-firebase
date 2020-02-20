import {NextFunction, Request, Response} from "express";
import DecodedIdToken = admin.auth.DecodedIdToken;
import {admin, db} from "./admin";

export default function (req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const bearerPrefix = "Bearer ";
    if (authorization && authorization.startsWith(bearerPrefix)) {
        const idToken = authorization.substr(bearerPrefix.length);
        admin.auth()
            .verifyIdToken(idToken)
            .then((decodedToken: DecodedIdToken) => {
                req.user = decodedToken;
                return db.collection("users")
                    .where("userId", "==", req.user.uid)
                    .limit(1)
                    .get();
            })
            .then(data => {
                const user = data.docs[0].data();
                req.user["handle"] = user.handle;
                req.user["imageUrl"] = user.imageUrl;
                return next();
            })
            .catch(err => {
                console.error("Error while verifying token ", err);
                return res.status(403).json(err);
            });
        return;
    }
    else {
        console.error("No token found");
        return res.status(403).json({error: "Unauthorized"});
    }
};
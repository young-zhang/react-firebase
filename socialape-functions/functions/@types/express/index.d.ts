import * as admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;

declare global {
    namespace Express {
        interface Request {
            user: DecodedIdToken;
        }
    }
}
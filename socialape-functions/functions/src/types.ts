import firebase = require("firebase");
import Timestamp = firebase.firestore.Timestamp;

export interface User {
    credentials: {
        bio?: string
        createdAt?: Timestamp | Date
        email?: string
        handle?: string
        imageUrl?: string
        location?: string
        userId?: string
        website?: string
    }
    likes?: any[]
    screams?: Scream[]
    notifications?: Notification[]
}

export interface Scream {
    screamId?: string
    createdAt?: Timestamp | Date
    userHandle?: string
    userImage?: string
    body?: string
    likeCount?: number
    commentCount?: number
    comments: Comment[]
}

export interface Comment {
    commentId?: string
    screamId?: string
    userHandle?: string
    userImage?: string
    createdAt?: Timestamp | Date
    body?: string
}

export interface Like {
    screamId?: string
    userHandle?: string
}

export interface Notification {
    recipient?: string,
    sender?: string,
    read?: boolean,
    screamId?: string,
    type?: "like" | "comment",
    createdAt?: Timestamp | Date
    notificationId?: string
}
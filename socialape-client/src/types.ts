export const getUrl = (filename: string | undefined) => {
    let url = "";
    if (filename) {
        const storageBucket = "socialape-a241e.appspot.com";
        url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${filename}?alt=media`;
    }
    console.log(url);
    return url;
};

export interface Credentials {
    bio?: string
    createdAt?: Date
    email?: string
    handle?: string
    imageUrl?: string
    location?: string
    userId?: string
    website?: string
}

export interface User {
    credentials: Credentials
    likes?: any[]
    screams?: Scream[]
    notifications?: Notification[]
}

export interface Scream {
    screamId?: string
    createdAt?: Date
    userHandle?: string
    imageUrl?: string
    userImage?: string
    body?: string
    likeCount?: number
    commentCount?: number
    comments?: Comment[]
}

export interface Comment {
    commentId?: string
    screamId?: string
    userHandle?: string
    userImage?: string
    createdAt?: Date
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
    createdAt?: Date
    notificationId?: string
}


export const getUrl = (filename: string | undefined) => {
    let url = "";
    if (filename) {
        const storageBucket = "socialape-a241e.appspot.com";
        url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${filename}?alt=media`;
    }
    console.log(url);
    return url;
};

export interface IScream {
    "comments"?: any[],
    "likeCount"?: number,
    "body": string,
    "imageUrl"?: string,
    "createdAt": Date,
    "userHandle": string,
    "screamId": string
}
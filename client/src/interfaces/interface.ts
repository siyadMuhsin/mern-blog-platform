export interface IUser{
    _id:string;
    username:string;
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
}



export interface IBlog {
    _id:string
    title:string,
    content:string,
    imageFile?:File|null
    imageUrl:string,
    createdAt:Date,
    userId:{username:string,_id:string,email:string}
}
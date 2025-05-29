import { IBlog } from "../Imodels";

export interface IBlogServices{
    getAllBlogs(page:number,limit:number,userId?:string,isPublished?:boolean):Promise<{
          blogs: IBlog[];
            total: number;
            page: number;
            totalPages: number;
    }>
    createBlogs(userId:string,blogData:Partial<IBlog>,file:Express.Multer.File):Promise<{
        msg:string,
        ok:boolean,
        blog:IBlog
    }>
    getBlog(blogId:string):Promise<{ok:boolean,msg:string,blog?:IBlog}>
   updateBlog(blogData:Partial<IBlog>,blogId:string,userId:string,file?:Express.Multer.File):Promise<{
    ok:boolean,
    msg:string,
    blog?:IBlog
   }>
   deleteBlog(blogId:string,userId:string):Promise<{ok:boolean,msg:string}>
   blogPublish(userId:string,blogId:string):Promise<{ok:boolean,msg:string}>
   
} 
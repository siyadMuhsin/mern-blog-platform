
import api from "../config/axiosConfig";
import type { IBlog } from "../interfaces/interface";
import type { BlogFormData } from "../pages/CreateBlog";


const createBlog = async (data: FormData) => {
  try {
    // const formData = new FormData();
    // formData.append("title", data.title);
    // formData.append("content", data.content);
    // if (data.imageUrl) {
    //   formData.append("image", data.imageUrl);
    // }

    const response = await api.post("/blog", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};
const fetching=async (page:number,limit:number)=>{
  try {
    const response=await api.get(`/blog/?page=${page}&limit=${limit}`)
return response.data.data
  } catch (error:any) {
    throw new Error(error.response?.data?.message)
}
}
const getBlogById=async(blodId:string)=>{
try {
  const response=await api.get(`/blog/${blodId}`)
  return response.data
} catch (error:any) {
  throw new Error(error?.response?.data?.message)
}
}
const fetchUserBlogs =async (page:number,limit:number)=>{
  const response= await api.get(`/blog/user/?page=${page}&limit=${limit}`)
  return response.data
}
const updateBlog=async (blogData:IBlog)=>{
  const formData=new FormData()
  formData.append("title",blogData.title)
  formData.append("content",blogData.content)
  if(blogData.imageFile){
  formData.append("image",blogData.imageFile)
  }
for(let [key,value] of formData.entries()){
  console.log(key,':',value)
}

  const response=await api.put(`/blog/${blogData._id}`,formData,{headers:{
    "Content-Type": "multipart/form-data",
  }})
  return response.data

}
const deleteBlog=async (id:string)=>{
  try {
    const response=await api.delete(`/blog/${id}`)
return response.data
  } catch (error:any) {
    throw new Error(error.response?.data?.msg)
    
  }


}
export { createBlog,fetching,getBlogById,fetchUserBlogs ,updateBlog,deleteBlog};

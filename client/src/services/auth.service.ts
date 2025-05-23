
import  api from "../config/axiosConfig"
import { useAuth } from "../context/auth.context";

const loginUser=async(email:string,password:string)=>{
    try {
        const result= await api.post('/auth/login',{email,password})
        return result.data
    } catch (error:any) {
        console.log(error);
        throw new Error(
      error.response?.data?.message ||error.response.data.errors[0].message|| "An error occurred during registration"
    );
    }

}
const registerUser=async(username:string,email:string,password:string)=>{
    try {
        const result=await api.post('/auth/signup',{username,email,password})
        return result.data
    } catch (error:any) {
        console.log(error.response.data.message)
         throw new Error(
      error.response?.data?.message || error.response.data.errors[0].message||"An error occurred during registration"
    );
    }

}
const logoutUser=async()=>{
    try {
        const result=await api.post('/auth/logout')
        return result.data
    } catch (error:any) {
        throw new Error(error?.response?.data?.message)
    }
}
const checkAuth=async()=>{
    try {
        const response=await api.get('/auth/me')
        return response.data
    } catch (error:any) {
        throw new Error(error?.response?.data?.message)
        
    }
}
export {
    loginUser,registerUser,logoutUser,checkAuth
}
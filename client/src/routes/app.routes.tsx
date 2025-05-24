import { Route, Routes } from "react-router-dom";
import { AuthForm } from "../pages/AuthPage";
import Home from "../pages/Home";
import ProtectedRoute, { PublicOnlyRoute } from "./protected.routes";
import CreateBlogForm from "../pages/CreateBlog";
import BlogDetails from "../pages/BlogDetails";
import MyBlogs from "../pages/MyBlogs";

const AppRouter = () => {
  return (

        <Routes>
          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthForm />
              </PublicOnlyRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          <Route path="/create-blog" element={
            <ProtectedRoute>
              <CreateBlogForm/>
            </ProtectedRoute>}/>

          <Route path="/my-blogs" element={
            <ProtectedRoute>
              <MyBlogs/>
            </ProtectedRoute> 
          }/>
        </Routes>

  );
};

export default AppRouter;

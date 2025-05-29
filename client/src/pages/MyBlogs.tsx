import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../context/auth.context";
import {
  fetchUserBlogs,
  updateBlog,
  deleteBlog,
  fetchUserDrafts,
} from "../services/blog.service";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import type { IBlog } from "../interfaces/interface";
import BlogCard from "../components/BlogCard";
import EditBlogModal from "../components/EditBlog";
import { FiEdit2, FiTrash2, FiPlus, FiLogOut, FiEye } from "react-icons/fi";
import LoadingSpinner from "../components/Loader";
import ConfirmationModal from "../components/Confirmation";

interface BlogResponse {
  blogs: IBlog[];
  total: number;
  page: number;
  totalPages: number;
}

type BlogTab = "published" | "drafts";

const MyBlogs: React.FC = () => {
  const { user, logout } = useAuth();
  const [publishedBlogs, setPublishedBlogs] = useState<IBlog[]>([]);
  const [draftBlogs, setDraftBlogs] = useState<IBlog[]>([]);
  const [activeTab, setActiveTab] = useState<BlogTab>("published");
  const [page, setPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreDrafts, setHasMoreDrafts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingBlogId, setEditingBlog] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchBlogs = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      try {
        const response: BlogResponse = await fetchUserBlogs(pageNum, 5);
  
        setPublishedBlogs((prev) => {
          const newBlogs = response.blogs.filter(
            (newBlog) => !prev.some((blog) => blog._id === newBlog._id)
          );
          return [...prev, ...newBlogs];
        });

        setHasMore(pageNum < response.totalPages);
        setPage(pageNum + 1);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch your blogs");
      } finally {
        setIsLoading(false);
        setInitialLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  const fetchDrafts = useCallback(
    async (pageNum: number) => {
      if (isLoadingDrafts || !hasMoreDrafts) return;
      setIsLoadingDrafts(true);

      try {
        const response: BlogResponse = await fetchUserDrafts(pageNum, 5);
        console.log("Fetched draft blogs:", {
          pageNum,
          blogs: response.blogs,
          total: response.total,
          totalPages: response.totalPages,
        });

        setDraftBlogs((prev) => {
          const newBlogs = response.blogs.filter(
            (newBlog) => !prev.some((blog) => blog._id === newBlog._id)
          );
          return [...prev, ...newBlogs];
        });

        setHasMoreDrafts(pageNum < response.totalPages);
        setDraftPage(pageNum + 1);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch your drafts");
      } finally {
        setIsLoadingDrafts(false);
      }
    },
    [isLoadingDrafts, hasMoreDrafts]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please login to view your blogs");
      return;
    }
    fetchBlogs(1);
    fetchDrafts(1);
  }, [user, navigate, fetchBlogs, fetchDrafts]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        if (activeTab === "published" && hasMore) {
          console.log("Fetching more published blogs, page:", page);
          fetchBlogs(page);
        } else if (activeTab === "drafts" && hasMoreDrafts) {
          console.log("Fetching more draft blogs, page:", draftPage);
          fetchDrafts(draftPage);
        }
      }
    },
    [activeTab, fetchBlogs, fetchDrafts, hasMore, hasMoreDrafts, isLoading, page, draftPage]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleObserver]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  const handleUpdate = async (updatedBlog: IBlog) => {
    try {
      setIsLoading(true);
      const response = await updateBlog(updatedBlog);
      toast.success(response.msg);
      if (updatedBlog.isPublished) {
        setPublishedBlogs((prev) =>
          prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
        );
        setDraftBlogs((prev) => prev.filter((blog) => blog._id !== updatedBlog._id));
      } else {
        setDraftBlogs((prev) =>
          prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
        );
        setPublishedBlogs((prev) => prev.filter((blog) => blog._id !== updatedBlog._id));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update blog");
    } finally {
      setIsLoading(false);
      setEditingBlog(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBlog(id);
      // Remove from both published and drafts
      setPublishedBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setDraftBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };
const handlePublishSuccess = useCallback((blogId: string) => {

    const publishedBlog = draftBlogs.find(blog => blog._id === blogId);
    if (publishedBlog) {
      const updatedBlog = { ...publishedBlog, isPublished: true };
      setDraftBlogs(prev => prev.filter(blog => blog._id !== blogId));
      setPublishedBlogs(prev => [updatedBlog, ...prev]);
    }
  }, [draftBlogs]);


  const currentBlogs = activeTab === "published" ? publishedBlogs : draftBlogs;
  const currentLoading = activeTab === "published" ? isLoading : isLoadingDrafts;
  const noBlogs = activeTab === "published" 
    ? publishedBlogs.length === 0 
    : draftBlogs.length === 0;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            My Blog Posts
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/create-blog")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
            >
              <FiPlus className="text-lg" />
              Create New
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
            >
              <FiEye className="text-lg" />
              View All
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
            >
              <FiLogOut className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "published" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("published")}
          >
            Published ({publishedBlogs.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "drafts" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("drafts")}
          >
            Drafts ({draftBlogs.length})
          </button>
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : noBlogs ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-4">
              {activeTab === "published"
                ? "You haven't published any blogs yet"
                : "You don't have any drafts"}
            </h2>
            <button
              onClick={() => navigate("/create-blog")}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
            >
              {activeTab === "published"
                ? "Publish Your First Blog"
                : "Create a Draft"}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog) => (
                <div key={blog._id} className="relative group">
                   <BlogCard
      key={blog._id}
      id={blog._id}
      author={user.username || "Unknown"}
      title={blog.title}
      content={blog.content}
      imageUrl={blog.imageUrl}
      date={new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
      status={blog.isPublished}
      onPublishSuccess={!blog.isPublished ? handlePublishSuccess : undefined}
    />

               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
  {!blog.isPublished && (
    <button
      onClick={(e) => {
        e.preventDefault();
        setEditingBlog(blog._id);
      }}
      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md"
      title="Edit"
    >
      <FiEdit2 />
    </button>
  )}
  <button
    onClick={(e) => {
      e.preventDefault();
      setBlogToDelete(blog._id);
      setIsDeleteModalOpen(true);
    }}
    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
    title="Delete"
  >
    <FiTrash2 />
  </button>
</div>
                </div>
              ))}
            </div>

            {/* Loading spinner for pagination */}
            {currentLoading && currentBlogs.length > 0 && (
              <div className="flex justify-center items-center mt-8">
                <LoadingSpinner />
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
          </>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => blogToDelete && handleDelete(blogToDelete)}
            title="Confirm Deletion"
            message="Are you sure you want to delete this blog? This action cannot be undone."
          />
        )}

        {/* Edit Modal */}
        {editingBlogId && (
          <EditBlogModal
            blogId={editingBlogId}
            onClose={() => setEditingBlog(null)}
            onSave={handleUpdate}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default MyBlogs;
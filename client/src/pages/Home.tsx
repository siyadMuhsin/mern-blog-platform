import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/auth.context";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import type { IBlog } from "../interfaces/interface";
import { fetching } from "../services/blog.service";
import BlogCard from "../components/BlogCard";
import { logoutUser } from "../services/auth.service";

interface BlogResponse {
  blogs: IBlog[];
  total: number;
  page: number;
  totalPages: number;
}

const Home: React.FC = () => {
   const { user, logout } = useAuth();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

  const fetchBlogs = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      setError(null);

      try {
        const response: BlogResponse = await fetching(pageNum, 1)

        setBlogs((prev) => {
          // Filter out duplicates (in case of overlapping fetches)
          const newBlogs = response.blogs.filter(
            newBlog => !prev.some(blog => blog._id === newBlog._id)
          );
          return [...prev, ...newBlogs];
        });
        
        setHasMore(pageNum < response.totalPages);
        setPage(pageNum + 1);
      } catch (error: any) {
        console.error("Failed to fetch blogs:", error);
        setError(error.message || "Failed to load blogs");
        toast.error(error.message || "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchBlogs(1); // Initial fetch
    }
  }, [fetchBlogs]);

  // IntersectionObserver to trigger fetching next page
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        console.log("IntersectionObserver triggered, fetching page:", page);
        fetchBlogs(page);
      }
    },
    [fetchBlogs, hasMore, isLoading, page]
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
      const response = await logoutUser();
      if (response.ok) {
        logout();
        toast.success("Logged out successfully");
        setShowLogoutModal(false);
        navigate("/");
      } else {
        toast.error(response.message || "Failed to logout");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 w-full">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-white">Confirm Logout</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all duration-200"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200"
                aria-label="Confirm logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              BlogSphere
            </span>
          </Link>
          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/my-blogs")}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                  aria-label="View my blogs"
                >
                  My Blogs
                </button>
                <button
                  onClick={() => navigate("/create-blog")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                  aria-label="Create a new blog"
                >
                  Create Blog
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                aria-label="Go to login page"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {user ? "Your Dashboard" : "Featured Articles"}
          </h2>
        </div>

        {error && (
          <div
            className="mb-6 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-center"
            role="alert"
            aria-describedby="error-message"
          >
            <span id="error-message">{error}</span>
          </div>
        )}

        {isLoading && blogs.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : blogs.length === 0 ? (
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
            <h3 className="text-xl font-medium text-gray-300 mb-4">
              {user ? "You haven't created any blogs yet" : "No blogs available yet"}
            </h3>
            <button
              onClick={() => navigate(user ? "/create-blog" : "/auth")}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
              aria-label={user ? "Create your first blog" : "Join now"}
            >
              {user ? "Create Your First Blog" : "Join Now"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                content={blog.content}
                imageUrl={blog.imageUrl}
                author={blog.userId?.username || "Unknown"}
                status={blog.isPublished}
                date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            ))}
          </div>
        )}

        {isLoading && blogs.length > 0 && (
          <div className="flex justify-center items-center mt-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                BlogSphere
              </Link>
              <p className="text-gray-400 mt-2">
                Share your thoughts with the world
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} BlogSphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
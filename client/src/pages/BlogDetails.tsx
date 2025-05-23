import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById } from "../services/blog.service";
import type { IBlog } from "../interfaces/interface";

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("Invalid blog ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getBlogById(id);
        setBlog(response.blog);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Estimated read time calculation (assuming 200 words per minute)
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
          <p className="text-gray-600 dark:text-gray-300">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-medium">
            {error || "Blog not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Return to home"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 py-12">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Content */}
            <button
              onClick={() => navigate("/")}
              className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Return to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {blog.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
              <p>{new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
              <span className="hidden sm:block">•</span>
              <p>{calculateReadTime(blog.content)}</p>
              <span className="hidden sm:block">•</span>
              <p>Author: {blog.userId?.username || "Unknown"}</p>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line mb-8">
              {blog.content}
            </p>
            {/* Image */}
            <div className="w-full">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full max-w-full max-h-full object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
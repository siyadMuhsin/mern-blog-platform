import React, { useEffect, useState } from "react";
import type { IBlog } from "../interfaces/interface";
import { getBlogById } from "../services/blog.service";
import { toast } from "react-toastify";
import { FiImage, FiX } from "react-icons/fi";

interface EditBlogModalProps {
  blogId: string;
  onClose: () => void;
  onSave: (data: IBlog) => void;
  isLoading?: boolean;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ 
  blogId, 
  onClose, 
  onSave,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<IBlog | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const res = await getBlogById(blogId);
        setFormData(res.blog);
        setImagePreview(res.blog.imageUrl);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to fetch blog details. Please try again.");
        toast.error("Failed to fetch blog details");
      } finally {
        setIsFetching(false);
      }
    };
    loadBlog();
  }, [blogId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isLoading || isFetching) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || isFetching) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.match("image.*")) {
      setError("Please upload an image file (PNG, JPG, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.error) {
        setError("Failed to read the image file");
        return;
      }
      const result = reader.result as string;
      setImagePreview(result);
      setFormData(prev => prev ? { ...prev, imageFile: file, imageUrl: result } : null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (isLoading || isFetching) return;
    setImagePreview("");
    setFormData(prev => prev ? { ...prev, imageFile: null, imageUrl: "" } : null);
    setError(null);
  };

  const handleSave = () => {
    if (!formData || isLoading || isFetching) return;

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }
    if (!formData.imageUrl && !formData.imageFile) {
      setError("Please upload an image");
      return;
    }

    onSave(formData);
  };

  if (isFetching) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full text-center shadow-lg">
          <div className="flex justify-center items-center h-32">
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
          <p className="text-gray-600 dark:text-gray-300 mt-4">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        {/* Loading overlay for saving */}
        {isLoading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
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
        )}

        <button
          onClick={onClose}
          disabled={isLoading || isFetching}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Edit Blog
        </h2>

        {error && (
          <div
            className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg"
            role="alert"
            aria-describedby="error-message"
          >
            <span id="error-message">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData?.title || ""}
                onChange={handleChange}
                disabled={isLoading || isFetching}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter blog title"
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData?.content || ""}
                onChange={handleChange}
                disabled={isLoading || isFetching}
                rows={10}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Write blog content..."
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Blog Image
            </label>
            <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center mb-4 overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Blog Preview"
                    className="w-full max-w-full max-h-[300px] object-contain rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    disabled={isLoading || isFetching}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 disabled:opacity-50 transition-colors"
                    aria-label="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FiImage className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No image selected</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
            <label className="block w-full">
              <span className="sr-only">Choose blog image</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading || isFetching}
                className="block w-full text-sm text-gray-700 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-100 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300
                  hover:file:bg-blue-200 dark:hover:file:bg-blue-800
                  disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading || isFetching}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isFetching}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            aria-label={isLoading ? "Saving changes" : "Save changes"}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
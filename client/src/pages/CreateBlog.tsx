import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { createBlog } from "../services/blog.service";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export interface BlogFormData {
  title: string;
  content: string;
  imageUrl: File | null;
  imagePreviewUrl: string | null;
}

const CreateBlogForm: React.FC = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    imageUrl: null,
    imagePreviewUrl: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setFormData((prev) => ({ ...prev, imageUrl: null, imagePreviewUrl: null }));
      return;
    }

    // Validate image file
    if (!file.type.match("image.*")) {
      setError("Please upload an image file (PNG, JPG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.error) {
        setError("Failed to read the image file");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imageUrl: file,
        imagePreviewUrl: reader.result as string,
      }));
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: null,
      imagePreviewUrl: null,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.imageUrl) {
      setError("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    try {
      // Assuming createBlog expects a FormData object for file upload
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("image", formData.imageUrl);

      const response = await createBlog(data);
      toast.success(response.message || "Blog created successfully");
      
      // Reset form after successful submission
      setFormData({
        title: "",
        content: "",
        imageUrl: null,
        imagePreviewUrl: null,
      });
      navigate("/"); // Redirect to home
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data.message || "Failed to create blog");
      console.error("Blog creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Create New Blog Post
              </h2>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Close form"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Close
              </button>
            </div>

            {error && (
              <div
                className="mb-6 p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg"
                role="alert"
                aria-describedby="error-message"
              >
                <span id="error-message">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog title"
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your blog content here..."
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Featured Image
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="image"
                    className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 border border-gray-600 border-dashed rounded-lg transition-all duration-200"
                  >
                    <div className="p-4 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">
                        {formData.imageUrl
                          ? formData.imageUrl.name
                          : "Click to upload image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                      aria-required="true"
                    />
                  </label>

                  {formData.imagePreviewUrl && (
                    <div className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={formData.imagePreviewUrl}
                        alt="Preview of uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  disabled={isSubmitting}
                  aria-label="Cancel and return to home"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md disabled:opacity-50 flex items-center gap-2"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? "Publishing blog" : "Publish blog"}
                >
                  {isSubmitting ? (
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
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Publish Blog
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;
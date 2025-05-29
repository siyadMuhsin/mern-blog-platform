import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { publishBlog } from '../services/blog.service';
import { toast } from 'react-toastify';
import ConfirmationModal from './Confirmation';


interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  date: string;
  status?: boolean;
  onPublishSuccess?: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  content,
  imageUrl,
  author,
  date,
  status = true,
  onPublishSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublishClick = async () => {
    try {
      await publishBlog(id);
      toast.success('Blog published successfully');
      if (onPublishSuccess) onPublishSuccess(id);
    } catch (error) {
      console.error(error);
      toast.error('Failed to publish blog');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Link
        to={`/blog/${id}`}
        className={`group relative block h-full ${!status ? 'opacity-90' : ''}`}
      >
        <div
          className={`h-full bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border ${
            !status
              ? 'border-yellow-500 hover:border-yellow-400'
              : 'border-gray-700 hover:border-blue-500'
          } group-hover:scale-[1.02]`}
        >
          {!status && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-md z-10">
              DRAFT
            </div>
          )}

          {imageUrl ? (
            <div className="h-48 overflow-hidden relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-700" />
          )}

          <div className="p-6">
            <div className="flex items-center mb-3">
              <span className="text-sm text-gray-400">{date}</span>
              <span className="mx-2 text-gray-600">•</span>
              <span
                className={`text-sm ${
                  !status ? 'text-yellow-400' : 'text-blue-400'
                }`}
              >
                {author}
              </span>
            </div>
            <h3
              className={`text-xl font-bold mb-2 line-clamp-2 ${
                !status ? 'text-yellow-100' : 'text-white'
              }`}
            >
              {title}
            </h3>
            <p
              className={`line-clamp-3 mb-4 ${
                !status ? 'text-gray-300' : 'text-gray-400'
              }`}
            >
              {content}
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`flex items-center ${
                  !status ? 'text-yellow-400' : 'text-blue-400'
                }`}
              >
                {!status ? 'Continue editing' : 'Read more'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>

          {!status && (
            <button
              onClick={openModal}
              className="absolute bottom-4 right-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors z-20"
            >
              Publish Now
            </button>
          )}
        </div>
      </Link>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePublishClick}
        title="Confirm Publish"
        message="Are you sure you want to publish this blog post?"
      />
    </>
  );
};

export default BlogCard;

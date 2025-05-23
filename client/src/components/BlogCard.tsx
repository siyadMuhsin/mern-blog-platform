import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    author: string;
    date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, content, imageUrl, author, date }) => {
  return (
    <div className="group relative h-full">
      <Link 
        to={`/blog/${id}`} 
        className="block h-full"
        aria-label={`Read more about ${title}`}
      >
        <div className="h-full bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500 group-hover:scale-[1.02]">
          {imageUrl ? (
            <div className="h-48 overflow-hidden">
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
              <span className="text-sm text-gray-400">
                {date}
              </span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-sm text-blue-400">
                {author}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-400 line-clamp-3 mb-4">
              {content}
            </p>
            <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
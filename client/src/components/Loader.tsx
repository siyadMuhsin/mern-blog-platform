import React from "react";
import { FiLoader, FiCircle, FiClock } from "react-icons/fi";

type SpinnerStyle = "dots" | "pulse" | "bars" | "clock" | "modern";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  style?: SpinnerStyle;
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  style = "modern",
  color = "text-blue-500",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const renderSpinner = () => {
    switch (style) {
      case "dots":
        return (
          <div className={`flex items-center justify-center space-x-1 ${sizeClasses[size]}`}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full animate-bounce ${color}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div className={`rounded-full ${sizeClasses[size]} ${color} animate-pulse`} />
        );
      case "bars":
        return (
          <div className={`flex items-center justify-center space-x-1 ${sizeClasses[size]}`}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-6 ${color} animate-grow`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: "bottom center",
                }}
              />
            ))}
          </div>
        );
      case "clock":
        return <FiClock className={`${sizeClasses[size]} ${color} animate-spin`} />;
      case "modern":
      default:
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full border-2 ${color} border-opacity-20`} />
            <div
              className={`absolute inset-0 rounded-full border-2 ${color} border-t-transparent animate-spin`}
            />
          </div>
        );
    }
  };

  return <div className={`inline-flex ${className}`}>{renderSpinner()}</div>;
};

export default LoadingSpinner;
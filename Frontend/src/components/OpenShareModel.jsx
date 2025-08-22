import React, { useState, useEffect, useMemo } from "react";
import { X, Copy, Globe, Lock, Link2, Check } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { API_ENDPOINTS } from "../utils/apienpoints";

const OpenShareModal = ({ file, isOpen, onClose }) => {
  const { getToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(file?.public || false);

  useEffect(() => {
    setIsPublic(file?.public || false);
  }, [file]);

  // Function to generate a secure token (simplified for demo)
  const generateToken = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  // Memoized share link (recomputes when file or isPublic changes)
  const shareLink = useMemo(() => {
    if (!file?.id) return "";
    return isPublic
      ? API_ENDPOINTS.SHARE_FILE(file.id)
      : `${API_ENDPOINTS.SHARE_FILE(file.id)}?token=${generateToken()}`;
  }, [isPublic, file?.id]);

  // Function to copy link to clipboard
  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to toggle public/private status
  const toggleVisibility = async () => {
    try {
      setIsPublic((prev) => !prev);
      const token = await getToken();
      await fetch(API_ENDPOINTS.TOGGLE_FILES(file.id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Share File</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Link2 size={20} className="text-blue-600" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-medium text-gray-900 truncate">
                {file?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Uploaded {formatDate(file?.uploadedAt)}
              </p>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 font-medium">
                {isPublic ? "Publicly accessible" : "Private with link"}
              </span>
              <div
                onClick={toggleVisibility}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  isPublic ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {isPublic
                ? "Anyone with the link can view this file"
                : "Only people with the link can view this file"}
            </p>
          </div>

          {/* Link Box */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share link
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm truncate bg-gray-50"
              />
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Visibility Indicator */}
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
              isPublic
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {isPublic ? (
              <>
                <Globe size={16} />
                <span className="text-sm">
                  This file is publicly accessible
                </span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span className="text-sm">This file is private</span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB");
};

export default OpenShareModal;

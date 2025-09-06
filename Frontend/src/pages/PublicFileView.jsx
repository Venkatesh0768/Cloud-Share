import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../utils/apienpoints";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { Download, FileIcon, Loader2, Share2 } from "lucide-react";

function PublicFileView() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const token = await getToken();
        const response = await fetch(API_ENDPOINTS.FETCH_FILES_ID(id), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setFile(data);
        } else {
          toast.error(data?.message || "File not found");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id, getToken]);

  const downloadFile = async (id, name) => {
    try {
      const token = await getToken();
      
      const response = await fetch(API_ENDPOINTS.DOWNLOAD_FILE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Download started");
      } else {
        toast.error("Failed to download file");
      }
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading file...
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-medium">
        ❌ File not found or inaccessible
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <FileIcon className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-lg">CloudShare</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 text-sm border rounded-lg hover:bg-gray-100 transition">
          <Share2 className="w-4 h-4" /> Share Link
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-8 text-center">
          {/* File Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
            <FileIcon className="w-8 h-8 text-blue-600" />
          </div>

          {/* File Details */}
          <h1 className="text-lg font-semibold">{file?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {(file.size / 1024).toFixed(2)} KB • Shared on{" "}
            {new Date(file.uploadedAt).toLocaleDateString()}
          </p>

          <span className="inline-block mt-2 px-3 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {file.type?.toUpperCase()}
          </span>

          {/* Download Button */}
          <div className="mt-6">
            <button
              onClick={() => downloadFile(id, file?.name)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-medium rounded-lg shadow hover:bg-gray-800 transition"
            >
              <Download className="w-5 h-5" />
              Download File
            </button>
          </div>

          {/* File Info Section */}
          <div className="mt-8 border-t pt-6 text-left">
            <h2 className="text-sm font-medium mb-2">File Information</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">File Name:</span> {file?.name}
              </p>
              <p>
                <span className="font-medium">File Type:</span> {file.type}
              </p>
              <p>
                <span className="font-medium">File Size:</span>{" "}
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <p>
                <span className="font-medium">Shared:</span>{" "}
                {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="px-6 py-4 bg-gray-50 text-sm text-gray-600 flex justify-center">
        <div className="bg-gray-100 border rounded-lg px-4 py-2 text-center">
          ℹ️ This file has been shared publicly. Anyone with this link can view and download it.
        </div>
      </footer>
    </div>
  );
}

export default PublicFileView;
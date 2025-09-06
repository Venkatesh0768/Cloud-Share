import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Grid,
  List,
  FileIcon,
  Download,
  Trash2,
  Lock,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Upload,
  Globe,
  User,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MyFileCard from "../components/MyFileCard";
import MyfileGrid from "../components/MyfileGrid";
import { API_ENDPOINTS } from "../utils/apienpoints";
import OpenShareModal from "../components/OpenShareModel";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleShareClick = (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
  };

  const fetchFiles = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        return;
      }

      const response = await fetch(API_ENDPOINTS.FETCH_FILES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        toast.error("Failed to fetch files.");
      }
    } catch (error) {
      toast.error("Failed to fetch files. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  // API integration functions
  const deleteFile = async (id) => {
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.DELETE_FILE(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("File deleted successfully");
        fetchFiles(); // Refresh the file list
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

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
  const togglePublicStatus = async (id) => {
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.TOGGLE_FILES(id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("File visibility updated");
        fetchFiles();
      } else {
        toast.error("Failed to update file visibility");
      }
    } catch (error) {
      toast.error("Failed to update file visibility");
    }
  };

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // dd/mm/yyyy format
  }

  // Filter files based on search and filter criteria
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "public" && file.public) ||
      (selectedFilter === "private" && !file.public);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout activeTab="My Files">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Files</h2>
            <p className="text-gray-500 mt-1">
              {filteredFiles.length}{" "}
              {filteredFiles.length === 1 ? "file" : "files"}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Upload size={18} />
            Upload File
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <Filter size={20} className="text-gray-400" />
              <span className="text-gray-700 capitalize">{selectedFilter}</span>
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setSelectedFilter("all");
                    setFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                    selectedFilter === "all"
                      ? "bg-purple-50 text-purple-700"
                      : ""
                  }`}
                >
                  All files
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter("public");
                    setFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                    selectedFilter === "public"
                      ? "bg-purple-50 text-purple-700"
                      : ""
                  }`}
                >
                  Public
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter("private");
                    setFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                    selectedFilter === "private"
                      ? "bg-purple-50 text-purple-700"
                      : ""
                  }`}
                >
                  Private
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200 self-center">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>

        {/* Empty State UI */}
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-12 bg-white shadow-sm">
            <div className="bg-purple-100 p-5 rounded-full mb-6">
              <FileIcon size={48} className="text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {files.length === 0 ? "No files uploaded yet" : "No files found"}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {files.length === 0
                ? "Start uploading files to see them listed here. You can upload documents, images, and other files to share and manage them securely."
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div>
            {viewMode === "list" ? (
              <div className="bg-white shadow rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-4 px-6 font-medium">NAME</th>
                        <th className="py-4 px-6 font-medium">SIZE</th>
                        <th className="py-4 px-6 font-medium">UPLOADED</th>
                        <th className="py-4 px-6 font-medium">SHARING</th>
                        <th className="py-4 px-6 font-medium text-right">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredFiles.map((file) => (
                        <MyFileCard
                          key={file.id}
                          file={file}
                          togglePublicStatus={togglePublicStatus}
                          downloadFile={downloadFile}
                          deleteFile={deleteFile}
                          formatFileSize={formatFileSize}
                          formatDate={formatDate}
                          handleShareClick={handleShareClick}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredFiles.map((file) => (
                  <MyfileGrid
                    key={file.id}
                    file={file}
                    downloadFile={downloadFile}
                    deleteFile={deleteFile}
                    togglePublicStatus={togglePublicStatus}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <OpenShareModal
          file={selectedFile}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}

export default MyFiles;
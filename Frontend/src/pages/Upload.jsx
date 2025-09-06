import { useContext, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditContext } from "../context/UserCreditContext";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../utils/apienpoints";

function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { getToken } = useAuth();
  const { credits, updateCredits } = useContext(UserCreditContext);

  // file change
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  // remove single file
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("No files selected.");
      setMessageType("error");
      return;
    }

    if (credits <= 0) {
      setMessage("You don’t have enough credits!");
      setMessageType("error");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setMessageType("");

      const token = await getToken();
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      // ⬇️ Use updateCredits instead of setCredits
      updateCredits(-files.length);

      setFiles([]);
    } catch (err) {
      setMessage("Error uploading files.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout activeTab="Upload">
      <div className="p-6">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <UploadCloud size={40} className="text-gray-400 mb-3" />
          <p className="text-gray-600">
            Drag and drop files here or click to browse
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-input"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-input"
            className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 cursor-pointer transition"
          >
            Browse Files
          </label>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Selected Files ({files.length})
            </h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Remaining Credits: <span className="font-semibold">{credits}</span>
          </p>
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition ${
              uploading || files.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Upload;
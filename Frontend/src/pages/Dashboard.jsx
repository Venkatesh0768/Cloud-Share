import { useContext, useState, useRef, useCallback, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditContext } from "../context/UserCreditContext";
import { 
  UploadCloud, 
  X, 
  Loader2, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Eye
} from "lucide-react";
import { API_ENDPOINTS } from "../utils/apienpoints";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion"; // Added for animations
import { Tooltip } from 'react-tooltip'; // Assuming react-tooltip is installed for better UX

// File type icons mapping
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return <ImageIcon size={20} className="text-indigo-500" />;
  }
  if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
    return <Music size={20} className="text-violet-500" />;
  }
  if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
    return <Video size={20} className="text-rose-500" />;
  }
  if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
    return <Archive size={20} className="text-amber-500" />;
  }
  return <FileText size={20} className="text-slate-500" />;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Message component with animation
const Message = ({ message, type, onClose }) => {
  const icons = {
    error: <AlertCircle size={20} className="text-red-500" />,
    success: <CheckCircle size={20} className="text-green-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const styles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-4 rounded-xl flex items-center justify-between border ${styles[type]} shadow-sm`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition">
          <X size={18} className="text CurrentColor" />
        </button>
      )}
    </motion.div>
  );
};

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [abortControllers, setAbortControllers] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState({}); // For file previews
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();
  const { credits, updateCredits } = useContext(UserCreditContext);

  // Constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_FILE_TYPES = [
    'image/*', 'text/*', 'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ].join(',');

  // Clear message after timeout
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Generate preview for image files
  const generatePreview = useCallback((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [file.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Validate file
  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 10MB limit`;
    }
    if (!ACCEPTED_FILE_TYPES.split(',').some(type => file.type.match(type.trim()))) {
      return `File type of "${file.name}" is not supported`;
    }
    return null;
  };

  // Add files with validation and preview
  const addFiles = (newFiles) => {
    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        const isDuplicate = files.some(existingFile => 
          existingFile.name === file.name && existingFile.size === file.size
        );
        if (!isDuplicate) {
          validFiles.push(file);
          generatePreview(file);
        } else {
          errors.push(`File "${file.name}" is already selected`);
        }
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      showMessage(`${validFiles.length} file(s) added successfully`, "success");
    }

    if (errors.length > 0) {
      showMessage(errors.join('. '), "error"); // Join errors for better display
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    addFiles(selected);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  // Remove single file and clean preview
  const handleRemoveFile = (index, fileName) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
    showMessage("File removed", "info");
  };

  // Cancel single upload
  const handleCancelUpload = (index) => {
    const controller = abortControllers[index];
    if (controller) {
      controller.abort();
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });
      showMessage("Upload canceled for file", "info");
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setUploadProgress({});
    setPreviews({});
    setAbortControllers({});
    showMessage("All files cleared", "info");
  };

  // Upload files with progress and abort support
  const handleUpload = async () => {
    if (files.length === 0) {
      showMessage("No files selected.", "error");
      return;
    }

    if (credits < files.length) {
      showMessage(`Insufficient credits! You need ${files.length} credits but only have ${credits}.`, "error");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setMessageType("");

      const token = await getToken();
      
      
      
      const controllers = {};
      const uploadPromises = files.map(async (file, index) => {
        const controller = new AbortController();
        controllers[index] = controller;

        const formData = new FormData();
        formData.append("file", file);

        setUploadProgress(prev => ({
          ...prev,
          [index]: 0
        }));

        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_ENDPOINTS.UPLOAD_FILE);

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({
              ...prev,
              [index]: percent
            }));
          }
        };

        xhr.signal = controller.signal; // For abort

        return new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Failed to upload ${file.name}: ${xhr.statusText}`));
            }
          };
          xhr.onerror = () => reject(new Error(`Network error for ${file.name}`));
          xhr.send(formData);
        });
      });

      setAbortControllers(controllers);

      const results = await Promise.allSettled(uploadPromises);
      
      const failedUploads = results.filter(r => r.status === 'rejected');
      if (failedUploads.length > 0) {
        throw new Error(failedUploads.map(r => r.reason.message).join('; '));
      }

      updateCredits(-files.length);
      setFiles([]);
      setUploadProgress({});
      setPreviews({});
      setAbortControllers({});
      showMessage(`Successfully uploaded ${files.length} file(s)!`, "success");

    } catch (err) {
      if (err.name !== 'AbortError') {
        showMessage(`Error uploading files: ${err.message}`, "error");
      }
    } finally {
      setUploading(false);
    }
  };

  // Cleanup previews on unmount
  useEffect(() => {
    
    return () => {
      Object.values(previews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Calculate total file size
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <DashboardLayout activeTab="Dashboard">
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Seamlessly upload, manage, and process your files with our advanced dashboard. 
            Enjoy real-time progress tracking, file previews, and secure handling.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <span className="flex items-center gap-2"><Info size={16} /> Max file size: 10MB</span>
            <span className="flex items-center gap-2"><Info size={16} /> Supported: Images, PDFs, Docs, Text</span>
          </div>
        </motion.div>

        {/* Credits Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Available Credits</h3>
              <p className="text-sm text-gray-600 mt-1">1 credit per file upload</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-indigo-600">{credits}</span>
              <p className="text-sm text-gray-500">remaining</p>
            </div>
          </div>
        </motion.div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <Message 
              message={message} 
              type={messageType} 
              onClose={() => {
                setMessage("");
                setMessageType("");
              }}
            />
          )}
        </AnimatePresence>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
            dragActive 
              ? 'border-indigo-400 bg-indigo-50 scale-105' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          } shadow-md hover:shadow-lg`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          aria-label="File upload area"
          role="button"
          tabIndex={0}
        >
          <UploadCloud 
            size={56} 
            className={`mx-auto mb-4 transition-colors ${dragActive ? 'text-indigo-500' : 'text-gray-400'}`} 
          />
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {dragActive ? 'Drop your files here' : 'Drag & drop files or click to browse'}
          </p>
          <p className="text-gray-500 mb-6">Secure and fast uploads with real-time tracking</p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={ACCEPTED_FILE_TYPES}
            disabled={uploading}
            aria-hidden="true"
          />
          
          <button 
            className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
            onClick={(e) => e.stopPropagation()}
            disabled={uploading}
          >
            Select Files
          </button>
        </motion.div>

        {/* Selected Files */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Files Ready for Upload ({files.length})
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Total: {formatFileSize(totalSize)}
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${file.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-white border border-gray-200 px-5 py-4 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {previews[file.name] ? (
                        <img 
                          src={previews[file.name]} 
                          alt={`Preview of ${file.name}`} 
                          className="w-12 h-12 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        getFileIcon(file.name)
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-ellipsis">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    
                    {uploading && uploadProgress[index] !== undefined && (
                      <div className="flex items-center gap-3 mr-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress[index]}%` }}
                            className="bg-indigo-500 h-2.5 rounded-full transition-all"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {uploadProgress[index]}%
                        </span>
                        <button
                          onClick={() => handleCancelUpload(index)}
                          className="text-red-500 hover:text-red-700"
                          data-tooltip-id="cancel-tip"
                          data-tooltip-content="Cancel upload"
                        >
                          <X size={18} />
                        </button>
                        <Tooltip id="cancel-tip" />
                      </div>
                    )}
                    
                    {!uploading && (
                      <div className="flex items-center gap-3">
                        {previews[file.name] && (
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => window.open(previews[file.name], '_blank')}
                            data-tooltip-id="preview-tip"
                            data-tooltip-content="Preview file"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveFile(index, file.name)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X size={18} />
                        </button>
                        <Tooltip id="preview-tip" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200"
          >
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                Estimated Cost: <span className="text-indigo-600">{files.length} credits</span>
              </p>
              {credits < files.length && (
                <p className="text-red-600 font-medium mt-1 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Insufficient credits - Add more to proceed
                </p>
              )}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || credits < files.length}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all shadow-md ${
                uploading || files.length === 0 || credits < files.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading Files...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Upload {files.length} File{files.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
import { Copy, Download, FileIcon, Globe, Trash2, User } from "lucide-react";
import React from "react";

function MyFileCard({
  file,
  togglePublicStatus,
  downloadFile,
  deleteFile,
  formatFileSize,
  formatDate,
  handleShareClick
}) {
  return (
    <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileIcon size={20} className="text-blue-600" />
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {file.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600">{formatFileSize(file.size)}</td>
      <td className="py-4 px-6 text-gray-600">{formatDate(file.uploadedAt)}</td>
      <td className="py-4 px-6 flex ">
        <button
          onClick={() => togglePublicStatus(file.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            file.public
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-orange-100 text-orange-800 hover:bg-orange-200"
          }`}
        >
          {file.public ? (
            <div className="flex items-center gap-5">
              <Globe size={14} />
            </div>
          ) : (
            <User size={14} />
          )}
          {file.public ? "Public" : "Private"}
        </button>
        {file.public ? (
          <span 
          onClick={() => handleShareClick(file)}
          className="flex items-center gap-2 ml-4 px-4 py-2 rounded-full   font-semibold border border-purple-500 shadow-lg hover:bg-purple-700 hover:scale-105 hover:text-white transition-transform duration-300 cursor-pointer">
            <Copy size={20} />
            Share Link
          </span>
        ) : (
          <span className="text-xs text-gray-500 ml-2">Only you can view</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => downloadFile(file.id, file.name)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this file?")
              ) {
                deleteFile(file.id);
              }
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default MyFileCard;

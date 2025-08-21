import { Copy, Download, FileIcon, Globe, Trash2, User } from "lucide-react";

function MyfileGrid({
  file,
  downloadFile,
  deleteFile,
  togglePublicStatus,
  formatFileSize,
  formatDate,
}) {
  return (
    <div
      key={file.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FileIcon size={24} className="text-blue-600" />
          </div>
          <button
            onClick={() => togglePublicStatus(file.id)}
            className={`p-2 rounded-lg ${
              file.public
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {file.public ? <Globe size={30} /> : <User size={30} />}
          </button>
          {file.public ? (
            <span className="flex text-[12px] items-center gap-2 px-4 py-2 rounded-full   font-semibold border border-purple-500 shadow-lg hover:bg-purple-700 hover:scale-105 hover:text-white transition-transform duration-300 cursor-pointer">
              <Copy size={10} />
              Share Link
            </span>
          ) : (
            <span className="text-xs text-gray-500 ml-2">
              Only you can view
            </span>
          )}
        </div>
        <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
        <p className="text-xs text-gray-400 mt-2">
          Uploaded {formatDate(file.uploadedAt)}
        </p>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            file.public
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {file.public ? "Public" : "Private"}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => downloadFile(file.id, file.name)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this file?")
              ) {
                deleteFile(file.id);
              }
            }}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyfileGrid;

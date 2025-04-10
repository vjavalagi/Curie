export default function CreateFolderModal({ onCreate, onClose, folderName, setFolderName }) {
  return (
    <div
      className="hs-overlay hs-overlay-open:mt-7 fixed left-0 top-0 z-[60] flex h-full w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50 px-4 py-5 sm:px-6 sm:py-10"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto w-full max-w-md bg-white shadow-lg rounded-xl transition-all duration-300 transform">
        <div className="relative p-6 sm:p-7 flex flex-col gap-4">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-2 right-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Create New Folder</h3>
          </div>

          {/* Input */}
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

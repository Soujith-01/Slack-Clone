import React, { useRef } from "react";
import { Paperclip } from "lucide-react";

function FileTransfer({ selectedFiles = [], onFilesChange }) {
  const fileInputRef = useRef(null);

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    onFilesChange?.((prev) => [...prev, ...files]);
  };

  return (
    <div className="flex flex-col gap-2 pb-1 w-full sm:w-auto">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-full">
          {selectedFiles.map((f, idx) => (
            <div key={idx} className="max-w-[180px] bg-[#0E1114] rounded-xl p-2 text-sm text-[#E7ECF5] border border-[#2A2F3A]">
              <div className="truncate">{f.name}</div>
              <div className="text-xs text-[#9AA4B2]">{Math.round(f.size / 1024)} KB</div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleChooseFile}
        className="w-10 h-10 rounded-2xl bg-[#171A22] hover:bg-[#232734] text-[#9AA4B2] hover:text-[#4F8CFF] flex items-center justify-center transition-all duration-300 shrink-0"
        title="Attach files"
      >
        <Paperclip size={18} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
    </div>
  );
}

export default FileTransfer;

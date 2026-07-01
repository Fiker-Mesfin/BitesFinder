// src/components/MessageBox.jsx
import { X } from "lucide-react";

export default function MessageBox({ text, type = "success", onClose }) {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-md border ${colors[type]} mb-4`}
    >
      <span className="text-sm font-semibold">{text}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-600 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// src/components/small/ConfirmLogout.tsx
"use client";

import { Dispatch, SetStateAction } from "react";

export default function ConfirmLogout({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      className="
        fixed inset-0 z-80 flex items-center justify-center
        bg-black/50
      "
      onClick={onCancel}
    >
      <div
        className="
          bg-white
          w-full max-w-s
          rounded-lg shadow-lg
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4">
          <p className="text-center text-lg font-medium">Izpis?</p>
        </div>
        <div className="flex justify-around px-6 pb-4">
          <button
            onClick={onConfirm}
            className="
              bg-red-600 
              hover:bg-red-700 
              text-white 
              font-medium 
              px-4 
              py-2 
              rounded-md
              transition-colors
            "
          >
            Da
          </button>
          <button
            onClick={onCancel}
            className="
              bg-gray-300 
              hover:bg-gray-400 
              text-gray-800 
              font-medium 
              px-4 
              py-2 
              rounded-md
              transition-colors
            "
          >
            Ne
          </button>
        </div>
      </div>
    </div>
  );
}

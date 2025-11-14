import React, { useState } from "react";

interface PinEntryModalProps {
  onSuccess: () => void;
  onClose: () => void;
  correctPin?: string;
}

const PinEntryModal: React.FC<PinEntryModalProps> = ({
  onSuccess,
  onClose,
  correctPin = "1234",
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPin) {
      setError(null);
      onSuccess();
    } else {
      setError("Incorrect PIN. Try again.");
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
      <form
        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-blue-200"
        onSubmit={handleSubmit}
      >
        <div className="text-2xl font-bold mb-4 text-blue-800">🔒 Parent Access</div>
        <div className="text-sm text-gray-600 mb-4 text-center">
          Enter PIN to access dashboard<br/>
          <span className="text-xs">(Default: 1234)</span>
        </div>
        
        <input
          type="password"
          maxLength={8}
          inputMode="numeric"
          className="border-2 border-blue-200 rounded-xl px-6 py-3 text-2xl text-center mb-4 w-40 focus:border-blue-400 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          placeholder="••••"
        />
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-xl px-8 py-2 font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            Enter
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-200 text-gray-700 rounded-xl px-8 py-2 font-bold text-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 mt-3 text-center bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default PinEntryModal;
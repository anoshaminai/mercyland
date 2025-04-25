import React from 'react';

const EmailSignup: React.FC = () => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-[#4A7F3F]">KEEP UP:</span>
      <input
        type="email"
        className="bg-[#4A7F3F] text-white px-4 py-2 outline-none"
        placeholder="YOUR EMAIL"
      />
      <button className="bg-[#4A7F3F] text-white px-4 py-2">
        SUBMIT
      </button>
    </div>
  );
};

export default EmailSignup; 
import React from 'react';

const EmailSignup: React.FC = () => {
  return (
    <div className="flex justify-center gap-2 items-center">
      <span className="text-mercy-green font-medium">KEEP UP:</span>
      <input
        type="email"
        className="bg-mercy-green text-mercy-white px-4 py-2 outline-none border-mercy-green"
        placeholder="YOUR EMAIL"
      />
      <button className="bg-mercy-green text-mercy-white px-4 py-2">
        SUBMIT
      </button>
    </div>
  );
};

export default EmailSignup;
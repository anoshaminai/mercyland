import React from 'react';

const EmailSignup: React.FC = () => {
  return (
    <div className="flex justify-center items-center bg-mercy-blue border border-mercy-red max-w-[500px] mx-auto">
      <span className="text-mercy-green font-primary px-1 py-1 border-r border-mercy-red text-center min-w-[80px]">KEEP UP:</span>
      <input
        type="email"
        className="bg-mercy-blue text-mercy-white font-primary px-1 py-1 outline-none border-r border-mercy-red w-80"
        placeholder="YOUR EMAIL"
      />
      <button className="bg-mercy-blue text-mercy-green font-primary px-1 py-1 hover:text-mercy-white transition-colors min-w-[80px] text-center">
        SUBMIT
      </button>
    </div>
  );
};

export default EmailSignup;
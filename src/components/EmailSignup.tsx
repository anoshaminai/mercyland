import React from 'react';

const EmailSignup: React.FC = () => {
  return (
    <div className="flex justify-center items-center bg-mercy-blue border border-mercy-red">
      <span className="text-mercy-green font-primary px-3 py-2 border-r border-mercy-red text-center min-w-[100px]">KEEP UP:</span>
      <input
        type="email"
        className="bg-mercy-blue text-mercy-white font-primary px-4 py-2 outline-none border-r border-mercy-red w-96"
        placeholder="YOUR EMAIL"
      />
      <button className="bg-mercy-blue text-mercy-green font-primary px-3 py-2 hover:text-mercy-white transition-colors min-w-[100px] text-center">
        SUBMIT
      </button>
    </div>
  );
};

export default EmailSignup;
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const EmailSignup: React.FC = () => {
  const [state, handleSubmit] = useForm("mldnjygq");

  if (state.succeeded) {
    return (
      <div className="flex justify-center items-center bg-mercy-blue border border-mercy-red max-w-[500px] mx-auto">
        <span className="text-mercy-green font-primary px-4 py-1 text-center">the void will call you soon</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center bg-mercy-blue border border-mercy-red max-w-[500px] mx-auto">
      <span className="text-mercy-green font-primary px-1 py-1 border-r border-mercy-red text-center min-w-[120px]">GET ACCESS:</span>
      <input
        id="email"
        type="email"
        name="email"
        className="bg-mercy-blue text-mercy-white font-primary px-1 py-1 outline-none border-r border-mercy-red w-80"
        placeholder="YOUR EMAIL"
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
        className="text-mercy-red"
      />
      <button 
        type="submit" 
        disabled={state.submitting}
        className="bg-mercy-blue text-mercy-green font-primary px-1 py-1 hover:text-mercy-white transition-colors min-w-[80px] text-center"
      >
        SUBMIT
      </button>
    </form>
  );
};

export default EmailSignup;
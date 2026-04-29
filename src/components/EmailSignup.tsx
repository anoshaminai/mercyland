import { useForm, ValidationError } from '@formspree/react';
import { useEmailField } from '../hooks/useEmailField';

const EmailSignup = () => {
  const [state, handleSubmit] = useForm("mldnjygq");
  const { email, error, suggestion, inputRef, onChange, onSubmit, applySuggestion } =
    useEmailField('', handleSubmit);

  if (state.succeeded) {
    return (
      <div className="flex justify-center items-center bg-mercy-blue border border-mercy-red max-w-[500px] mx-auto">
        <span className="text-mercy-green font-primary px-4 py-1 text-center">the void will call you soon</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 max-w-[500px] mx-auto">
      <form onSubmit={onSubmit} className="flex justify-center items-center bg-mercy-blue border border-mercy-red w-full">
        <span className="text-mercy-green font-primary px-1 py-1 border-r border-mercy-red text-center min-w-[120px]">GET ACCESS:</span>
        <input
          ref={inputRef}
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
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
      {error && (
        <p className="text-mercy-red font-primary text-xs self-start">
          {error}
          {suggestion && (
            <>
              {' — did you mean '}
              <button
                type="button"
                onClick={applySuggestion}
                className="underline text-mercy-green hover:text-mercy-white transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
              ?
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default EmailSignup;

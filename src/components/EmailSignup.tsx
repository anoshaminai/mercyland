import { useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { validateEmail } from '../lib/validate-email';

const EmailSignup = () => {
  const [state, handleSubmit] = useForm("mldnjygq");
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  if (state.succeeded) {
    return (
      <div className="flex justify-center items-center bg-mercy-blue border border-mercy-red max-w-[500px] mx-auto">
        <span className="text-mercy-green font-primary px-4 py-1 text-center">the void will call you soon</span>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const result = validateEmail(email);
    if (!result.ok) {
      e.preventDefault();
      setError(result.reason);
      setSuggestion(result.suggestion ?? null);
      return;
    }
    setError(null);
    setSuggestion(null);
    handleSubmit(e);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setEmail(suggestion);
    setError(null);
    setSuggestion(null);
    inputRef.current?.focus();
  };

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
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
            if (suggestion) setSuggestion(null);
          }}
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

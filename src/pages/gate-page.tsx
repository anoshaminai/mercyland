import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { useChatWorldAccess } from '../hooks/useChatWorldAccess';

export const GatePage = () => {
  const navigate = useNavigate();
  const [, grantAccess] = useChatWorldAccess();
  const [state, handleSubmit] = useForm('mldnjygq');

  useEffect(() => {
    if (state.succeeded) {
      grantAccess();
      const t = window.setTimeout(() => navigate('/chat-world'), 800);
      return () => window.clearTimeout(t);
    }
  }, [state.succeeded, grantAccess, navigate]);

  return (
    <div className="w-screen h-screen bg-mercy-black flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 max-w-[560px] w-full">
        <h1 className="text-mercy-pink font-secondary text-4xl md:text-5xl text-center">
          chat world
        </h1>
        <p className="text-mercy-white font-primary text-sm md:text-base text-center opacity-80">
          leave your email to enter. we'll send rare things.
        </p>

        {state.succeeded ? (
          <div className="flex justify-center items-center bg-mercy-blue border border-mercy-pink max-w-[500px] w-full">
            <span className="text-mercy-pink font-primary px-4 py-2 text-center">
              opening the door...
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex justify-center items-center bg-mercy-blue border border-mercy-pink w-full"
          >
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="YOUR EMAIL"
              className="bg-mercy-blue text-mercy-white font-primary px-3 py-2 outline-none border-r border-mercy-pink flex-1 min-w-0"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-mercy-red px-2"
            />
            <button
              type="submit"
              disabled={state.submitting}
              className="bg-mercy-blue text-mercy-pink font-primary px-4 py-2 hover:text-mercy-white transition-colors disabled:opacity-50"
            >
              ENTER
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/void')}
          className="text-mercy-white/60 font-primary text-xs hover:text-mercy-white transition-colors cursor-pointer"
        >
          ← back to the void
        </button>
      </div>
    </div>
  );
};

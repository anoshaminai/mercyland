import { useRef, useState } from 'react';
import { validateEmail } from '../lib/validate-email';

type Submitter = (e: React.FormEvent<HTMLFormElement>) => void;

export const useEmailField = (initial: string, onValid: Submitter) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
    if (suggestion) setSuggestion(null);
  };

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
    onValid(e);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setEmail(suggestion);
    setError(null);
    setSuggestion(null);
    inputRef.current?.focus();
  };

  return { email, setEmail, error, suggestion, inputRef, onChange, onSubmit, applySuggestion };
};

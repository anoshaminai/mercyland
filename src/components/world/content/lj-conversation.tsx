// Mercy Land — House World: ljConversation content (scene panel · both computer rooms)
// ONE component, fed different messages per scene via props.messageKey ('void' | 'chat') →
// ljMessages[key] (Issue 5). Renders the messages as a simple conversation.

import { ljMessages } from '../../../data/content-registry';

export function LjConversation(props: Record<string, unknown>) {
  const key = typeof props.messageKey === 'string' ? props.messageKey : 'void';
  const messages = ljMessages[key] ?? [];

  return (
    <div className="lj-conversation" aria-label="messages">
      {messages.map((message, i) => (
        <p key={i} className="lj-bubble">
          {message}
        </p>
      ))}
    </div>
  );
}

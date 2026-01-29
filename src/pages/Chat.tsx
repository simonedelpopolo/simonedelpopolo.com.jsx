import { css } from '@nutsloop/neonjsx';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { initOpenRouterChat } from '../scripts/openrouter-chat';

export const Chat = () => {
  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/intel-one-mono.css' );
  /* theme */
  css( './css/theme.css' );
  /* page styles */
  css( './css/pages/chat.css' );

  if ( typeof document !== 'undefined' ) {
    setTimeout( () => {
      initOpenRouterChat();
    }, 0 );
  }

  return (
    <>
      <Header />
      <main class="chat">
        <div class="chat__container">
          <aside class="chat__info">
            <p class="chat__eyebrow">OpenRouter Console</p>
            <h1 class="chat__title">Free Model Chat</h1>
            <p class="chat__intro">
              A lightweight, low-friction chat surface powered by a free OpenRouter model.
              Requests go directly to OpenRouter from the browser.
            </p>
            <p class="chat__intro">
              Model spotlight: Arcee AI Trinity Large Preview, a free-tier reasoning model tuned for quick ideation
              and general Q&A. Learn more in the official release overview.
            </p>
            <a
              class="chat__link"
              href="https://www.arcee.ai/blog/trinity-large"
              target="_blank"
              rel="noopener"
            >
              Arcee AI: Trinity Large Preview
            </a>
            <div class="chat__meta">
              <div class="chat__meta-item">
                <span class="chat__meta-label">Model</span>
                <span class="chat__meta-value">arcee-ai/trinity-large-preview:free</span>
              </div>
              <div class="chat__meta-item">
                <span class="chat__meta-label">Endpoint</span>
                <span class="chat__meta-value">https://openrouter.ai/api/v1/chat/completions</span>
              </div>
            </div>
            <div class="chat__tips">
              <div class="chat__tip">
                <span class="chat__tip-label">Tip</span>
                <span class="chat__tip-text">Press Enter to send, Shift + Enter for a new line.</span>
              </div>
              <div class="chat__tip">
                <span class="chat__tip-label">Hint</span>
                <span class="chat__tip-text">Keep prompts specific to get tighter answers.</span>
              </div>
              <div class="chat__tip">
                <span class="chat__tip-label">Security</span>
                <span class="chat__tip-text">Your API key stays in your browser storage. Treat it as sensitive.</span>
              </div>
              <div class="chat__tip">
                <span class="chat__tip-label">Required</span>
                <span class="chat__tip-text">An OpenRouter API key is required to send messages.</span>
              </div>
            </div>
          </aside>

          <section
            class="chat__panel"
            data-openrouter-chat
            data-chat-endpoint="https://openrouter.ai/api/v1/chat/completions"
            data-chat-model="arcee-ai/trinity-large-preview:free"
            data-chat-reasoning="true"
            data-chat-stream="true"
          >
            <div class="chat__window" role="log" aria-live="polite" aria-relevant="additions text">
              <div class="chat__empty" data-chat-empty>
                Start a conversation to see responses here.
              </div>
            </div>

            <form class="chat__form" autocomplete="off">
              <label class="chat__label" for="chat-key">OpenRouter API key</label>
              <input
                id="chat-key"
                name="apiKey"
                class="chat__key"
                type="password"
                placeholder="sk-or-..."
                autocomplete="off"
              />
              <div class="chat__hint">Stored locally in this browser to enable direct requests.</div>
              <div class="chat__memory">
                <div class="chat__memory-group">
                  <label class="chat__label" for="chat-history-user">Prompt history</label>
                  <select id="chat-history-user" class="chat__select" data-chat-history="user">
                    <option value="">Prompt history</option>
                  </select>
                </div>
                <div class="chat__memory-group">
                  <label class="chat__label" for="chat-history-assistant">Response history</label>
                  <select id="chat-history-assistant" class="chat__select" data-chat-history="assistant">
                    <option value="">Response history</option>
                  </select>
                </div>
              </div>
              <div class="chat__memory-preview" data-chat-preview hidden></div>
              <label class="chat__label" for="chat-input">Message</label>
              <textarea
                id="chat-input"
                name="prompt"
                class="chat__input"
                rows="2"
                placeholder="Ask something precise..."
                required
              />
              <div class="chat__controls">
                <div class="chat__status" data-chat-status></div>
                <div class="chat__buttons">
                  <button class="chat__clear" type="button" data-chat-clear>Clear</button>
                  <button class="chat__send" type="submit">Send</button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

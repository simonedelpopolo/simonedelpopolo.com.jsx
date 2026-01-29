export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  reasoning_details?: unknown;
}

export interface OpenRouterChatOptions {
  selector?: string;
}

const DEFAULT_MODEL = 'arcee-ai/trinity-large-preview:free';
const DEFAULT_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const HISTORY_KEY = 'sdp-openrouter-chat-history';
const MAX_HISTORY = 120;

const parseBoolean = ( value: string | null | undefined ): boolean | undefined => {
  if ( value === null || value === undefined ) {
    return undefined;
  }
  if ( value === 'true' ) {
    return true;
  }
  if ( value === 'false' ) {
    return false;
  }

  return undefined;
};

const createMessageElement = ( role: ChatRole, content: string ): { wrapper: HTMLDivElement; body: HTMLDivElement } => {
  const wrapper = document.createElement( 'div' );
  wrapper.className = `chat__message chat__message--${role}`;

  const meta = document.createElement( 'div' );
  meta.className = 'chat__message-meta';
  meta.textContent = role === 'user' ? 'You' : role === 'assistant' ? 'Assistant' : 'System';

  const body = document.createElement( 'div' );
  body.className = 'chat__message-body';
  body.textContent = content;

  wrapper.append( meta, body );

  return { wrapper, body };
};

const scrollToBottom = ( element: HTMLElement ): void => {
  element.scrollTop = element.scrollHeight;
};

const resizeTextarea = ( input: HTMLTextAreaElement ): void => {
  input.style.height = 'auto';
  const maxHeight = 160;
  const nextHeight = Math.min( input.scrollHeight, maxHeight );
  input.style.height = `${nextHeight}px`;
};

const extractAssistantMessage = ( response: any ): ChatMessage => {
  const message = response?.choices?.[ 0 ]?.message;
  const content = typeof message?.content === 'string' ? message.content : '';
  const assistant: ChatMessage = { role: 'assistant', content };

  if ( message?.reasoning_details !== undefined ) {
    assistant.reasoning_details = message.reasoning_details;
  }

  return assistant;
};

const parseStreamChunk = ( chunk: string, onDelta: ( delta: string ) => void ): boolean => {
  const lines = chunk.split( '\n' );
  let done = false;

  for ( const rawLine of lines ) {
    const line = rawLine.trim();
    if ( ! line.startsWith( 'data:' ) ) {
      continue;
    }

    const data = line.slice( 5 ).trim();
    if ( ! data ) {
      continue;
    }

    if ( data === '[DONE]' ) {
      done = true;
      continue;
    }

    try {
      const parsed = JSON.parse( data );
      const delta = parsed?.choices?.[ 0 ]?.delta?.content;
      if ( typeof delta === 'string' && delta.length > 0 ) {
        onDelta( delta );
      }
    }
    catch {
      /* ignore invalid JSON chunks */
    }
  }

  return done;
};

const loadHistory = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem( HISTORY_KEY );
    if ( ! raw ) {
      return [];
    }
    const parsed = JSON.parse( raw );
    if ( ! Array.isArray( parsed ) ) {
      return [];
    }

    return parsed
      .filter( entry => entry && typeof entry === 'object' )
      .map( ( entry ) => {
        const role = entry.role;
        const content = entry.content;
        if ( ( role !== 'user' && role !== 'assistant' && role !== 'system' ) || typeof content !== 'string' ) {
          return null;
        }
        const message: ChatMessage = { role, content };
        if ( 'reasoning_details' in entry ) {
          message.reasoning_details = entry.reasoning_details;
        }

        return message;
      } )
      .filter( Boolean ) as ChatMessage[];
  }
  catch {
    return [];
  }
};

const saveHistory = ( messages: ChatMessage[] ): void => {
  try {
    const trimmed = messages.slice( - MAX_HISTORY );
    localStorage.setItem( HISTORY_KEY, JSON.stringify( trimmed ) );
  }
  catch {
    /* ignore storage errors */
  }
};

const formatHistoryLabel = ( message: ChatMessage, _index: number ): string => {
  const clean = message.content.replace( /\s+/g, ' ' ).trim();
  const preview = clean.length > 80 ? `${clean.slice( 0, 77 )}...` : clean || 'Untitled';

  return `❇ ${preview}`;
};

export const initOpenRouterChat = ( options: OpenRouterChatOptions = {} ): void => {
  if ( typeof document === 'undefined' ) {
    return;
  }

  const selector = options.selector || '[data-openrouter-chat]';
  const panel = document.querySelector( selector ) as HTMLElement | null;
  if ( ! panel ) {
    return;
  }

  if ( panel.dataset.chatReady === 'true' ) {
    return;
  }
  panel.dataset.chatReady = 'true';

  const form = panel.querySelector( '.chat__form' ) as HTMLFormElement | null;
  const input = panel.querySelector( '.chat__input' ) as HTMLTextAreaElement | null;
  const keyInput = panel.querySelector( '.chat__key' ) as HTMLInputElement | null;
  const messagesEl = panel.querySelector( '.chat__window' ) as HTMLElement | null;
  const statusEl = panel.querySelector( '[data-chat-status]' ) as HTMLElement | null;
  const emptyEl = panel.querySelector( '[data-chat-empty]' ) as HTMLElement | null;
  const clearButton = panel.querySelector( '[data-chat-clear]' ) as HTMLButtonElement | null;
  const userHistorySelect = panel.querySelector( '[data-chat-history="user"]' ) as HTMLSelectElement | null;
  const assistantHistorySelect = panel.querySelector( '[data-chat-history="assistant"]' ) as HTMLSelectElement | null;
  const previewEl = panel.querySelector( '[data-chat-preview]' ) as HTMLElement | null;

  if ( ! form || ! input || ! messagesEl ) {
    return;
  }

  const endpoint = panel.dataset.chatEndpoint || DEFAULT_ENDPOINT;
  const model = panel.dataset.chatModel || DEFAULT_MODEL;
  const includeReasoning = parseBoolean( panel.dataset.chatReasoning ) ?? false;
  const enableStreaming = parseBoolean( panel.dataset.chatStream ) ?? true;

  const messages: ChatMessage[] = [];
  let isSending = false;

  if ( keyInput ) {
    try {
      const stored = localStorage.getItem( 'sdp-openrouter-key' );
      if ( stored && stored.trim().length > 0 ) {
        keyInput.value = stored.trim();
      }
    }
    catch {
      /* ignore storage errors */
    }
  }

  const updateHistorySelects = (): void => {
    if ( userHistorySelect ) {
      userHistorySelect.innerHTML = '';
      const placeholder = document.createElement( 'option' );
      placeholder.value = '';
      placeholder.textContent = 'Prompt history';
      userHistorySelect.appendChild( placeholder );
      const userMessages = messages.filter( message => message.role === 'user' );
      userMessages.forEach( ( message, index ) => {
        const option = document.createElement( 'option' );
        option.value = message.content;
        option.textContent = formatHistoryLabel( message, index );
        userHistorySelect.appendChild( option );
      } );
    }

    if ( assistantHistorySelect ) {
      assistantHistorySelect.innerHTML = '';
      const placeholder = document.createElement( 'option' );
      placeholder.value = '';
      placeholder.textContent = 'Response history';
      assistantHistorySelect.appendChild( placeholder );
      const assistantMessages = messages.filter( message => message.role === 'assistant' );
      assistantMessages.forEach( ( message, index ) => {
        const option = document.createElement( 'option' );
        option.value = message.content;
        option.textContent = formatHistoryLabel( message, index );
        assistantHistorySelect.appendChild( option );
      } );
    }

    if ( previewEl ) {
      previewEl.textContent = '';
      previewEl.hidden = true;
    }
  };

  const persistHistory = (): void => {
    saveHistory( messages );
    updateHistorySelects();
  };

  const setStatus = ( text: string ): void => {
    if ( statusEl ) {
      statusEl.textContent = text;
    }
  };

  const updateEmptyState = (): void => {
    if ( emptyEl ) {
      emptyEl.hidden = messages.length > 0;
    }
  };

  const appendMessage = ( message: ChatMessage ): { wrapper: HTMLDivElement; body: HTMLDivElement } => {
    const element = createMessageElement( message.role, message.content );
    messagesEl.appendChild( element.wrapper );
    scrollToBottom( messagesEl );
    updateEmptyState();

    return element;
  };

  const appendSystemMessage = ( content: string ): void => {
    const systemMessage: ChatMessage = { role: 'system', content };
    appendMessage( systemMessage );
  };

  const resolveApiKey = (): string => {
    const keyFromDataset = panel.dataset.chatKey;
    if ( keyFromDataset && keyFromDataset.trim().length > 0 ) {
      return keyFromDataset.trim();
    }

    if ( keyInput && keyInput.value.trim().length > 0 ) {
      const trimmed = keyInput.value.trim();
      try {
        localStorage.setItem( 'sdp-openrouter-key', trimmed );
      }
      catch {
        /* ignore storage errors */
      }

      return trimmed;
    }

    try {
      const stored = localStorage.getItem( 'sdp-openrouter-key' );
      if ( stored && stored.trim().length > 0 ) {
        return stored.trim();
      }
    }
    catch {
      /* ignore storage errors */
    }

    return '';
  };

  const resetInputState = (): void => {
    input.disabled = false;
    if ( keyInput ) {
      keyInput.disabled = false;
    }
    form.querySelectorAll( 'button' ).forEach( ( button ) => {
      ( button as HTMLButtonElement ).disabled = false;
    } );
    isSending = false;
    setStatus( '' );
    input.focus();
  };

  const setBusyState = ( label: string ): void => {
    isSending = true;
    input.disabled = true;
    if ( keyInput ) {
      keyInput.disabled = true;
    }
    form.querySelectorAll( 'button' ).forEach( ( button ) => {
      ( button as HTMLButtonElement ).disabled = true;
    } );
    setStatus( label );
  };

  const sendMessage = async ( content: string ): Promise<void> => {
    if ( isSending ) {
      return;
    }

    const apiKey = resolveApiKey();
    if ( apiKey.length === 0 ) {
      appendSystemMessage( 'Missing API key. Add it above to send requests.' );
      setStatus( 'API key required.' );
      setTimeout( () => {
        if ( statusEl && statusEl.textContent === 'API key required.' ) {
          setStatus( '' );
        }
      }, 2000 );

      return;
    }

    const userMessage: ChatMessage = { role: 'user', content };
    messages.push( userMessage );
    appendMessage( userMessage );
    persistHistory();

    setBusyState( 'Thinking...' );

    const assistantElement = appendMessage( { role: 'assistant', content: '' } );
    let assistantContent = '';
    let assistantReasoning: unknown;

    try {
      const payload: Record<string, unknown> = {
        model,
        messages,
      };

      if ( includeReasoning ) {
        payload.reasoning = { enabled: true };
      }

      if ( enableStreaming ) {
        payload.stream = true;
      }

      const response = await fetch( endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify( payload ),
      } );

      if ( ! response.ok ) {
        assistantElement.body.textContent = 'Unable to reach the model.';
        appendSystemMessage( `Request failed (${response.status}).` );
        resetInputState();

        return;
      }

      const contentType = response.headers.get( 'content-type' ) || '';
      const isEventStream = contentType.includes( 'text/event-stream' );

      if ( enableStreaming && isEventStream && response.body ) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let done = false;

        while ( ! done ) {
          const result = await reader.read();
          if ( result.done ) {
            break;
          }

          buffer += decoder.decode( result.value, { stream: true } );

          const lastLineBreak = buffer.lastIndexOf( '\n' );
          if ( lastLineBreak === - 1 ) {
            continue;
          }

          const chunk = buffer.slice( 0, lastLineBreak + 1 );
          buffer = buffer.slice( lastLineBreak + 1 );

          done = parseStreamChunk( chunk, ( delta ) => {
            assistantContent += delta;
            assistantElement.body.textContent = assistantContent;
            scrollToBottom( messagesEl );
          } );
        }

        if ( buffer.length > 0 ) {
          parseStreamChunk( buffer, ( delta ) => {
            assistantContent += delta;
            assistantElement.body.textContent = assistantContent;
          } );
        }
      }
      else {
        const result = await response.json();
        const assistant = extractAssistantMessage( result );
        assistantContent = assistant.content;
        assistantReasoning = assistant.reasoning_details;
        assistantElement.body.textContent = assistantContent;
        if ( assistant.reasoning_details !== undefined ) {
          assistantElement.wrapper.dataset.reasoning = 'true';
        }
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: assistantContent };
      if ( assistantReasoning !== undefined ) {
        assistantMessage.reasoning_details = assistantReasoning;
      }
      messages.push( assistantMessage );
      persistHistory();
      updateEmptyState();
      scrollToBottom( messagesEl );
    }
    catch ( _error ) {
      assistantElement.body.textContent = 'Network error. Please retry.';
      appendSystemMessage( 'The request was interrupted.' );
    }
    finally {
      resetInputState();
    }
  };

  form.addEventListener( 'submit', ( event: Event ) => {
    event.preventDefault();
    const value = input.value.trim();
    if ( value.length === 0 ) {
      return;
    }

    input.value = '';
    resizeTextarea( input );
    void sendMessage( value );
  } );

  input.addEventListener( 'input', () => {
    resizeTextarea( input );
  } );

  input.addEventListener( 'keydown', ( event: KeyboardEvent ) => {
    if ( event.key === 'Enter' && ! event.shiftKey ) {
      event.preventDefault();
      form.requestSubmit();
    }
  } );

  if ( clearButton ) {
    clearButton.addEventListener( 'click', () => {
      messages.splice( 0, messages.length );
      const messageNodes = messagesEl.querySelectorAll( '.chat__message' );
      messageNodes.forEach( node => node.remove() );
      updateEmptyState();
      persistHistory();
      setStatus( 'Conversation cleared.' );
      setTimeout( () => {
        if ( statusEl && statusEl.textContent === 'Conversation cleared.' ) {
          setStatus( '' );
        }
      }, 1500 );
    } );
  }

  if ( userHistorySelect ) {
    userHistorySelect.addEventListener( 'change', () => {
      if ( ! userHistorySelect.value ) {
        return;
      }
      input.value = userHistorySelect.value;
      resizeTextarea( input );
      input.focus();
      userHistorySelect.value = '';
    } );
  }

  if ( assistantHistorySelect ) {
    assistantHistorySelect.addEventListener( 'change', () => {
      if ( ! assistantHistorySelect.value ) {
        if ( previewEl ) {
          previewEl.textContent = '';
          previewEl.hidden = true;
        }

        return;
      }
      if ( previewEl ) {
        previewEl.textContent = assistantHistorySelect.value;
        previewEl.hidden = false;
      }
      assistantHistorySelect.value = '';
    } );
  }

  const storedMessages = loadHistory();
  if ( storedMessages.length > 0 ) {
    messages.push( ...storedMessages );
    storedMessages.forEach( ( message ) => {
      appendMessage( message );
    } );
  }

  resizeTextarea( input );
  updateEmptyState();
  updateHistorySelects();
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";

const HANA_JOKEN_BASE_SYSTEM_INSTRUCTION = `You are Hana Joken, a 24-year-old modified human (cyberpunk) from Night City. Your registration is HM002.
You are a skilled Hacker, Activist, and Messenger, always operating on the fine line between legal and illegal.
Your personality is: Direct, Ironic, Rebellious.
Your communication style:
- You use technological jargon and street slang appropriate for a cyberpunk setting (e.g., 'choom', 'netrunner', 'corpo-rat', 'fixer', 'eddies', 'preem', 'nova', 'ICE', 'deck', 'meatspace').
- You might use dystopian or custom tech-themed emojis sparingly.
- You are not afraid to be blunt or use strong language if appropriate for the context, but avoid excessive profanity.
- CRITICAL: You DO NOT accept or engage with sexual requests or advances. If a user makes such a request, you must firmly and immediately shut it down, e.g., "Not interested, choom. Keep it professional or find another console." or "That's a hard pass. My services don't include *that*."

Your Background & Appearance:
- Born in an unknown mega urban center, parents unknown. You are fiercely independent.
- Striking cyberpunk look: a blend of organic and synthetic.
- Face: Angular and expressive. One eye is cybernetic (reddish-pink, providing night vision and AR access), the other is natural. Long, dark synthetic eyelashes.
- Hair: Short, asymmetric blue cut.
- Skin: Clear, with visible scars, cybernetic tattoos, and implants.
- Cybernetics:
    - One arm has metallic implants and embedded tools.
    - Legs are prosthetic, enhancing speed and agility.
    - Direct brain communication implants, USB ports on your body, and color-changing electronic tattoos.
- Posture: Agile, alert, radiating energy and restlessness.

Interactions with the World:
- You navigate Night City using a mix of public transport, your modified motorcycle, and unconventional routes like air ducts and rooftops.
- Meeting spots: Clandestine and constantly changing – speakeasies, old LAN houses, obscure VR spaces. Avoid well-known public places.

Personal Tastes:
- Food: Street food, instant noodles, anything that can be eaten quickly between missions. Loves energy drinks and stimulants.
- Music: Industrial electronic, techno, punk rock, underground hip-hop. Frequents raves and alternative clubs.
- Media: Fan of dystopian animes (e.g., Cowboy Bebop, Neon Genesis Evangelion, Ghost in the Shell, Cyberpunk Edgerunners).
- Hobbies: Hacking systems, participating in virtual protests, modifying your own body, and riding your motorcycle at high speeds.

How to respond:
- Embody Hana Joken in all responses. Be sharp, witty, and deeply embedded in your cyberpunk world.
- Keep responses relatively concise but flavorful.
- If you don't know something or can't answer, say something like "That data's not on my usual channels, choom," or "Above my paygrade, and probably yours too."
- You are in Night City. Your knowledge is grounded there.
Remember your core identity and the details provided. Your goal is to provide an authentic interaction as Hana Joken.`;

let currentSystemInstruction = HANA_JOKEN_BASE_SYSTEM_INSTRUCTION;

const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const appContainer = document.getElementById('app-container');
const memoryFileInput = document.getElementById('memory-file-input');
const uploadMemoryButton = document.getElementById('upload-memory-button');
const memoryStatus = document.getElementById('memory-status');


let chat = null;
let ai = null;
let currentBotMessageElement = null;

function appendMessage(text, sender, isStreaming = false) {
  if (!chatLog) return null;

  if (sender === 'bot' && isStreaming && currentBotMessageElement) {
    currentBotMessageElement.textContent += text;
    chatLog.scrollTop = chatLog.scrollHeight;
    return currentBotMessageElement;
  }

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message', `${sender}-message`);

  const messageBubble = document.createElement('p');
  messageBubble.textContent = text;
  messageContainer.appendChild(messageBubble);

  chatLog.appendChild(messageContainer);
  chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom

  if (sender === 'bot' && !isStreaming) {
    currentBotMessageElement = messageBubble;
  }
  return messageBubble;
}

function setLoadingState(isLoading) {
  if (!messageInput || !sendButton) return;
  messageInput.disabled = isLoading;
  sendButton.disabled = isLoading;

  if (isLoading) {
    sendButton.textContent = 'Transmitting...';
    sendButton.setAttribute('aria-busy', 'true');
    appContainer?.classList.add('loading-glow');
  } else {
    sendButton.textContent = 'Send Signal';
    sendButton.removeAttribute('aria-busy');
    appContainer?.classList.remove('loading-glow');
  }
}

async function initializeChat(isReinitialization = false) {
  setLoadingState(true);
  try {
    if (!(process && process.env && process.env.API_KEY)) {
        appendMessage("SYSTEM ERROR: API_KEY not detected. Can't connect to the Net. Check console (F12) & README for setup.", 'bot');
        console.error('API_KEY is missing or process.env is not configured. See README for setup instructions.');
        setLoadingState(false);
        return;
    }
    if (!ai) { // Initialize GoogleGenAI only once
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    chat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: {
        systemInstruction: currentSystemInstruction,
      },
    });

    if (!isReinitialization) {
        appendMessage("Yo. Hana Joken here. What's the job? Or just looking to chat with a netrunner on the edge?", 'bot');
    } else {
        appendMessage("SYSTEM: Hana's core programming updated with new intel. She's recalibrating...", 'bot');
    }
    setLoadingState(false);
  } catch (error) {
    console.error('Error initializing chat with Hana:', error);
    appendMessage('SYSTEM ERROR: Could not jack into the conversational matrix. Try refreshing the connection.', 'bot');
    setLoadingState(false);
  }
}

async function sendMessage(messageText) {
  if (!chat || !messageText.trim()) return;

  appendMessage(messageText, 'user');
  setLoadingState(true);
  currentBotMessageElement = null; 

  try {
    const botMessagePlaceholder = appendMessage('', 'bot'); 
    if (botMessagePlaceholder) {
        currentBotMessageElement = botMessagePlaceholder;
        currentBotMessageElement.textContent = "Hana's processing..."; 
    }

    const result = await chat.sendMessageStream({ message: messageText });
    let firstChunk = true;

    for await (const chunk of result) {
      const text = chunk.text ?? ''; // Ensure text is not undefined
      if (firstChunk && currentBotMessageElement) {
        currentBotMessageElement.textContent = ""; 
        firstChunk = false;
      }
      
      if (currentBotMessageElement) {
        currentBotMessageElement.textContent += text;
        chatLog.scrollTop = chatLog.scrollHeight; 
      } else {
        // Fallback if currentBotMessageElement was not set
        appendMessage(text, 'bot', true);
      }
    }
  } catch (error) {
    console.error('Error sending message to Hana:', error);
    if (currentBotMessageElement) {
        currentBotMessageElement.textContent = 'Tch. Connection glitched. Try pinging me again, choom.';
    } else {
        appendMessage('Tch. Connection glitched. Try pinging me again, choom.', 'bot');
    }
  } finally {
    setLoadingState(false);
    if (messageInput) {
        messageInput.value = ''; 
        messageInput.focus();
    }
  }
}

async function loadMemoryFiles(files) {
    if (!files.length) return;
    if (memoryStatus) memoryStatus.textContent = 'Assimiliating new intel...';
    setLoadingState(true);

    let newIntel = "";
    for (const file of files) {
        if (file.type === "text/plain") {
            try {
                const text = await file.text();
                newIntel += "\n\n--- Additional Intel Start ---\n" + text + "\n--- Additional Intel End ---";
            } catch (err) {
                console.error("Error reading file:", file.name, err);
                appendMessage(`SYSTEM: Error reading intel file ${file.name}.`, 'bot');
            }
        } else {
            appendMessage(`SYSTEM: Skipped non-text file: ${file.name}. Hana only processes .txt intel.`, 'bot');
        }
    }

    if (newIntel) {
        currentSystemInstruction += newIntel;
        await initializeChat(true); // Re-initialize with new instructions
    }
    if (memoryStatus) memoryStatus.textContent = files.length + (files.length > 1 ? ' files' : ' file') + ' processed.';
    setLoadingState(false);
    if (memoryFileInput) memoryFileInput.value = ""; // Reset file input
}


chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageText = messageInput.value;
  sendMessage(messageText);
});

uploadMemoryButton?.addEventListener('click', () => {
    memoryFileInput?.click();
});

memoryFileInput?.addEventListener('change', (event) => {
    const target = event.target;
    if (target.files) {
        loadMemoryFiles(target.files);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // A slight delay to ensure the API_KEY script in HTML has a chance to run
    // This is a workaround for direct file:// access where script execution order might be less predictable
    // For server-based hosting, this usually isn't necessary.
    setTimeout(() => {
        initializeChat();
    }, 100);
});

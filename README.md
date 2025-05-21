# Chat with Hana Joken - Cyberpunk AI Messenger

## Description

This web application allows you to chat with Hana Joken, a rebellious cyberpunk netrunner from Night City. She has a distinct personality, a detailed backstory, and a unique way of communicating, all powered by the Google Gemini API. You can also upload `.txt` files to provide Hana with additional "intel" or memories, dynamically influencing her responses.

## Features

-   **Interactive Chat Interface:** Clean and responsive cyberpunk-themed UI.
-   **AI Persona:** Chat with Hana Joken, an AI with a pre-defined cyberpunk personality and backstory.
-   **Streaming Responses:** Messages from Hana are streamed in real-time for a more dynamic conversation.
-   **Cyberpunk Aesthetics:** The UI is styled with a dark, neon-accented cyberpunk theme, including a custom avatar for Hana and a glowing effect on the chat window when she's "thinking."
-   **Loadable Memory:** Upload `.txt` files to expand Hana's knowledge base/memory dynamically during a session.
-   **Uses Google Gemini API:** Leverages the `gemini-2.5-flash-preview-04-17` model for chat.

## Prerequisites

-   A modern web browser (Chrome, Firefox, Edge, Safari).
-   A Google Gemini API Key.

## Project Files

-   `index.html`: The main HTML structure of the chat application. Contains a script for API Key setup for local testing.
-   `index.css`: Styles for the application, defining the cyberpunk theme.
-   `index.js`: JavaScript code containing the application logic, Gemini API integration, and Hana's persona definition.
-   `metadata.json`: Basic metadata for the application.

## Setup and Installation

1.  **Get the Files:**
    Ensure you have all the project files (`index.html`, `index.css`, `index.js`, `metadata.json`) in a single directory on your local machine.

2.  **Obtain a Google Gemini API Key:**
    If you don't have one, visit the [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key.

3.  **Setting up the API Key (Crucial for Local Testing):**
    This application **requires** your Google Gemini API Key to be accessible as `process.env.API_KEY` within the JavaScript execution environment of your browser. The application code (`index.js`) directly references `process.env.API_KEY` and will display an error and fail to initialize if it's not found.

    **For local development (opening `index.html` directly in a browser):**
    You **must** edit the `index.html` file to provide your API key.
    *   Open `index.html` in a text editor.
    *   Locate the `<script>` block in the `<head>` section designed for API key setup. It looks like this:
        ```html
        <script>
          console.log('Attempting to set up mock process.env for local testing...');
          window.process = window.process || {};
          window.process.env = window.process.env || {};
          
          // --- REPLACE THE LINE BELOW WITH YOUR ACTUAL API KEY ---
          window.process.env.API_KEY = "YOUR_ACTUAL_GEMINI_API_KEY"; 
          // --- --- ---------------------------------------- --- ---

          // ... (rest of the script) ...
        </script>
        ```
    *   **Replace `"YOUR_ACTUAL_GEMINI_API_KEY"` with your actual Google Gemini API key.**
    *   Save the `index.html` file.

    The application's `index.js` file checks for `process.env.API_KEY` upon initialization and will display a "SYSTEM ERROR: API_KEY not detected..." message in the chat if it's missing or if the placeholder is still present.

## Running the Application

1.  **Configure API Key:** Ensure you have edited `index.html` and set your API key as described above.
2.  **Open `index.html` in your Browser:**
    You can usually open the `index.html` file directly in your web browser (e.g., by double-clicking it or using "File > Open").
    *   **Using a Local Server (Alternative for better behavior):**
        For more consistent behavior, especially with ES modules, serving files through a local web server is good practice.
        *   **Using Python (if installed):**
            Open your terminal, navigate to the project directory, and run:
            `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2)
            Then open `http://localhost:8000` (or the port shown) in your browser.
        *   **Using Node.js `live-server` (if Node.js/npm is installed):**
            Install globally: `npm install -g live-server`
            In the project directory, run: `live-server`
            This usually opens the app in your browser.

4.  **Chat with Hana:**
    Once the page loads correctly and the API key is detected, Hana Joken will greet you. Type your message in the input field and press Enter or click "Send Signal" to chat. 
## Loading Additional Intel (Memory Files)

You can enhance Hana's knowledge and conversational context during a session by uploading text files (`.txt`).

1.  **Locate the "Upload Intel (.txt)" Button:** This button is in the footer of the chat application.
2.  **Click the Button:** This will open a file dialog.
3.  **Select Files:** Choose one or more `.txt` files from your computer.
4.  **Assimilation:** The content of each selected `.txt` file will be read and appended to Hana's current system instruction.
5.  **Confirmation:**
    *   A status message in the footer will indicate that files are being processed.
    *   A message like "SYSTEM: Hana's core programming updated with new intel..." will appear in the chat log.
6.  **Chat with Updated Hana:** Hana's subsequent responses will now be influenced by the content of the uploaded files.

This feature allows you to provide specific context, stories, or data to Hana on the fly, making the interaction more dynamic and tailored.

## Technology Stack

-   **Frontend:** HTML5, CSS3, JavaScript (ESModules)
-   **AI:** Google Gemini API (`gemini-2.5-flash-preview-04-17` model) via `@google/genai` SDK
-   **ESM Delivery:** Using `esm.sh` for importing the `@google/genai` module directly in the browser.
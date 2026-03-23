# Gemini API Playground

A very small localhosted Gemini playground for testing text prompts in the browser.

It uses:

- Plain HTML
- Plain CSS
- Vanilla JavaScript
- [Vite](https://vite.dev/) as the tiny local static dev server
- The official [`@google/genai`](https://www.npmjs.com/package/@google/genai) JavaScript SDK

## Features

- Single-page app
- Prompt textarea
- Optional system instruction textarea
- API key input stored in `localStorage`
- Send and Clear buttons
- Read-only response output
- Small status line for `idle`, `loading`, `success`, and `error`
- Minimal responsive dark UI

## Files

- `index.html` - page structure
- `style.css` - minimal styling
- `app.js` - UI logic and Gemini API call
- `package.json` - npm scripts and dependencies
- `README.md` - setup instructions

## Requirements

- Node.js 20 or newer
- A Gemini API key from Google AI Studio

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## How to use

1. Paste your Gemini API key into the `API Key` field.
2. Enter a prompt.
3. Optionally enter a system instruction.
4. Click `Send`.

The app sends your prompt using `gemini-2.5-flash-lite` with this prompt pattern:

```text
Translate the following into Japanese, following the same tone and style as the original:

<user text>
```

If you provide a system instruction, it is passed through the SDK config as `systemInstruction` instead of being concatenated into the user prompt.

## Development note

The API call is intentionally isolated inside `generateText()` in `app.js` so it is easy to move that logic into a backend later.

For a future environment-based setup with Vite, one simple option would be to replace the localStorage lookup with something like:

```js
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

That is still not suitable for production if the value is exposed to browser code, but it makes local configuration cleaner.

## Production caveat

This project calls Gemini directly from the browser for local testing convenience.

Do not use this approach for a real production app. Browser apps expose API keys to end users. In production, move the Gemini request into a backend or serverless function and keep the API key on the server.

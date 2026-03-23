import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash-lite";
const STORAGE_KEY = "gemini-playground-api-key";
const EXAMPLE_KEY = "gemini-playground-example-loaded";
const DEFAULT_OUTPUT = "Response will appear here.";

const apiKeyInput = document.querySelector("#apiKey");
const systemInstructionInput = document.querySelector("#systemInstruction");
const promptInput = document.querySelector("#prompt");
const sendButton = document.querySelector("#sendButton");
const clearButton = document.querySelector("#clearButton");
const statusLine = document.querySelector("#status");
const output = document.querySelector("#output");

loadInitialState();

apiKeyInput.addEventListener("input", () => {
  localStorage.setItem(STORAGE_KEY, apiKeyInput.value.trim());
});

sendButton.addEventListener("click", handleSend);
clearButton.addEventListener("click", handleClear);

function loadInitialState() {
  apiKeyInput.value = localStorage.getItem(STORAGE_KEY) ?? "";

  if (!localStorage.getItem(EXAMPLE_KEY)) {
    promptInput.value =
      "I missed your call earlier, but I can stop by after work if that still helps.";
    systemInstructionInput.value =
      "Preserve the original tone, keep the translation natural, and avoid adding explanations.";
    localStorage.setItem(EXAMPLE_KEY, "true");
  }

  setStatus("idle", "Idle");
}

async function handleSend() {
  const apiKey = apiKeyInput.value.trim();
  const userText = promptInput.value.trim();
  const systemInstruction = systemInstructionInput.value.trim();

  if (!apiKey) {
    setStatus("error", "Error: API key is required.");
    output.textContent = "Please enter your Gemini API key.";
    return;
  }

  if (!userText) {
    setStatus("error", "Error: Prompt is required.");
    output.textContent = "Please enter a prompt before sending.";
    return;
  }

  setLoadingState(true);
  setStatus("loading", "Loading...");
  output.textContent = "Waiting for Gemini response...";

  try {
    const responseText = await generateText({
      apiKey,
      userText,
      systemInstruction
    });

    output.textContent = responseText || "(No text returned)";
    setStatus("success", "Success");
  } catch (error) {
    output.textContent = extractErrorMessage(error);
    setStatus("error", "Error");
  } finally {
    setLoadingState(false);
  }
}

function handleClear() {
  systemInstructionInput.value = "";
  promptInput.value = "";
  output.textContent = DEFAULT_OUTPUT;
  setStatus("idle", "Idle");
}

function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  sendButton.textContent = isLoading ? "Sending..." : "Send";
}

function setStatus(type, message) {
  statusLine.textContent = message;
  statusLine.className = `status status-${type}`;
}

function buildUserPrompt(userText) {
  return `Translate the following into Japanese, following the same tone and style as the original:\n\n${userText}`;
}

async function generateText({ apiKey, userText, systemInstruction }) {
  // Local testing only: browser-exposed API keys are not suitable for production.
  // Later, move this function into a backend or serverless endpoint.
  const ai = new GoogleGenAI({ apiKey });

  // If you later prefer environment-based local configuration in Vite,
  // you could replace the localStorage-based API key usage with:
  // const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: buildUserPrompt(userText),
    config: systemInstruction
      ? {
          systemInstruction
        }
      : undefined
  });

  return response.text ?? "";
}

function extractErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return `Request failed: ${error.message}`;
  }

  return "Request failed: An unknown error occurred.";
}

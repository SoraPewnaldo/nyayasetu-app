# NyayaSetu -- Final AI Tech Stack (On-Device, 3B Model)

## Architecture Overview

NyayaSetu is designed as a fully privacy-first, on-device AI legal
assistant. The system runs entirely in the browser using
WebGPU/WASM-based inference. No cloud APIs. No backend server. Zero
external data transmission.

---

# 1. Frontend Layer

- React.js (SPA architecture)
- Vite (Build tool & dev server)
- React Router v6
- Tailwind CSS
- Lucide React (icons)

---

# 2. Core AI Model Layer

## Primary LLM (On-Device)

- Phi-3 Mini (3B parameters, Quantized Q4) OR
- Llama 3 3B Instruct (Quantized GGUF Q4)

Format: - GGUF (for efficient inference) - Quantized (Q4_K_M
recommended)

Why 3B? - Optimized for 8--16GB RAM systems - Fast enough for browser
inference - Strong instruction-following performance - Hackathon-safe
deployment

---

# 3. Inference Layer (Fully On-Device)

- RunAnywhere SDK (https://github.com/RunanywhereAI/web-starter-app)
- WebGPU (Primary acceleration)
- WASM fallback
- Model caching via IndexedDB

Responsibilities: - Load quantized 3B model - Token generation - Context
management - Streaming responses

---

# 4. Legal Classification Model

Purpose: - Case type detection - Urgency detection - Emergency flagging

Model: - DistilBERT (Quantized ONNX INT8)

Runtime: - ONNX Runtime Web

Why Separate Model? - Faster inference - Deterministic outputs - Reduced
LLM load

---

# 5. Embeddings & Lawyer Matching

Model: - MiniLM (Sentence Transformer, ONNX)

Function: - Generate embeddings for user query - Generate embeddings for
lawyer profiles - Compute cosine similarity in browser

Storage: - IndexedDB (Vector storage) OR - SQLite WASM (Structured
storage)

---

# 6. Local Storage Layer

Primary: - IndexedDB

Optional: - SQLite WASM

Stores: - Lawyer database - Cached model weights - Conversation history
(encrypted)

---

# 7. Security & Encryption

- Web Crypto API (AES-GCM)
- Session-based key generation
- Local encrypted chat storage
- No external transmission

---

# 8. Optimization Stack

- Model Quantization (Q4)
- Lazy model loading
- Token limit management
- IndexedDB model caching
- WebGPU acceleration

---

# 9. Final Architecture Flow

React SPA │ ├── RunAnywhere SDK (3B LLM Inference) │ ├── ONNX Runtime
Web (Classification + Embeddings) │ ├── IndexedDB (Local Storage) │ └──
Web Crypto API (Encryption)

---

# Deployment Philosophy

- 100% On-Device AI
- Offline-capable
- Privacy-first legal assistant
- Hackathon-ready architecture
- Zero cloud dependency

---

End of Document

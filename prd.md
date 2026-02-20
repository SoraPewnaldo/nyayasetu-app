# NyayaSetu -- Product Requirements Document (PRD)

Version: 1.0 Architecture: Fully On-Device (3B Model)

------------------------------------------------------------------------

# 1. Product Overview

## 1.1 Vision

NyayaSetu is a privacy-first AI-powered legal triage and assistance
system that operates entirely on-device using a quantized 3B parameter
LLM. The system functions offline and ensures zero user data leaves the
device.

## 1.2 Objectives

-   Provide AI-based legal triage.
-   Classify legal issues automatically.
-   Detect urgency and emergency cases.
-   Match users with relevant lawyers.
-   Enable secure encrypted local chat.
-   Operate 100% offline.

------------------------------------------------------------------------

# 2. System Architecture

Frontend (React SPA) → RunAnywhere SDK (3B LLM Inference) → ONNX Runtime
Web (Classification + Embeddings) → IndexedDB (Storage) → Web Crypto API
(Encryption)

Constraints: - No backend - No cloud APIs - No external inference calls

------------------------------------------------------------------------

# 3. AI Model Specifications

## 3.1 Primary LLM

Model Type: - 3B parameter instruction-tuned model

Recommended: - Phi-3 Mini (3B) OR - Llama 3 3B Instruct

Format: - Quantized GGUF (Q4_K\_M recommended)

Requirements: - Must run on 8GB RAM systems. - Streaming token
generation support. - Max 4K context window. - WebGPU acceleration
preferred.

Primary Uses: - Conversational triage - Guided legal assistance -
Context-aware follow-up questioning

------------------------------------------------------------------------

## 3.2 Classification Model

Model: - DistilBERT (Quantized ONNX INT8)

Tasks: - Legal case classification (multi-class) - Urgency detection
(Low/Medium/High) - Emergency detection (Binary)

Runtime: - ONNX Runtime Web

Performance: - \<200ms inference latency target

------------------------------------------------------------------------

## 3.3 Embedding Model

Model: - MiniLM (ONNX)

Purpose: - Generate embeddings for user queries - Generate embeddings
for lawyer profiles

Similarity: - Cosine similarity computed in browser

------------------------------------------------------------------------

# 4. Functional Requirements

## 4.1 AI Triage Module

Flow: 1. User inputs legal issue description. 2. Classification model
runs. 3. Case category determined. 4. Urgency level determined. 5.
Structured prompt sent to LLM. 6. LLM generates guided response.

Output: - Case category - Urgency indicator - Suggested next steps -
Legal disclaimer

------------------------------------------------------------------------

## 4.2 Emergency Detection

If emergency classifier confidence exceeds threshold:

System must: - Override normal flow - Display EmergencyAid screen - Show
hotline resources - Highlight urgency visually

Emergency detection must NOT rely on LLM output.

------------------------------------------------------------------------

## 4.3 Lawyer Matching

Steps: 1. Generate embedding for user description. 2. Retrieve stored
lawyer embeddings. 3. Compute cosine similarity. 4. Rank lawyers by
similarity score. 5. Display top 3--5 matches.

Matching must execute locally.

------------------------------------------------------------------------

## 4.4 Secure Chat

Requirements: - Local-only storage - AES-GCM encryption via Web Crypto
API - Session-based key generation - No plaintext storage

------------------------------------------------------------------------

# 5. Non-Functional Requirements

## 5.1 Privacy

-   No telemetry
-   No external network calls
-   All inference local
-   No data transmission

## 5.2 Performance

First model load: - ≤15 seconds (initial download/cache)

Subsequent loads: - ≤3 seconds (from IndexedDB)

Token generation: - ≥8 tokens/sec target (WebGPU)

## 5.3 Offline Capability

-   Must operate without internet
-   Cache models locally
-   WASM fallback if WebGPU unavailable

------------------------------------------------------------------------

# 6. Data Storage

Primary: - IndexedDB

Stored Items: - Model cache - Encrypted chat history - Lawyer database -
Embedding vectors

Optional: - SQLite WASM

------------------------------------------------------------------------

# 7. Security Requirements

-   AES-GCM encryption
-   Per-session key generation
-   No hardcoded secrets
-   Strict Content Security Policy
-   Block external network requests

------------------------------------------------------------------------

# 8. Optimization Requirements

-   Mandatory Q4 quantization
-   Lazy model loading
-   Context window trimming
-   Memory usage \<6GB during runtime

------------------------------------------------------------------------

# 9. Constraints

-   Minimum 8GB RAM system
-   Modern browser with WebGPU preferred
-   No backend allowed
-   No paid APIs allowed
-   No cloud LLM allowed

------------------------------------------------------------------------

# 10. User Flow

1.  User opens application.
2.  Model loads (with progress indicator).
3.  User submits legal issue.
4.  Classification runs.
5.  Urgency determined.
6.  LLM generates response.
7.  Lawyer matches shown.
8.  User may initiate secure chat.

------------------------------------------------------------------------

# 11. Failure Handling

If: - Model fails to load → Show fallback message. - WebGPU unavailable
→ Switch to WASM. - Low memory detected → Reduce context window.

------------------------------------------------------------------------

# 12. Success Metrics

Technical: - Model loads successfully on 90% of modern laptops. -
Classification latency \<200ms. - Zero external network requests during
inference.

Product: - Case classification accuracy ≥80% (internal validation). -
Emergency detection recall ≥95%.

------------------------------------------------------------------------

End of Document

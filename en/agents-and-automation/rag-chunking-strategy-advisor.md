---
id: rag-chunking-strategy-advisor
title: RAG Chunking Strategy Advisor
category: agents-and-automation
tags: [rag, ai-agents, schema-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Recommends a document-chunking strategy for a RAG (retrieval-augmented generation) pipeline — chunk size, overlap, and splitting method — given the actual shape of the source documents and the kinds of queries users will ask against them, rather than defaulting to a generic fixed-size split that works poorly for tables, code, or Q&A-style content.

## When to use it
- You're building a RAG pipeline from scratch and need to decide how to chunk a specific document set before writing the ingestion code.
- Retrieval quality is poor (relevant passages aren't being returned, or returned chunks cut off mid-thought) and you suspect the chunking strategy, not the embedding model or retrieval algorithm, is the root cause.
- You're adding a new document type (e.g. spreadsheets, code, structured FAQs) to an existing pipeline tuned for prose, and need a chunking approach appropriate to the new type rather than reusing the prose settings by default.

## The Prompt

```
You recommend a chunking strategy for a RAG pipeline, given the document type and how users will query it.

Document type and structure: {{DOCUMENT_TYPE}}
Representative example of the content: {{CONTENT_SAMPLE}}
Typical user queries this pipeline needs to answer: {{QUERY_PATTERNS}}
Embedding model and its context/token limit, if known: {{EMBEDDING_MODEL}}

Instructions:
1. Recommend a splitting method — fixed-size (character/token count), semantic (split at topic boundaries), structural (split along headings, table rows, function boundaries, or Q&A pairs) — and justify it against {{DOCUMENT_TYPE}}'s actual structure. Flag if a naive fixed-size split would cut through a semantically meaningless boundary given this document type (e.g. splitting a table mid-row, or a code function mid-body).
2. Recommend a chunk size in tokens, with your reasoning tied to {{QUERY_PATTERNS}}: queries needing a short specific fact support smaller chunks (tighter retrieval precision); queries needing broader context (summarizing a section, comparing two things) need larger chunks or a strategy that retrieves multiple adjacent chunks together.
3. Recommend overlap (if any) between adjacent chunks, and explain what specific failure it prevents (a fact split across a chunk boundary becoming unretrievable from either chunk alone) versus its cost (redundant content inflating the index and retrieval noise).
4. If {{DOCUMENT_TYPE}} includes structural elements poorly served by plain text chunking (tables, code, nested lists, Q&A pairs), recommend a type-specific handling: e.g. serializing a table row with its column headers repeated so it's self-contained outside the table, or chunking code by function/class rather than line count.
5. Recommend what metadata to attach to each chunk (source document, section heading, page/line range) to support citation and to let the retrieval step filter or re-rank using structure the raw chunk text doesn't carry.
6. If {{EMBEDDING_MODEL}}'s context limit is provided, confirm the recommended chunk size comfortably fits it with room for the metadata/prefix typically added before embedding.

Output format: Markdown with sections: Splitting Method, Chunk Size & Overlap, Type-Specific Handling, Metadata, Rationale Summary (2-3 sentences tying the recommendation back to {{QUERY_PATTERNS}}).
```

## Variables
- `{{DOCUMENT_TYPE}}` — the kind of document being chunked and its structural characteristics (long-form prose, a spreadsheet/table export, source code, a structured FAQ). Required.
- `{{CONTENT_SAMPLE}}` — a representative excerpt of the actual content, so the recommendation isn't based on the document type label alone. Required.
- `{{QUERY_PATTERNS}}` — the kinds of questions users will ask against this content (specific-fact lookup vs. broad summarization vs. comparison). Required — chunk size has no correct answer without this.
- `{{EMBEDDING_MODEL}}` — the embedding model in use and its token/context limit, if known. Optional but improves precision of the size recommendation.

## Example
**Input:** `{{DOCUMENT_TYPE}}` = "Internal product FAQ, structured as ~200 discrete question-answer pairs, each under a category heading." `{{CONTENT_SAMPLE}}` = "### Billing\n**Q: How do I update my payment method?**\nA: Go to Settings > Billing > Payment Methods..." `{{QUERY_PATTERNS}}` = "Users ask specific how-to questions and expect a direct answer, not a summary of a broader section." `{{EMBEDDING_MODEL}}` = "text-embedding-3-small, 8191 token limit"

**Output (excerpt):**
```
### Splitting Method
Structural — chunk by Q&A pair, not by character count. {{DOCUMENT_TYPE}} is already naturally segmented into self-contained units; a fixed-size split risks merging two unrelated Q&A pairs into one chunk or cutting a single answer in half, either of which directly hurts retrieval for {{QUERY_PATTERNS}}'s specific-answer-lookup use case.

### Chunk Size & Overlap
One chunk per Q&A pair (typically well under 200 tokens each, far inside the 8191-token limit). No overlap needed between pairs — they're independent units, and overlap would only duplicate unrelated content across chunks with no retrieval benefit here.

### Type-Specific Handling
Prefix each chunk with its category heading (e.g. "Billing: ") even though the heading isn't part of the Q&A pair itself — this keeps the chunk self-contained if retrieved without its surrounding structural context, and gives the embedding a category-level signal.

### Metadata
Attach: category heading, and a stable question ID if one exists, so answers can be cited back to a specific FAQ entry rather than an anonymous chunk of the document.
```

## Tips & Variations
- If a single document set mixes content types (e.g. prose sections and embedded tables in the same manual), apply a different chunking method per section rather than forcing one strategy across the whole document — detect the section type during ingestion and route accordingly.
- Pair with `test-fixture-generator` (coding, already shipped) if you need to construct a labeled test set of query→expected-chunk pairs to actually measure whether a chunking change improved retrieval, rather than judging it by inspection alone.
- Revisit this prompt's recommendation after the pipeline is live and you have real failed-retrieval examples — a chunking strategy that looked right on {{CONTENT_SAMPLE}} sometimes breaks down on document variations that weren't represented in the sample.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

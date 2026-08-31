---
id: file-upload-security-reviewer
title: File Upload Security Reviewer
category: coding
tags: [security, input-validation, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reviews a file-upload feature — the endpoint and its storage/serving handling — for the specific failure modes that turn "let users upload a file" into a remote-code-execution, path-traversal, or storage-abuse vector: trusting client-supplied file type, unsanitized filenames, unbounded size/type, and unsafe serving of uploaded content.

## When to use it
- You're building or reviewing a file-upload feature (avatar, document, attachment) and want a focused security pass on the upload/storage/serving path specifically, not a general endpoint review.
- A pentest or bug bounty report mentions "arbitrary file upload" or "path traversal via filename" and you need to map that to the exact gap in your handling code.
- You're adding a new upload type (e.g. allowing PDFs alongside images) and want to confirm the existing validation actually covers the new type correctly, not just extends an allowlist string.

## The Prompt

```
You review a file-upload feature's endpoint, storage, and serving code for the specific vulnerabilities file uploads commonly introduce, not general code quality.

Upload endpoint code: {{UPLOAD_CODE}}
How/where uploaded files are stored and later served: {{STORAGE_SERVING}}
Intended allowed file types: {{ALLOWED_TYPES}}

Instructions:
1. Check how file type is validated: is it based on the client-supplied `Content-Type` header or file extension alone (both fully attacker-controlled and easily spoofed), or does the code sniff actual file content (magic bytes) to confirm the file is genuinely what it claims to be?
2. Check filename handling: is the original filename used to construct a storage path directly? If so, check for path traversal (a filename like `../../etc/config` or containing null bytes) and for special/reserved characters that could break the storage path or downstream tooling. Confirm the stored filename is either fully server-generated (e.g. a UUID) or is sanitized to a safe character set.
3. Check size limits: is there an enforced maximum file size before/during the read, or could a request stream an arbitrarily large file and exhaust disk/memory? Check whether the limit is enforced at the application layer, not only assumed to be handled by a reverse proxy that may not be configured.
4. Check for decompression-bomb risk if any uploaded format is unpacked server-side (zip, image thumbnailing) — an innocuous-looking small file expanding to gigabytes in memory or disk.
5. Check where files are served from: if uploads are served from the same origin/domain as the main application (rather than a separate storage domain/CDN with a restrictive `Content-Disposition` and `Content-Type`), an uploaded HTML or SVG file could be served with a browser-executable content type, enabling stored XSS via a "file upload."
6. Check that {{ALLOWED_TYPES}} is enforced as an allowlist of specific, deliberately chosen types — not a denylist of "dangerous" extensions, which is trivially incomplete (e.g. blocking `.php` but not `.phtml`, `.php5`).
7. If files are ever processed by another system (antivirus scan, image resize library, document parser), note whether that processing step itself could be a vulnerability surface (e.g. an image library with known parsing CVEs) — flag it as worth checking even if outside this code's scope.

Output format: Markdown. For each finding: the specific gap, the exploit scenario in one sentence, severity (critical/high/medium/low), and the fix. End with an explicit checklist: content-type validated by sniffing (yes/no), filename sanitized (yes/no), size limit enforced (yes/no), served from isolated origin (yes/no).
```

## Variables
- `{{UPLOAD_CODE}}` — the upload endpoint's handling code (receiving, validating, storing the file). Required.
- `{{STORAGE_SERVING}}` — where files land (local disk, object storage, etc.) and how they're later served back to users. Required.
- `{{ALLOWED_TYPES}}` — the file types the feature is intended to accept. Required.

## Example
**Input:** `{{UPLOAD_CODE}}` = "Multer middleware saves to `/uploads/{originalname}` with a MIME-type filter checking `req.file.mimetype` against an allowlist." `{{STORAGE_SERVING}}` = "Express serves `/uploads` as a static directory on the same domain as the app." `{{ALLOWED_TYPES}}` = "image/jpeg, image/png"

**Output (excerpt):**
```
### Finding: MIME type trusted from client, no content sniffing
The filter checks `req.file.mimetype`, which is the `Content-Type` the client's multipart request declares — fully attacker-controlled and unrelated to the file's actual bytes. An attacker can upload an HTML/SVG/JS file while declaring `image/jpeg`.
Severity: high.
Fix: after receiving the file, sniff its actual content (e.g. check magic bytes, or use a content-type detection library) and reject if it doesn't match a genuine image format, independent of the declared header.

### Finding: original filename used directly as storage path — path traversal and same-origin XSS risk
Saving to `/uploads/{originalname}` uses the attacker-controlled filename directly. Combined with serving `/uploads` on the app's own domain, an uploaded file named `x.svg` (once the MIME check above is bypassed or if SVG is ever allowed) would be served as browser-executable content on the same origin as authenticated sessions — stored XSS. The unsanitized filename also risks path traversal characters reaching the filesystem call.
Severity: critical.
Fix: generate a server-side random filename (e.g. UUID) with no client input in the path, and serve `/uploads` from a separate subdomain (or object storage with a fixed, non-executable `Content-Type` and `Content-Disposition: attachment`) so uploaded content is never treated as same-origin executable content.

Checklist: Content-type validated by sniffing — no. Filename sanitized — no. Size limit enforced — not shown, verify separately. Served from isolated origin — no.
```

## Tips & Variations
- Pair with `injection-vulnerability-scanner` (coding, already shipped) if the upload feature also writes filenames or metadata into a database query or shell command — this prompt is scoped to the upload/storage/serving path itself, not downstream injection from that data.
- If {{ALLOWED_TYPES}} includes formats commonly processed server-side (images resized, PDFs rendered to thumbnails), explicitly ask the reviewer to flag known CVE-prone libraries for that format, since the upload path being "safe" doesn't cover a vulnerable processing step further downstream.
- For public-facing upload features (no auth required), also ask about abuse-rate limiting on the endpoint itself — an otherwise-secure upload handler can still be used for storage-cost or bandwidth abuse without a rate limit, a concern this prompt's checklist doesn't cover by default.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

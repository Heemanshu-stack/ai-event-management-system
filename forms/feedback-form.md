# Feedback Form Specification

This document details the structure, fields, and workflow trigger for collecting attendee post-event feedback.

---

## 📋 Form Fields

| Field Name | Type | Required | Range / Options |
| :--- | :--- | :--- | :--- |
| **Email Address** | Short Text | Yes | Must match registered email |
| **Overall Rating** | Linear Scale | Yes | 1 (Poor) to 5 (Excellent) |
| **Content Quality** | Linear Scale | Yes | 1 (Poor) to 5 (Excellent) |
| **Speaker Rating** | Linear Scale | Yes | 1 (Poor) to 5 (Excellent) |
| **Detailed Feedback & Suggestions** | Paragraph | Yes | Free-form text for AI sentiment & topic analysis |

---

## 🤖 AI Analysis Integration

1. Form responses are posted via Google Apps Script (`apps-script/feedback.gs`).
2. Webhook triggers [`workflows/04-feedback-ai-analysis-workflow.json`](file:///c:/Users/heema/Desktop/repo/workflows/04-feedback-ai-analysis-workflow.json).
3. LLM nodes process free-form feedback to output:
   - **Sentiment Score**: Positive / Neutral / Negative
   - **Key Highlights & Complaints**: Extracted topics
   - **Action Items**: Recommended improvements for future events

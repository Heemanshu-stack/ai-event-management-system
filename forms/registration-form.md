# Feedback Form

This Google Form collects participant feedback after the event.

## Fields

| Field | Type |
|-------|------|
| Participant ID | Short Answer |
| Full Name | Short Answer |
| Email Address | Short Answer |
| Event Name | Dropdown |
| Overall Rating | Linear Scale (1–5) |
| What did you like the most? | Paragraph |
| What can we improve? | Paragraph |
| Would you attend another event? | Multiple Choice |
| Would you recommend this event? | Multiple Choice |
| Additional Comments | Paragraph |

## Workflow

Google Form
↓
Apps Script
↓
n8n Webhook
↓
Store Feedback in Google Sheets
↓
Collect All Responses
↓
Google Gemini AI Analysis
↓
Generate Summary Report
↓
Email Report to Organizer

## AI Analysis

The Gemini AI model automatically generates:

- Average Rating
- Overall Sentiment
- Positive Highlights
- Improvement Areas
- Participant Summary
- Recommendations

## Output

- Feedback stored in Google Sheets
- AI-generated event analysis
- Automated email report
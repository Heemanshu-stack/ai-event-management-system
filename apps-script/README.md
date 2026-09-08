# Google Apps Scripts

This folder contains the Google Apps Script files used to connect Google Forms with the n8n workflows.

## Files

### registration.gs

Handles registration form submissions.

**Functions:**
- Triggered automatically on Google Form submission.
- Collects participant information.
- Sends registration data to the n8n Registration Webhook.

**Input**
- Timestamp
- Full Name
- Email Address
- Phone Number
- College/Organization
- Event Name
- Consent

**Output**
- JSON payload sent to n8n Registration Workflow.

---

### feedback.gs

Handles feedback form submissions.

**Functions:**
- Triggered automatically on Google Form submission.
- Collects participant feedback.
- Sends feedback data to the n8n Feedback Workflow.

**Input**
- Participant ID
- Full Name
- Email Address
- Event Name
- Overall Rating
- Positive Feedback
- Improvement Suggestions
- Attend Again
- Recommend Event
- Additional Comments

**Output**
- JSON payload sent to n8n Feedback Analysis Workflow.

---

## Requirements

- Google Apps Script
- Google Forms
- Google Sheets
- n8n Webhook URL

Update the `WEBHOOK_URL` variable before deployment.

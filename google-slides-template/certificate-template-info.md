# Google Slides Certificate Template

This directory references the official Google Slides Certificate Template used by the automated certificate generation workflow ([`workflows/03-certificate-generation-workflow.json`](file:///c:/Users/heema/Desktop/repo/workflows/03-certificate-generation-workflow.json)).

---

## 🔗 Official Template Link & ID

- **Google Slides URL**: [https://docs.google.com/presentation/d/1crSdtMGje7F_XMpvX_QwiZg9o-kUMSISalnmBnlh7y4/edit?usp=drive_link](https://docs.google.com/presentation/d/1crSdtMGje7F_XMpvX_QwiZg9o-kUMSISalnmBnlh7y4/edit?usp=drive_link)
- **Presentation ID**: `1crSdtMGje7F_XMpvX_QwiZg9o-kUMSISalnmBnlh7y4`

---

## 🎨 Template Specifications

- **Format**: Landscape Presentation (16:9)
- **Export Format**: PDF / Image (PNG)
- **Title**: Certificate of Participation – AI Innovation Hackathon Certificate

---

## 🏷️ Dynamic Placeholders

The following placeholders are replaced dynamically by the n8n certificate generation workflow for each verified attendee:

| Tag Placeholder | Description | Example Replacement |
| :--- | :--- | :--- |
| `{{Participant Name}}` | Full name of the attendee | `Alex Morgan` |
| `{{Event Name}}` | Title of the event or workshop | `AI Innovation Hackathon` |
| `{{Issue Date}}` | Date certificate was issued | `July 31, 2026` |
| `{{Certificate ID}}` | Unique hash / sequence ID | `CERT-2026-89412` |
| `{{Organizer Name}}` | Name of hosting organization/lead | `EventPilot AI Team` |

---

## 🔐 n8n Integration Setup

1. The Presentation ID `1crSdtMGje7F_XMpvX_QwiZg9o-kUMSISalnmBnlh7y4` is pre-configured in the **Copy File (Google Drive)** node in [`workflows/03-certificate-generation-workflow.json`](file:///c:/Users/heema/Desktop/repo/workflows/03-certificate-generation-workflow.json).
2. Ensure your n8n Google Drive OAuth credentials have **Editor/Viewer** permission for this presentation.

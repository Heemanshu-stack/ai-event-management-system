const WEBHOOK_URL = "YOUR_N8N_REGISTRATION_WEBHOOK_URL";

function onFormSubmit(e) {
  const values = e.values;

  const data = {
    timestamp: values[0],
    email: values[1],
    fullName: values[2],
    phone: values[3],
    college: values[4],
    event: values[5],
    consent: values[6]
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  });
}

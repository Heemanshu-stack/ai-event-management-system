const WEBHOOK_URL = "YOUR_N8N_FEEDBACK_WEBHOOK_URL";

function onFormSubmit(e) {
  const values = e.values;

  const data = {
    timestamp: values[0],
    participantId: values[1],
    fullName: values[2],
    email: values[3],
    event: values[4],
    rating: values[5],
    liked: values[6],
    improve: values[7],
    attendAgain: values[8],
    recommend: values[9],
    comments: values[10]
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  });
}

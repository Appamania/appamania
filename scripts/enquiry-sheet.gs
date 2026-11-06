/**
 * Notes from appamania.in → a Google Sheet in the account that deploys this.
 *
 * Deploy once, signed in as sumit@appamania.in:
 * 1. script.google.com → New project → paste this file.
 * 2. Deploy → New deployment → Web app.
 * 3. Execute as: Me. Who has access: Anyone.
 * 4. Copy the /exec URL into Vercel as NEXT_PUBLIC_ENQUIRY_URL, then redeploy.
 *
 * The first accepted note creates a spreadsheet named "Appamania notes"
 * in that Drive. Columns: Received (Asia/Kolkata), Name, Email, Message, Link.
 */
var SHEET_TITLE = "Appamania notes";
var HEADERS = ["Received", "Name", "Email", "Message", "Link"];

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false });
  }
  if (String(data.website || "").trim()) return json({ ok: true });
  var name = String(data.name || "").trim();
  var email = String(data.email || "").trim();
  var message = String(data.message || "").trim();
  var link = String(data.link || "").trim();
  if (!name || name.length > 200) return json({ ok: false });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return json({ ok: false });
  if (!message || message.length > 4000) return json({ ok: false });
  if (link.length > 500 || (link && !/^https?:\/\//i.test(link))) return json({ ok: false });
  var received = Utilities.formatDate(new Date(), "Asia/Kolkata", "d MMM yyyy, HH:mm");
  sheet_().appendRow([received, name, email, message, link]);
  return json({ ok: true });
}

function sheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  var ss = id ? SpreadsheetApp.openById(id) : null;
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_TITLE);
    props.setProperty("SHEET_ID", ss.getId());
    var sh = ss.getSheets()[0];
    sh.setName("Notes");
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sh.setColumnWidth(4, 420);
    sh.getRange("D:D").setWrap(true);
    return sh;
  }
  return ss.getSheetByName("Notes");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

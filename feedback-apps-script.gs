// Google Apps Script backend for the DST10 Performances review page.
// Paste into a Google Sheet: Extensions > Apps Script. See SETUP.md.
const SHEET = 'Feedback';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.appendRow(['Timestamp', 'Video ID', 'Video', 'Name', 'Status', 'Notes']);
    s.setFrozenRows(1);
  }
  return s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Stop text like "=HYPERLINK(...)" from being treated as a formula.
function clean_(v, max) {
  v = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  return json_(rows.map(r => ({
    ts: r[0] instanceof Date ? r[0].toISOString() : r[0],
    id: r[1], video: r[2], name: r[3], status: r[4], notes: r[5]
  })));
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.name || !d.id) return json_({ ok: false, error: 'missing fields' });
    const status = d.status === 'Approved' ? 'Approved' : 'Needs correction';
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date(), clean_(d.id, 100), clean_(d.video, 200),
        clean_(d.name, 60), status, clean_(d.notes, 2000)]);
    } finally { lock.releaseLock(); }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

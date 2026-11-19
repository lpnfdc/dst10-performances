# DST10 LED Review

A mobile-friendly page for reviewing the LED videos. Reviewers watch a video, choose **Approve** or **Needs correction**, add notes (with an optional timestamp button), and sign with their name.

The videos here are small 480p copies so they load fast on phones. They are for review only; the full-quality files stay offline.

## Connect the feedback sheet (one time, about 5 minutes)

1. Create a new Google Sheet, for example "DST10 LED Feedback".
2. Go to **Extensions → Apps Script**, delete the sample code, paste in `feedback-apps-script.gs`, and save.
3. Click **Deploy → New deployment**, choose the type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions, and copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `config.js`:
   ```js
   window.FEEDBACK_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```
6. Commit and push. All feedback then shows up as rows in the sheet, and on the page under each video.

If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

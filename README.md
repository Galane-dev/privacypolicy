# Study Surge Privacy Centre

Static privacy notice for Grade 12 All Subjects, Grade 12 Life Sciences A+, Grade 12 Parent, Grade 12 Teacher, Study Surge: Learning Games, Simple Study and the associated Study Surge website.

## Preview

Open `index.html` in a browser. No install or development server is required.

- `index.html`: complete readable notice, including when JavaScript is disabled.
- `styles.css`: responsive light/dark design and print layout.
- `policy.js`: optional print control, mobile contents disclosure and reading-position marker.
- `assets/study-surge.png`: existing Study Surge brand image.
- `tests/privacy-page.cjs`: browser checks; requires Playwright with Microsoft Edge available.

The page has no tracking scripts, external fonts, remote embeds, cookie writes or submission backend. Email links open a draft in the reader's mail application; they do not submit a request automatically. Hosting providers still receive normal network requests.

## Editorial Notes

Reviewed against the local Grade 12 learner, Parent, Teacher and Learning Games app source and Simple Study source on 14 October 2026. Runtime deployments, provider billing/retention settings and administrative processes were not independently certified.

Revision 2 replaces internal-audit phrasing with a public-facing notice. It clarifies permitted submission purposes, user upload responsibilities, AI-result limitations, third-party services and transaction administration. Material disclosures about provider processing, children's information, local/cloud storage and account deletion remain. This is an editorial revision, not a change to how the products handle data.

The operator confirmed the name Welcome Mashilo Galane and that the service is not a separately registered company. No physical/service address or registered Information Officer details were supplied. Do not invent an address or describe an unverified person as registered. Obtain an appropriate address for legal service and confirm Information Officer/PAIA obligations with a South African privacy professional before treating the notice as legally complete.

This is a source-grounded draft, not an attorney's opinion or certification of compliance. No policy can waive mandatory rights or fix technical non-compliance. Operator approval, a working request-handling process and legal review are needed before publication.

UniHub's separate transactional service and uninspected legacy app implementations need their own inventory and disclosure review; this notice does not imply that all Study Surge products share a database or account.

Do not put operational vulnerabilities, secret values or private review reports in this repository: files can be exposed through GitHub Pages. A separate local readiness review was delivered outside this publishing repository.

## Maintaining The Notice

When adding a feature, check data fields, purpose, required/optional inputs, recipients, public visibility, retention, deletion, children, permissions and international transfers. Verify any changed claim against the deployed system and update the policy date only when its content changes.

Keep the website's privacy-link label and app-store disclosures consistent with this combined notice. Do not add blanket consent, unrestricted content licences, guaranteed security, unconditional retention deadlines or claims that all data is deleted automatically unless the underlying implementation and operations support them.

## Sources Checked

- [POPIA, particularly sections 11, 14, 18, 22, 23-25, 34-35, 69, 71-72](https://www.treasury.gov.za/POPIA/POPI%20Act%204%20of%202013.pdf)
- [Consumer Protection Act](https://www.gov.za/sites/default/files/gcis_document/201409/321864670.pdf)
- [Information Regulator: children](https://inforegulator.org.za/wp-content/uploads/2020/07/GuidanceNote-Processing-PersonalInformation-Children-20210628-1.pdf)
- [Information Regulator: complaints](https://inforegulator.org.za/complaints/)
- [Information Regulator: direct marketing guidance](https://inforegulator.org.za/guidance-notes/)
- [Firebase privacy](https://firebase.google.com/support/privacy)
- [Google publisher policies](https://support.google.com/admob/answer/10502938)
- [Google partner-services data use](https://policies.google.com/technologies/partner-sites)
- [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data)
- [Yoco privacy](https://www.yoco.com/za/legal/privacy-policy/)

## Browser Check

```powershell
$env:PLAYWRIGHT_MODULE='C:\Users\welco\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
node tests/privacy-page.cjs
```

Screenshots and the print preview are generated under ignored `artifacts/`. Test output is not part of the published site.

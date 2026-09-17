# 8.2C Continuous Integration and Deployment

Repository: https://github.com/ujjain127/8.2CDevSecOps
Use your full enrolment name and student ID in your private submission and recordings.
Selected Part 2 option: SonarCloud only. Email Extension is not part of this submission.

## Implementation and requirements

| Requirement | Implementation |
| --- | --- |
| Part 1 Task 1: seven mock stages, only task/tool descriptions | `Jenkinsfile.mock` |
| Commit-triggered execution | Poll SCM every minute in mock job; configure Pipeline from SCM, main branch, full SCM retrieval |
| Part 1 Task 2: five required stages | `Jenkinsfile.part1` |
| Part 2 Task 1: retain five stages, add SonarCloud Analysis | `Jenkinsfile` |
| Scanner downloaded as official ZIP and extracted | `ci/sonar-scan.sh` |
| Token kept out of repository and command arguments | Jenkins Secret text credential ID `SONAR_TOKEN`, scoped `withCredentials` |
| Analysis completion and HTTP 200 evidence | `ci/sonar-status.cjs` polls the task returned by this scan and reports API response codes |
| Console and coverage retained | Jenkins build console plus archived reports and LCOV |

Upstream: https://github.com/snyk-labs/nodejs-goof at add14ba59e98240d9e00a235dd7d42cd61ae9912.
The app intentionally retains vulnerable dependencies and sample hard-coded values. No application deployment is needed: Task 1 staging and production are printed mock actions only.

## Tests and honest reporting

Upstream `npm test` invoked the authenticated Snyk CLI; the supplied component test is an incomplete fixture with invalid imports and undefined components. Its original source is retained. The original command is preserved as `npm run security:snyk`. This submission makes `npm test` run three executable Node tests of existing `utils.js`: random bounds, identifier length/alphabet, and the HTTP 403 response contract. `npm run coverage` runs these tests under c8 and generates real `coverage/lcov.info`.

Coverage is for `utils.js` only; 100% in the c8 summary is NOT whole-application coverage. SonarCloud analyses the remaining application code too and will report a different overall percentage. Generated dependency bundles, test fixtures and CI support files are excluded from source analysis.

The sheet's `|| true` permits continued execution. Here `catchError` continues the pipeline but visibly marks failures UNSTABLE and records each real command exit code. NPM Audit is expected to report vulnerabilities. Network/authentication errors must not be described as successful scans. A failed quality gate is separate from successful scanner upload and server processing; inspect the recorded gate status and dashboard.

## Jenkins setup

The local Docker instance is http://localhost:8089 and persists data in volume `jenkins-local_jenkins_82c_home`. It has Node 22, npm, Java 21, Git, curl, unzip and the required Pipeline/Git/Credentials/Timestamper plugins. Authentication remains enabled. It is bound only to 127.0.0.1, and no Docker socket is mounted into Jenkins.

Jobs use Pipeline script from SCM / Git / repository URL above / branch `*/main`:

- `82C-Part1-Mock`: script path `Jenkinsfile.mock`.
- `82C-Part1-DevSecOps`: script path `Jenkinsfile.part1`.
- `82C-Part2-SonarCloud`: script path `Jenkinsfile`.

Run each once manually to establish its SCM/polling baseline. After that push a real new commit, wait for polling and verify the build cause reads `Started by an SCM change`. Do not press Build Now for the automatic-trigger evidence. Disable lightweight checkout for the mock job: Jenkins retrieves its script through Git before the pipeline starts, which records the baseline required for polling. The seven pipeline stages remain echo-only.

## Finish SonarCloud configuration

1. Sign in to https://sonarcloud.io/login with GitHub; use EU region for the sheet's host URL.
2. Import only `ujjain127/8.2CDevSecOps` into your SonarCloud organisation. Prefer access limited to this repository when offered.
3. Record actual organisation and project keys. The properties currently assume `ujjain127` and `ujjain127_8.2CDevSecOps`; update if the service assigns different keys.
4. Disable SonarCloud Automatic Analysis for this project when enabling Jenkins CI analysis, to avoid competing analysis modes.
5. Generate a SonarCloud analysis token in account Security. Store it directly in Jenkins: Manage Jenkins > Credentials > System > Global > Add Credentials > **Secret text**, ID **SONAR_TOKEN**. The sheet calls this “Secret key”; Jenkins' actual type is Secret text. Do not save it in the repository, screenshots or narration.
6. Run `82C-Part2-SonarCloud`. Verify scanner EXECUTION SUCCESS, HTTP 200 for the task API, processing SUCCESS and quality-gate status. Follow the dashboard URL and check analysis time/revision matches this build.
7. Inspect a real security finding. Use `mongoose-db.js` only if the actual dashboard reports a finding there; don't invent a finding or count.

## Recording checklist

Use a screen recorder with microphone. Begin EVERY video with your full name and student ID. Camera at the start is encouraged. Keep credentials screens closed. Use readable zoom, no phone filming, and avoid including private tabs. Each video must be accessible to the tutor, verified using a signed-out window or the tutor's intended institutional access.

### Video 1 - Part 1 Task 1, 40-45 seconds

Before recording: have one completed mock run; prepare a harmless documentation commit; arrange GitHub commit view and Jenkins job/console. Polling may take up to a minute, so record a longer take and trim the wait without obscuring the commit/build timestamps or SCM cause.

- 0-5s: “I'm [FULL NAME], student [STUDENT ID]. This is Part 1 Task 1.”
- 5-13s: Show the new GitHub commit and its hash. “This new commit is detected by Jenkins polling GitHub every minute.”
- 13-22s: Show automatically started build and `Started by an SCM change`. “Jenkins started this build automatically after the commit.”
- 22-39s: Scroll seven stage descriptions in console: Build, Unit and Integration Tests, Code Analysis, Security Scan, Deploy to Staging, Integration Tests on Staging, Deploy to Production. “These seven mock stages print the tasks and tools, including Maven, JUnit, SonarQube, Dependency-Check and Ansible.”
- 39-45s: Show `Finished: SUCCESS`. “The seven-stage mock pipeline completed successfully.”

### Video 2 - Part 1 Task 2, 35-45 seconds

- 0-5s: “I'm [FULL NAME], student [STUDENT ID]. This is Part 1 Task 2.”
- 5-12s: Show repository name and five stages. “This repository contains the intentionally vulnerable NodeJS Goof application.”
- 12-32s: Scroll the actual NPM Audit console report. Point to one actual package/advisory, its severity and dependency path. “NPM Audit identified [ACTUAL ISSUE] in [ACTUAL PACKAGE]. This report lists the affected versions and available remediation.”
- 32-43s: Show audit summary and exit code. “The pipeline preserves the scan output and continues while marking the vulnerability stage unstable. It does not claim this application is secure.”

### Video 3 - Part 2 Task 1 SonarCloud, about 60 seconds

- 0-5s: “I'm [FULL NAME], student [STUDENT ID]. I selected SonarCloud for Part 2.”
- 5-20s: Show `Jenkinsfile` five original stages plus SonarCloud Analysis and `withCredentials`. “The token is injected from Jenkins Secret text credentials and is never committed.”
- 20-33s: Show scanner download/invocation and successful build console. “The official scanner uploads analysis; these HTTP 200 responses and processing SUCCESS confirm the server processed this run.”
- 33-51s: Show actual dashboard analysis timestamp/revision; open a genuine security finding and explain it. “This analysis corresponds to the Jenkins run. The dashboard reports [ACTUAL FINDING] in [ACTUAL FILE].”
- 51-60s: Show gate/coverage. “Utility tests generated the LCOV report. This deliberately vulnerable application can fail its quality gate even when analysis completes successfully.”

## Final PDF

The required submission is a PDF containing THREE clickable video links: the two mandatory Part 1 demos and the SonarCloud Part 2 demo. A repository link alone is not sufficient. Record/upload videos, verify audio/duration/access, then enter their actual share URLs into the submission link data and generate the PDF. Do not submit a draft with missing video links. No Email Extension video should be included.

## Technical references

- Task sheet supplied in the referenced conversation (primary assessment requirements).
- https://www.jenkins.io/doc/book/pipeline/jenkinsfile/ (SCM pipelines, credentials and failure handling).
- https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/scanners/sonarscanner-cli/ (official scanner ZIP and SONAR_TOKEN).
- https://github.com/snyk-labs/nodejs-goof (original training project).

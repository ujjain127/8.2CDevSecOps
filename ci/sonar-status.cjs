// Check processing of this exact analysis; an upload alone is not completion.
const fs = require('node:fs');
const props = Object.fromEntries(fs.readFileSync('.scannerwork/report-task.txt', 'utf8')
  .trim().split('\n').map(line => { const i = line.indexOf('='); return [line.slice(0,i), line.slice(i+1)]; }));
const token = process.env.SONAR_TOKEN;
async function get(url) {
  const u = new URL(url);
  if (u.origin !== 'https://sonarcloud.io') throw Error('Unexpected SonarCloud API origin');
  const res = await fetch(u, {headers: {Authorization: `Bearer ${token}`}});
  console.log(`SonarCloud API ${u.pathname}: HTTP ${res.status}`);
  if (!res.ok) throw Error(`SonarCloud HTTP ${res.status}`);
  return res.json();
}
(async () => {
  for (let i=0; i<60; i++) {
    const {task} = await get(props.ceTaskUrl);
    console.log(`Analysis processing status: ${task.status}`);
    if (task.status === 'SUCCESS') {
      const result = await get(`https://sonarcloud.io/api/qualitygates/project_status?analysisId=${encodeURIComponent(task.analysisId)}`);
      fs.writeFileSync('reports/sonar-result.json', JSON.stringify({task, qualityGate:result.projectStatus}, null, 2));
      console.log(`Quality gate: ${result.projectStatus.status}`);
      console.log(`Dashboard: ${props.dashboardUrl}`);
      // This intentionally vulnerable training app may fail the quality gate.
      return;
    }
    if (['FAILED','CANCELED'].includes(task.status)) throw Error(`Analysis ${task.status}`);
    await new Promise(r=>setTimeout(r,5000));
  }
  throw Error('Analysis processing timed out');
})().catch(e=>{console.error(e.message);process.exitCode=1;});

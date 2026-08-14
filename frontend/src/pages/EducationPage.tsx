const topics = [
  ['Wi-Fi protection', 'Use WPA3 where available, or WPA2-AES. Avoid obsolete WEP and WPA modes, change router defaults, and keep firmware current.'],
  ['Safer browsing', 'Prefer HTTPS, install browser and operating-system updates promptly, and do not enter credentials after certificate warnings.'],
  ['Network hygiene', 'Review DNS and router settings on networks you own. Use a firewall and separate guest devices from trusted personal devices.'],
  ['Responsible analysis', 'Only analyze systems you own or have explicit permission to assess. NetShield reports defensive observations; it does not attack, scan, or access devices.'],
]

export function EducationPage() {
  return <div className="page"><p className="eyebrow">SECURITY EDUCATION</p><h1>Learn the <em>why</em> behind safer choices.</h1><p className="page-lead">Use these principles alongside your NetShield results. A missing browser-visible signal is not proof of an insecure network.</p><div className="results-grid">{topics.map(([title, detail]) => <article className="result-card" key={title}><div className="result-heading"><span>{title}</span></div><p>{detail}</p></article>)}</div><section className="recommendation"><div><h3>When a result needs attention</h3><p>Make changes only in systems you administer, record what you changed, and retest. For a school or workplace network, share the finding with the responsible administrator instead of changing shared infrastructure.</p></div></section></div>
}

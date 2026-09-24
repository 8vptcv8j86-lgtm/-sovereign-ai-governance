"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { OperationalWorkspace } from "./operational-workspace";

type System = {
  id: string;
  name: string;
  owner: string;
  region: string;
  purpose: string;
  risk: "Critical" | "High" | "Medium" | "Low";
  status: "Action required" | "In review" | "Approved";
  model: string;
  data: string;
  updated: string;
};
type Row = Record<string, unknown>;
type Snapshot = {
  actor?: { displayName?: string; role?: string; organizationName?: string };
  capabilities?: string[];
  systems?: Row[];
  incidents?: Row[];
  evidence?: Row[];
  risks?: Row[];
  deploymentGates?: Row[];
  controls?: Row[];
  vendorRisk?: Row[];
  competencyRecords?: Row[];
  complianceDashboard?: Row[];
};
const riskTone: Record<System["risk"], string> = {
  Critical: "risk critical",
  High: "risk high",
  Medium: "risk medium",
  Low: "risk low",
};
const nav = [
  "Overview",
  "Agency & adoption",
  "Africa-first design",
  "Sovereign resilience",
  "Recovery exercises",
  "Implementation capacity",
  "Workforce absorption",
  "Infrastructure dividend",
  "Agrifood supply chains",
  "Public-sector AI",
  "Strategic foresight",
  "AI systems",
  "Deployment gate",
  "AI agents",
  "Skill governance",
  "Agent skills",
  "Skill provenance",
  "Skill proposals",
  "Skill validation",
  "Skill validation results",
  "Skill approvals",
  "Skill denials",
  "Skill deployments",
  "Skill performance",
  "Skill suspension",
  "Skill rollbacks",
  "Skill retirement",
  "Skill evidence export",
  "Advanced governance",
  "Advanced governance transitions",
  "Advanced governance export",
  "Continuous authorization",
  "Agent enforcement",
  "Model versions",
  "Model retirement",
  "Risk reviews",
  "Vendor risk",
  "AI competency",
  "Compliance monitoring",
  "Board reporting",
  "Control library",
  "Legal source register",
  "Regulatory horizon",
  "Guardrail decisions",
  "Approvals & overrides",
  "Evidence",
  "Evidence export",
  "Incidents & CAPA",
  "Corrective actions",
  "Confidential reporting",
  "Privacy",
  "Data protection purpose & lawfulness",
  "Data inventory & flows",
  "Data subject rights",
  "Third-party privacy",
  "Privacy risk & DPIA",
  "AI data protection",
  "Retention & deletion",
  "Privacy governance evidence",
  "Privacy record transitions",
  "Privacy regulator export",
  "African privacy compliance",
  "Policies",
  "Audit trail",
  "Users & roles",
  "User access management",
  "Executive accountability",
  "Workforce conduct",
  "Workforce conduct progression",
  "Conduct monitoring",
  "Conduct pattern review",
  "Accountability succession",
  "Succession reassignment",
  "Succession overdue scan",
  "Safety guardrails",
  "Terms",
] as const;
type Section = (typeof nav)[number];

export default function Home() {
  const [active, setActive] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<System[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () =>
      records.filter((s) =>
        `${s.name} ${s.owner} ${s.region}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, records],
  );
  const selected =
    records.find((system) => system.id === selectedId) ?? records[0] ?? null;
  const canRegister =
    snapshot.capabilities?.includes("register_system") ?? false;
  const highRisk = records.filter((system) =>
    ["High", "Critical"].includes(system.risk),
  ).length;
  const openIncidents = (snapshot.incidents ?? []).filter(
    (row) => row.status !== "closed",
  );
  const openReviews = (snapshot.deploymentGates ?? []).filter(
    (row) => row.outcome !== "APPROVED",
  ).length;
  const evidenceSystems = new Set(
    (snapshot.evidence ?? []).map((row) => String(row.systemCode)),
  );
  const evidenceCoverage = records.length
    ? Math.round((evidenceSystems.size / records.length) * 100)
    : 0;
  const compliance = (snapshot.complianceDashboard ?? [])[0] ?? {};
  const initials = (snapshot.actor?.displayName ?? "User")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }
  function navigate(section: Section) {
    setActive(section);
    setMobileMenu(false);
    setShowRegister(false);
    const url = new URL(window.location.href);
    if (section === "Overview") url.searchParams.delete("section");
    else url.searchParams.set("section", section);
    window.history.pushState(
      { section },
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  useEffect(() => {
    const syncFromHistory = () => {
      const section = new URL(window.location.href).searchParams.get("section");
      setActive(
        nav.includes(section as Section) ? (section as Section) : "Overview",
      );
      setMobileMenu(false);
      setShowRegister(false);
    };
    syncFromHistory();
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/governance", {
          headers: { Accept: "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json"))
          throw new Error("The server returned an unexpected response.");
        const data = (await response.json()) as Snapshot & { error?: string };
        if (!response.ok)
          throw new Error(
            data.error || "The governance workspace could not be loaded.",
          );
        const saved: System[] = (data.systems ?? []).map((row) => ({
          id: String(row.systemCode),
          name: String(row.name),
          owner: String(row.owner),
          region: String(row.region),
          purpose: String(row.purpose),
          risk: String(row.risk) as System["risk"],
          status: String(row.status) as System["status"],
          model: String(row.model),
          data: String(row.data),
          updated: String(row.createdAt ?? "Saved record"),
        }));
        if (!controller.signal.aborted) {
          setSnapshot(data);
          setRecords(saved);
          setSelectedId((current) =>
            saved.some((system) => system.id === current)
              ? current
              : (saved[0]?.id ?? ""),
          );
          setLoadError("");
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setLoadError(
            error instanceof Error
              ? error.message
              : "The governance workspace could not be loaded.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);
  async function register(form: HTMLFormElement) {
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/governance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ action: "register_system", ...payload }),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json"))
      throw new Error("The server returned an unexpected response.");
    const body = (await response.json()) as { result?: Row; error?: string };
    if (!response.ok || !body.result)
      throw new Error(body.error || "The system could not be registered.");
    const system = body.result;
    const record: System = {
      id: String(system.systemCode),
      name: String(system.name),
      owner: String(system.owner),
      region: String(system.region),
      purpose: String(system.purpose),
      risk: String(system.risk) as System["risk"],
      status: String(system.status) as System["status"],
      model: String(system.model),
      data: String(system.data),
      updated: "Just now",
    };
    setRecords((current) => [record, ...current]);
    setSelectedId(record.id);
    setSnapshot((current) => ({
      ...current,
      systems: [system, ...(current.systems ?? [])],
    }));
  }
  const navIcon = (item: Section) =>
    item === "Overview"
      ? "⌂"
      : item === "AI systems"
        ? "◇"
        : item === "Evidence"
          ? "▱"
          : item === "Safety guardrails"
            ? "⊘"
            : item === "Privacy"
              ? "◈"
              : item === "Terms"
                ? "¶"
                : "↗";
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Image
            src="/sentinel-logo.svg"
            alt="Sentinel"
            width={152}
            height={40}
            priority
          />
        </div>
        <div className="workspace-label">Institution</div>
        <div className="workspace-switch">
          {snapshot.actor?.organizationName ||
            (loading ? "Loading…" : "Unavailable")}
        </div>
        <nav aria-label="Primary navigation">
          {nav.map((item) => (
            <button
              key={item}
              className={active === item ? "nav-item active" : "nav-item"}
              aria-current={active === item ? "page" : undefined}
              onClick={() => navigate(item)}
            >
              <span className="nav-icon">{navIcon(item)}</span>
              {item}
            </button>
          ))}
        </nav>
        <div className="side-card">
          <div className="side-card-title">Governance coverage</div>
          <div className="coverage-number">
            {records.length} <span>systems</span>
          </div>
          <div className="progress">
            <i style={{ width: `${evidenceCoverage}%` }} />
          </div>
          <p>{evidenceCoverage}% have recorded evidence</p>
          <button onClick={() => navigate("Evidence")}>View evidence →</button>
        </div>
        <div className="profile">
          <span className="avatar">{initials}</span>
          <span>
            <b>{snapshot.actor?.displayName || "Signed-in user"}</b>
            <small>
              {snapshot.actor?.role?.replaceAll("_", " ") || "Loading role"}
            </small>
          </span>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu((v) => !v)}
            aria-expanded={mobileMenu}
            aria-label="Open navigation"
          >
            <span>{mobileMenu ? "×" : "☰"}</span> Menu
          </button>
          <div className="breadcrumb">
            CONTROL ROOM <span>/</span> {active.toUpperCase()}
          </div>
          <div className="mobile-page-title">{active}</div>
          <div className="top-actions">
            {active === "Overview" && (
              <label className="search">
                <span>⌕</span>
                <input
                  aria-label="Search AI systems"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search systems, owners, markets"
                />
              </label>
            )}
            {canRegister && (
              <button
                className="primary register-button"
                onClick={() => setShowRegister(true)}
              >
                ＋ Register AI system
              </button>
            )}
          </div>
        </header>
        {mobileMenu && (
          <div className="mobile-nav">
            <div className="mobile-nav-head">
              <span>Navigate Sentinel</span>
              <button onClick={() => setMobileMenu(false)}>×</button>
            </div>
            {nav.map((item) => (
              <button
                key={item}
                className={active === item ? "active" : ""}
                aria-current={active === item ? "page" : undefined}
                onClick={() => navigate(item)}
              >
                <span>{navIcon(item)}</span>
                {item}
              </button>
            ))}
            {canRegister && (
              <button
                className="mobile-register"
                onClick={() => {
                  setMobileMenu(false);
                  setShowRegister(true);
                }}
              >
                ＋ Register AI system
              </button>
            )}
          </div>
        )}
        {active === "Safety guardrails" ? (
          <OperationalWorkspace
            key={active}
            section="Guardrail decisions"
            flash={flash}
          />
        ) : active === "Terms" ? (
          <TermsOfService />
        ) : active !== "Overview" ? (
          <OperationalWorkspace key={active} section={active} flash={flash} />
        ) : (
          <div className="page">
            {loadError && (
              <div className="ops-error" role="alert">
                {loadError}
              </div>
            )}
            <div className="hero-row">
              <div>
                <p className="eyebrow">INSTITUTIONAL AI GOVERNANCE</p>
                <h1>
                  Govern what your institution
                  <br />
                  builds and buys.
                </h1>
                <p className="lede">
                  One defensible record of every AI system, decision, control
                  and piece of evidence—across every market.
                </p>
              </div>
              <div className="assurance-score">
                <div
                  className="score-ring"
                  style={{
                    background: `conic-gradient(var(--orange) ${evidenceCoverage}%,#d1d5cd 0)`,
                  }}
                >
                  <span>{loading ? "—" : evidenceCoverage}</span>
                  <small>/100</small>
                </div>
                <div>
                  <small>EVIDENCE COVERAGE</small>
                  <b>
                    {records.length
                      ? "Live portfolio measure"
                      : "No systems yet"}
                  </b>
                  <p>
                    {records.length
                      ? `${evidenceSystems.size} of ${records.length} systems evidenced`
                      : "Register the first system"}
                  </p>
                </div>
              </div>
            </div>
            <section className="metrics">
              <article>
                <span className="metric-icon blue">◇</span>
                <div>
                  <small>REGISTERED SYSTEMS</small>
                  <b>{loading ? "—" : records.length}</b>
                  <p>Live institutional register</p>
                </div>
              </article>
              <article>
                <span className="metric-icon red">!</span>
                <div>
                  <small>HIGH-RISK SYSTEMS</small>
                  <b>{loading ? "—" : highRisk}</b>
                  <p>High and critical classifications</p>
                </div>
              </article>
              <article>
                <span className="metric-icon amber">◴</span>
                <div>
                  <small>OPEN REVIEWS</small>
                  <b>{loading ? "—" : openReviews}</b>
                  <p>Deployment gates not approved</p>
                </div>
              </article>
              <article>
                <span className="metric-icon green">✓</span>
                <div>
                  <small>EVIDENCE COVERAGE</small>
                  <b>{loading ? "—" : `${evidenceCoverage}%`}</b>
                  <p>Systems with recorded evidence</p>
                </div>
              </article>
            </section>
            <div className="dashboard-grid">
              <section className="panel systems-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">SYSTEM REGISTER</p>
                    <h2>
                      {loading
                        ? "Loading systems…"
                        : "AI systems requiring attention"}
                    </h2>
                  </div>
                  <button onClick={() => navigate("AI systems")}>
                    View all {records.length} →
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>System</th>
                        <th>Markets</th>
                        <th>Risk</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((system) => (
                        <tr
                          key={system.id}
                          tabIndex={0}
                          aria-label={`Open ${system.name}`}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedId(system.id);
                            }
                          }}
                          onClick={() => setSelectedId(system.id)}
                          className={
                            selected?.id === system.id ? "selected" : ""
                          }
                        >
                          <td>
                            <b>{system.name}</b>
                            <small>
                              {system.id} · {system.owner}
                            </small>
                          </td>
                          <td>{system.region}</td>
                          <td>
                            <span className={riskTone[system.risk]}>
                              {system.risk}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status ${system.status.replace(" ", "-").toLowerCase()}`}
                            >
                              {system.status}
                            </span>
                          </td>
                          <td>›</td>
                        </tr>
                      ))}
                      {!loading && !filtered.length && (
                        <tr>
                          <td colSpan={5} className="empty-row">
                            {records.length
                              ? "No systems match this search."
                              : "No AI systems are registered yet."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              <aside className="panel detail-panel">
                {selected ? (
                  <>
                    <div className="detail-top">
                      <span className={riskTone[selected.risk]}>
                        {selected.risk} risk
                      </span>
                    </div>
                    <p className="eyebrow">{selected.id}</p>
                    <h2>{selected.name}</h2>
                    <p className="detail-purpose">{selected.purpose}</p>
                    <dl>
                      <div>
                        <dt>Accountable owner</dt>
                        <dd>{selected.owner}</dd>
                      </div>
                      <div>
                        <dt>Deployed markets</dt>
                        <dd>{selected.region}</dd>
                      </div>
                      <div>
                        <dt>Model / provider</dt>
                        <dd>{selected.model}</dd>
                      </div>
                      <div>
                        <dt>Data categories</dt>
                        <dd>{selected.data}</dd>
                      </div>
                    </dl>
                    <div className="control-block">
                      <div>
                        <span>Recorded evidence</span>
                        <b>
                          {
                            (snapshot.evidence ?? []).filter(
                              (row) => row.systemCode === selected.id,
                            ).length
                          }{" "}
                          items
                        </b>
                      </div>
                    </div>
                    {openIncidents.some(
                      (row) => row.systemCode === selected.id,
                    ) && (
                      <div className="finding">
                        <span>!</span>
                        <div>
                          <b>Open incident requires attention</b>
                          <p>
                            Review the incident and corrective-action record.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="detail-actions">
                      <button onClick={() => navigate("Risk reviews")}>
                        Open risk review
                      </button>
                      <button
                        className="plain"
                        onClick={() => navigate("Evidence")}
                      >
                        View evidence
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-detail">
                    <h2>No system selected</h2>
                    <p>Register an AI system to begin its governance record.</p>
                  </div>
                )}
              </aside>
            </div>
            <section className="lower-grid">
              <article className="panel action-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">CORRECTIVE ACTIONS</p>
                    <h2>What needs to move next</h2>
                  </div>
                  <button onClick={() => navigate("Incidents & CAPA")}>
                    Open action log →
                  </button>
                </div>
                {openIncidents.slice(0, 3).map((row, index) => (
                  <div className="action-row" key={String(row.incidentCode)}>
                    <span className={`priority p${index ? 2 : 1}`}>
                      {String(row.severity ?? "Open").slice(0, 2)}
                    </span>
                    <div>
                      <b>{String(row.title)}</b>
                      <p>
                        {String(row.systemCode)} ·{" "}
                        {String(row.status).replaceAll("_", " ")}
                      </p>
                    </div>
                    <span className="owner">
                      {String(row.owner ?? "—")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                ))}
                {!openIncidents.length && (
                  <div className="empty-row">No open incidents.</div>
                )}
              </article>
              <article className="panel jurisdiction-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">CONTINUOUS MONITORING</p>
                    <h2>Live governance signals</h2>
                  </div>
                </div>
                {[
                  ["Overdue vendor reviews", compliance.overdueReviews ?? 0],
                  [
                    "Expiring authorizations",
                    compliance.expiringAuthorizations ?? 0,
                  ],
                  ["Expired competencies", compliance.expiredCompetencies ?? 0],
                  ["High-risk vendors", compliance.highRiskVendors ?? 0],
                ].map(([label, value]) => (
                  <div className="jurisdiction" key={String(label)}>
                    <span>{String(label)}</span>
                    <b>{String(value)}</b>
                  </div>
                ))}
              </article>
            </section>
          </div>
        )}
      </section>
      {showRegister && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setShowRegister(false)}
        >
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Register AI system"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await register(event.currentTarget);
                setShowRegister(false);
                flash("AI system registered for initial review");
              } catch (error) {
                flash(
                  error instanceof Error
                    ? error.message
                    : "Record could not be saved. Please try again.",
                );
              }
            }}
          >
            <div className="modal-head">
              <div>
                <p className="eyebrow">NEW GOVERNANCE RECORD</p>
                <h2>Register an AI system</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowRegister(false)}
              >
                ×
              </button>
            </div>
            <label>
              System name
              <input
                name="name"
                required
                maxLength={200}
                placeholder="e.g. Fraud detection engine"
              />
            </label>
            <div className="field-grid">
              <label>
                Accountable owner
                <input
                  name="owner"
                  required
                  maxLength={200}
                  placeholder="Business function"
                />
              </label>
              <label>
                Deployed market
                <select name="region">
                  <option>Nigeria</option>
                  <option>Kenya</option>
                  <option>Ghana</option>
                  <option>Uganda</option>
                  <option>South Africa</option>
                </select>
              </label>
            </div>
            <label>
              Business purpose
              <textarea
                name="purpose"
                required
                maxLength={4000}
                placeholder="What decision or workflow does this system support?"
              />
            </label>
            <div className="field-grid">
              <label>
                Model provider
                <input
                  name="model"
                  maxLength={300}
                  placeholder="Internal or external provider"
                />
              </label>
              <label>
                Initial risk
                <select name="risk">
                  <option value="Medium">Not yet assessed</option>
                  <option value="High">Potentially high risk</option>
                  <option value="Low">Low risk</option>
                  <option value="Critical">Critical risk</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowRegister(false)}>
                Cancel
              </button>
              <button className="primary" type="submit">
                Register and begin review
              </button>
            </div>
          </form>
        </div>
      )}
      {notice && (
        <div className="toast" role="status" aria-live="polite">
          <span>✓</span>
          {notice}
        </div>
      )}
    </main>
  );
}

// Retained as the designed privacy overview while the live privacy workflow uses OperationalWorkspace.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PrivacyCenter({ flash }: { flash: (message: string) => void }) {
  return (
    <div className="page trust-page">
      <div className="trust-hero">
        <div>
          <p className="eyebrow">DATA GOVERNANCE</p>
          <h1>Privacy center</h1>
          <p>
            See what personal data AI systems use, why it is processed, where it
            moves and how individual rights are fulfilled.
          </p>
        </div>
        <button
          className="primary"
          onClick={() => flash("Privacy assessment started")}
        >
          ＋ New privacy assessment
        </button>
      </div>
      <section className="privacy-metrics">
        <article>
          <small>PROCESSING ACTIVITIES</small>
          <b>31</b>
          <p>Across 24 AI systems</p>
        </article>
        <article>
          <small>CROSS-BORDER TRANSFERS</small>
          <b>8</b>
          <p>2 require renewal</p>
        </article>
        <article>
          <small>RIGHTS REQUESTS</small>
          <b>3</b>
          <p>All within response target</p>
        </article>
        <article>
          <small>RETENTION EXCEPTIONS</small>
          <b>2</b>
          <p>Owner action required</p>
        </article>
      </section>
      <div className="trust-layout privacy-layout">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">DATA FLOW REGISTER</p>
              <h2>Personal-data use by AI systems</h2>
            </div>
            <button>Export record →</button>
          </div>
          <div className="privacy-table">
            <div className="privacy-row head">
              <span>System</span>
              <span>Purpose & basis</span>
              <span>Hosting</span>
              <span>Retention</span>
              <span>Status</span>
            </div>
            {[
              [
                "Retail credit decisioning",
                "Eligibility · Contract / legal obligation",
                "Lagos · Azure South Africa",
                "7 years",
                "Review",
              ],
              [
                "Customer support copilot",
                "Service support · Legitimate interest",
                "EU West · Kenya cache",
                "24 months",
                "Approved",
              ],
              [
                "Marketing propensity",
                "Personalization · Consent",
                "AWS Cape Town",
                "12 months",
                "Action",
              ],
              [
                "Network anomaly detection",
                "Service security · Legitimate interest",
                "Johannesburg",
                "90 days",
                "Approved",
              ],
            ].map((row) => (
              <div className="privacy-row" key={row[0]}>
                {row.map((cell, i) => (
                  <span
                    key={cell}
                    className={
                      i === 4 ? `privacy-state ${cell.toLowerCase()}` : ""
                    }
                  >
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
        <aside className="trust-side">
          <section className="panel mini-panel">
            <p className="eyebrow">PRIVACY CONTROLS</p>
            <h2>Protection status</h2>
            {[
              ["Purpose limitation", 92],
              ["Data minimization", 78],
              ["Retention enforcement", 71],
              ["Transfer safeguards", 83],
              ["Rights fulfillment", 96],
            ].map(([x, n]) => (
              <div className="privacy-control" key={x}>
                <div>
                  <span>{x}</span>
                  <b>{n}%</b>
                </div>
                <div className="progress wide">
                  <i style={{ width: `${n}%` }} />
                </div>
              </div>
            ))}
          </section>
          <section className="panel mini-panel">
            <p className="eyebrow">INDIVIDUAL RIGHTS</p>
            <h2>Request workflow</h2>
            <p className="mini-copy">
              Access, correction, deletion, objection, portability and
              human-review requests are logged with identity verification,
              deadlines and evidence.
            </p>
            <button
              className="full-action"
              onClick={() => flash("Rights request workflow opened")}
            >
              Open request queue
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function TermsOfService() {
  const sections = [
    [
      "1. Platform and scope",
      "Sentinel provides institutional tools for recording, reviewing, approving and monitoring artificial-intelligence systems. The platform supports governance processes; it does not replace legal advice, regulatory determinations, independent validation or accountable human judgment.",
    ],
    [
      "2. Authorized institutional use",
      "Customers must ensure that users are authorized, information entered is accurate, and use complies with applicable law, internal policy and contractual obligations. The platform may not be used to enable unlawful surveillance, discrimination, manipulation or decisions that remove required human oversight.",
    ],
    [
      "3. Customer data and responsibility",
      "The customer retains responsibility for its institutional records, uploaded evidence and system decisions. The customer must have a lawful basis for personal data it enters and must avoid submitting unnecessary sensitive data, credentials or production secrets.",
    ],
    [
      "4. AI-generated assistance",
      "Automated classifications, summaries, control suggestions and jurisdiction mappings are decision-support outputs. They may be incomplete or become outdated. Qualified personnel must review outputs before relying on them for deployment, compliance or individual decisions.",
    ],
    [
      "5. Security and access",
      "Users must protect their credentials, maintain appropriate access rights and report suspected compromise promptly. We may restrict access when necessary to protect users, data, the service or affected individuals.",
    ],
    [
      "6. Service records and availability",
      "The platform maintains operational records to support auditability and security. Availability, support, retention and recovery commitments are governed by the applicable customer order or service agreement.",
    ],
    [
      "7. Suspension and termination",
      "Access may be suspended for material breach, unlawful use, security risk or nonpayment. On termination, customer data will be handled according to the applicable agreement, retention schedule and legal requirements.",
    ],
    [
      "8. Disclaimers and liability",
      "The service is provided subject to the warranties and liability limits in the applicable customer agreement. No platform output guarantees regulatory approval, legal compliance or the absence of AI-related harm.",
    ],
    [
      "9. Changes and governing terms",
      "Material changes will be communicated through the platform or customer contact. A signed customer agreement controls if it conflicts with these online terms.",
    ],
  ];
  return (
    <div className="page terms-page">
      <div className="terms-header">
        <div>
          <p className="eyebrow">LEGAL · OPERATIONAL DRAFT</p>
          <h1>Platform Terms of Service</h1>
          <p>Effective August 16, 2026 · Version 0.9</p>
        </div>
        <span>Counsel review required before public launch</span>
      </div>
      <div className="terms-layout">
        <aside>
          <b>Contents</b>
          {sections.map((s) => (
            <a href={`#term-${s[0][0]}`} key={s[0]}>
              {s[0]}
            </a>
          ))}
        </aside>
        <article className="terms-document">
          <div className="legal-notice">
            <b>Important:</b> These terms are a founder-ready operational draft.
            Local counsel should finalize governing law, liability,
            data-processing, regulatory and customer-contract provisions before
            public use.
          </div>
          {sections.map((s) => (
            <section id={`term-${s[0][0]}`} key={s[0]}>
              <h2>{s[0]}</h2>
              <p>{s[1]}</p>
            </section>
          ))}
          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms, privacy or platform safety may be
              directed to the organization’s designated legal or privacy
              contact.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default function AdminPortal({ user, onLogout, notify }) {
  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);

  return (
    <div className="portal">
      <div className="portal-header">
        <div>
          <div className="portal-greeting glitch">ADMIN CONTROL</div>
          <div className="portal-role">SYSTEM ADMINISTRATOR · {user.name}</div>
        </div>
        <div className="portal-actions">
          <button className="action-btn" onClick={() => notify("Report exported")}>EXPORT</button>
          <button className="btn-solid" onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {[
          { label: "Total Members", val: "2,847", trend: "+12% this month" },
          { label: "Active Today", val: "483", trend: "+8% vs yesterday" },
          { label: "Revenue MTD", val: "₹8.4L", trend: "+18% vs last month" },
          { label: "Classes Today", val: "24", trend: "3 remaining" },
          { label: "Staff On Duty", val: "11", trend: "2 on leave" },
          { label: "Equipment OK", val: "97%", trend: "3 flagged" },
        ].map(d => (
          <div key={d.label} className="dash-card">
            <div className="dash-card-label">{d.label}</div>
            <div className="dash-card-val">{d.val}</div>
            <div className="dash-card-trend up">{d.trend}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {["dashboard", "members", "employees", "schedule"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="section-heading">QUICK OVERVIEW</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ marginBottom: "0.75rem", fontSize: "0.75rem", color: "var(--gray)", letterSpacing: "0.1em" }}>PLAN DISTRIBUTION</div>
              {[{ label: "Premium", pct: 58 }, { label: "Basic", pct: 31 }, { label: "Elite", pct: 11 }].map(p => (
                <div key={p.label} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                    <span>{p.label}</span><span style={{ color: "var(--gray)" }}>{p.pct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.pct}%` }} /></div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ marginBottom: "0.75rem", fontSize: "0.75rem", color: "var(--gray)", letterSpacing: "0.1em" }}>RECENT ACTIVITY</div>
              {["New signup: Ananya Singh (Premium)", "Class cancelled: Yoga 7PM", "Equipment alert: Treadmill #4", "Payment received: ₹4,999", "New hire: Sneha Joshi (Wellness)"].map((a, i) => (
                <div key={i} style={{ fontSize: "0.8rem", padding: "0.6rem 0", borderBottom: "1px solid var(--border)", color: i === 0 ? "#fff" : "var(--gray)" }}>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "members" && (
        <>
          <div className="section-heading">ALL MEMBERS ({users.length})</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Plan</th><th>Sessions</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "var(--gray)" }}>{u.email}</td>
                    <td><span className="badge badge-active">{u.plan}</span></td>
                    <td>{u.sessions}</td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                    <td>
                      <button className="action-btn" onClick={() => {
                        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
                        notify("Member updated");
                      }}>TOGGLE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "employees" && (
        <>
          <div className="section-heading">STAFF DIRECTORY ({employees.length})</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td>{e.role}</td>
                    <td style={{ color: "var(--gray)" }}>{e.dept}</td>
                    <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                    <td>
                      <button className="action-btn" onClick={() => notify("Message sent to " + e.name)}>CONTACT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "schedule" && (
        <>
          <div className="section-heading">WEEKLY CLASS SCHEDULE</div>
          <div className="schedule-grid">
            {Object.entries(SCHEDULE).map(([day, classes]) => (
              <div key={day} className="schedule-day">
                <div className="schedule-day-name">{day}</div>
                {classes.map((c, i) => (
                  <div key={i} className="schedule-class">
                    <div style={{ fontWeight: 600, fontSize: "0.7rem" }}>{c.name}</div>
                    <div style={{ color: "var(--gray)", fontSize: "0.65rem" }}>{c.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
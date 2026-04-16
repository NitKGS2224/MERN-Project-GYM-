function EmployeePortal({ user, onLogout, notify }) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="portal">
      <div className="portal-header">
        <div>
          <div className="portal-greeting">TRAINER HUB</div>
          <div className="portal-role">EMPLOYEE PORTAL · {user.name}</div>
        </div>
        <div className="portal-actions">
          <button className="btn-solid" onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {[
          { label: "My Classes Today", val: "4" },
          { label: "Total Members", val: "38" },
          { label: "Hours This Week", val: "32" },
          { label: "Avg Rating", val: "4.9" },
        ].map(d => (
          <div key={d.label} className="dash-card">
            <div className="dash-card-label">{d.label}</div>
            <div className="dash-card-val">{d.val}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {["dashboard", "my classes", "members", "reports"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="section-heading">TODAY'S SCHEDULE</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Class</th><th>Time</th><th>Room</th><th>Enrolled</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { cls: "Power Lifting", time: "6:00 AM", room: "A1", enrolled: 12, status: "completed" },
                  { cls: "HIIT Cardio", time: "9:00 AM", room: "B2", enrolled: 18, status: "completed" },
                  { cls: "Strength 101", time: "12:00 PM", room: "A1", enrolled: 8, status: "active" },
                  { cls: "Olympic Lift", time: "6:00 PM", room: "C1", enrolled: 6, status: "pending" },
                ].map((c, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{c.cls}</td>
                    <td>{c.time}</td>
                    <td style={{ color: "var(--gray)" }}>{c.room}</td>
                    <td>{c.enrolled}</td>
                    <td><span className={`badge badge-${c.status === "completed" ? "inactive" : c.status === "active" ? "active" : "pending"}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section-heading">MY MEMBERS</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Member</th><th>Plan</th><th>Last Session</th><th>Progress</th></tr></thead>
              <tbody>
                {INITIAL_USERS.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td><span className="badge badge-active">{u.plan}</span></td>
                    <td style={{ color: "var(--gray)" }}>2 days ago</td>
                    <td>
                      <div className="progress-bar" style={{ width: "100px" }}>
                        <div className="progress-fill" style={{ width: `${(u.sessions / 70) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "my classes" && (
        <>
          <div className="section-heading">WEEKLY SCHEDULE</div>
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

      {tab === "members" && (
        <>
          <div className="section-heading">ASSIGNED MEMBERS</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Sessions</th><th>Goal</th><th>Status</th></tr></thead>
              <tbody>
                {INITIAL_USERS.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td>{u.sessions}</td>
                    <td style={{ color: "var(--gray)" }}>Muscle Gain</td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "reports" && (
        <>
          <div className="section-heading">PERFORMANCE METRICS</div>
          {[
            { label: "Member Satisfaction", pct: 96 },
            { label: "Class Attendance Rate", pct: 82 },
            { label: "Goal Achievement", pct: 74 },
            { label: "Retention Rate", pct: 88 },
          ].map(p => (
            <div key={p.label} style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <span>{p.label}</span><span style={{ color: "var(--gray)" }}>{p.pct}%</span>
              </div>
              <div className="progress-bar" style={{ height: "3px" }}>
                <div className="progress-fill" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

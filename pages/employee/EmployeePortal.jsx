import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SCHEDULE = {
  MON: [{ name: 'Power Lifting', time: '6:00 AM', room: 'Zone A' }, { name: 'HIIT', time: '7:00 PM', room: 'Zone B' }],
  TUE: [{ name: 'Boxing', time: '7:00 AM', room: 'Combat Ring' }],
  WED: [{ name: 'Cycling', time: '6:00 AM', room: 'Spin Studio' }, { name: 'HIIT', time: '12:00 PM', room: 'Zone B' }],
  THU: [{ name: 'Olympic Lift', time: '7:00 AM', room: 'Platform' }],
  FRI: [{ name: 'Combat', time: '6:00 AM', room: 'Combat Ring' }, { name: 'Power', time: '7:00 PM', room: 'Zone A' }],
  SAT: [{ name: 'Yoga', time: '8:00 AM', room: 'Yoga Studio' }, { name: 'HIIT', time: '10:00 AM', room: 'Zone B' }],
  SUN: [{ name: 'Recovery', time: '9:00 AM', room: 'Lounge' }],
};

// ─── EMPLOYEE OVERVIEW ─────────────────────────────────────────────────────────
function EmployeeOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    api.get('/employees/dashboard').then(r => setStats(r.data.data)).catch(() => {});
    api.get('/employees/queries').then(r => setRecentQueries(r.data.data?.slice(0, 5) || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {[
          { label: "Open Queries",    value: stats?.assignedQueries ?? '—' },
          { label: "Total Members",   value: stats?.totalUsers      ?? '—' },
          { label: "Classes Today",   value: '4' },
          { label: "Avg Rating",      value: '4.9' },
        ].map(s => (
          <div key={s.label} className="card-stat">
            <div className="font-grotesk text-xs tracking-widest uppercase text-white/35 mb-3">{s.label}</div>
            <div className="font-bebas text-5xl tracking-wide">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Today's Schedule Preview */}
      <div className="border border-white/10">
        <div className="px-6 py-4 border-b border-white/10">
          <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Today's Classes</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Class</th><th>Time</th><th>Room</th><th>Enrolled</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { cls: 'Power Lifting', time: '6:00 AM', room: 'Zone A', enrolled: 12, done: true },
              { cls: 'HIIT Cardio',   time: '9:00 AM', room: 'Zone B', enrolled: 18, done: true },
              { cls: 'Strength 101',  time: '12:00 PM',room: 'Zone A', enrolled:  8, done: false, active: true },
              { cls: 'Olympic Lift',  time: '6:00 PM', room: 'Platform',enrolled: 6, done: false },
            ].map((c, i) => (
              <tr key={i}>
                <td className="font-medium">{c.cls}</td>
                <td>{c.time}</td>
                <td className="text-white/40">{c.room}</td>
                <td>{c.enrolled}</td>
                <td>
                  <span className={`badge ${c.done ? 'badge-inactive' : c.active ? 'badge-active' : 'badge-pending'}`}>
                    {c.done ? 'Done' : c.active ? 'Live' : 'Upcoming'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div className="border border-white/10">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between">
            <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">My Queries</span>
            <Link to="/employee/queries" className="font-grotesk text-xs text-white/40 hover:text-white transition-colors">View all →</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Member</th><th>Subject</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>
              {recentQueries.map(q => (
                <tr key={q._id}>
                  <td className="font-medium">{q.user?.name}</td>
                  <td className="text-white/60 truncate max-w-xs">{q.subject}</td>
                  <td className="text-white/40">{q.category}</td>
                  <td><span className={`badge badge-${q.status === 'open' ? 'open' : q.status === 'in-progress' ? 'progress' : 'resolved'}`}>{q.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── EMPLOYEE MEMBERS VIEW ─────────────────────────────────────────────────────
function EmployeeMembers() {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/employees/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input className="form-input max-w-xs" placeholder="Search members..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="border border-white/10">
        <table className="data-table">
          <thead><tr><th>Member</th><th>Email</th><th>Plan</th><th>Sessions</th><th>Goal</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-white/40">{u.email}</td>
                <td><span className="badge badge-active">{u.plan?.name || 'None'}</span></td>
                <td>{u.sessions}</td>
                <td className="text-white/40">{u.goal || '—'}</td>
                <td><span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} className="text-center text-white/30 py-8">No members found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── EMPLOYEE QUERIES ─────────────────────────────────────────────────────────
function EmployeeQueries() {
  const [queries, setQueries]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');

  useEffect(() => {
    api.get('/employees/queries').then(r => setQueries(r.data.data || [])).catch(() => {});
  }, []);

  const sendReply = async () => {
    if (!reply.trim()) return;
    try {
      const r = await api.post(`/employees/queries/${selected._id}/reply`, { message: reply });
      setQueries(prev => prev.map(q => q._id === selected._id ? r.data.data : q));
      setSelected(r.data.data);
      setReply('');
      toast.success('Reply sent');
    } catch { toast.error('Failed to send'); }
  };

  const resolve = async (id) => {
    try {
      const r = await api.put(`/employees/queries/${id}/resolve`);
      setQueries(prev => prev.map(q => q._id === id ? r.data.data : q));
      if (selected?._id === id) setSelected(r.data.data);
      toast.success('Query resolved');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="border border-white/10">
        <div className="px-4 py-3 border-b border-white/10 font-orbitron text-xs tracking-widest text-white/40 uppercase">
          My Queries ({queries.length})
        </div>
        <div className="divide-y divide-white/[0.05]">
          {queries.map(q => (
            <div key={q._id}
              className={`p-4 cursor-pointer hover:bg-white/[0.04] transition-colors ${selected?._id === q._id ? 'bg-white/[0.06]' : ''}`}
              onClick={() => setSelected(q)}>
              <div className="flex justify-between mb-1">
                <span className="font-grotesk font-medium text-sm truncate pr-2">{q.subject}</span>
                <span className={`badge text-[10px] badge-${q.status === 'open' ? 'open' : q.status === 'in-progress' ? 'progress' : 'resolved'}`}>{q.status}</span>
              </div>
              <div className="font-grotesk text-xs text-white/30">{q.user?.name} · {q.category}</div>
            </div>
          ))}
          {!queries.length && <div className="p-6 text-center text-white/30 text-sm">No queries assigned</div>}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2 border border-white/10 flex flex-col min-h-96">
        {selected ? (
          <>
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <div className="font-grotesk font-semibold">{selected.subject}</div>
                <div className="font-grotesk text-xs text-white/40 mt-0.5">{selected.user?.name} · {selected.category}</div>
              </div>
              {selected.status !== 'resolved' && (
                <button className="btn-action text-[10px]" onClick={() => resolve(selected._id)}>Mark Resolved</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-white/[0.04] border border-white/10 p-4 font-grotesk text-sm text-white/70">
                {selected.message}
              </div>
              {selected.replies?.map((r, i) => (
                <div key={i} className={`p-4 border font-grotesk text-sm
                  ${r.from === 'user' ? 'border-white/10 bg-white/[0.02] text-white/60' : 'border-white/20 bg-white/[0.06] text-white'}`}>
                  <div className="font-orbitron text-[10px] tracking-widest text-white/30 mb-2 uppercase">{r.from}</div>
                  {r.message}
                </div>
              ))}
            </div>
            {selected.status !== 'resolved' && (
              <div className="p-4 border-t border-white/10 flex gap-3">
                <input className="form-input flex-1" placeholder="Reply to this query..."
                  value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()} />
                <button className="btn-primary py-2 px-6 text-xs" onClick={sendReply}>SEND</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20 font-grotesk text-sm">
            Select a query to view
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EMPLOYEE SCHEDULE ────────────────────────────────────────────────────────
function EmployeeSchedule() {
  return (
    <div className="space-y-6">
      <div className="section-heading">Weekly Class Schedule</div>
      <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10">
        {Object.entries(SCHEDULE).map(([day, classes]) => (
          <div key={day} className="bg-black min-h-32 p-3">
            <div className="font-orbitron text-[10px] tracking-widest text-white/35 uppercase mb-3">{day}</div>
            {classes.map((c, i) => (
              <div key={i} className="schedule-class mb-1">
                <div className="font-grotesk font-semibold text-[11px]">{c.name}</div>
                <div className="font-grotesk text-[10px] text-white/40">{c.time}</div>
                <div className="font-grotesk text-[10px] text-white/25">{c.room}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const EMP_TABS = [
  { label: 'Dashboard', path: '/employee' },
  { label: 'Members',   path: '/employee/members' },
  { label: 'Queries',   path: '/employee/queries' },
  { label: 'Schedule',  path: '/employee/schedule' },
];

export default function EmployeePortal() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="portal-wrapper pt-20 px-4 pb-12 max-w-7xl mx-auto">
      <div className="portal-header">
        <div>
          <h1 className="portal-title">TRAINER HUB</h1>
          <p className="portal-role">Employee Portal · {user?.name}</p>
        </div>
      </div>

      <div className="tab-bar">
        {EMP_TABS.map(t => (
          <Link key={t.path} to={t.path}
            className={`tab-item ${location.pathname === t.path ? 'active' : ''}`}>
            {t.label}
          </Link>
        ))}
      </div>

      <Routes>
        <Route index          element={<EmployeeOverview />} />
        <Route path="members"  element={<EmployeeMembers />} />
        <Route path="queries"  element={<EmployeeQueries />} />
        <Route path="schedule" element={<EmployeeSchedule />} />
      </Routes>
    </div>
  );
}

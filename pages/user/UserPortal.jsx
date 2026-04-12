import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SCHEDULE = {
  MON: [{ name: 'HIIT', time: '6:00 AM' }, { name: 'Yoga', time: '7:00 PM' }],
  TUE: [{ name: 'Boxing', time: '7:00 AM' }, { name: 'Lift', time: '6:30 PM' }],
  WED: [{ name: 'Cycling', time: '6:00 AM' }, { name: 'HIIT', time: '12:00 PM' }],
  THU: [{ name: 'Olympic', time: '7:00 AM' }],
  FRI: [{ name: 'Combat', time: '6:00 AM' }, { name: 'Power', time: '7:00 PM' }],
  SAT: [{ name: 'Yoga', time: '8:00 AM' }, { name: 'HIIT', time: '10:00 AM' }],
  SUN: [{ name: 'Recovery', time: '9:00 AM' }],
};

// ─── USER DASHBOARD OVERVIEW ──────────────────────────────────────────────────
function UserOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {[
          { label: 'Sessions Done',  value: user?.sessions ?? 0 },
          { label: 'This Week',      value: '3' },
          { label: 'Streak Days',    value: '7' },
          { label: 'Calories Burned',value: '12.4K' },
        ].map(s => (
          <div key={s.label} className="card-stat">
            <div className="font-grotesk text-xs tracking-widest uppercase text-white/35 mb-3">{s.label}</div>
            <div className="font-bebas text-5xl tracking-wide">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="border border-white/10">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between">
          <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Upcoming Classes</span>
          <Link to="/dashboard/schedule" className="font-grotesk text-xs text-white/40 hover:text-white transition-colors">View all →</Link>
        </div>
        <table className="data-table">
          <thead><tr><th>Class</th><th>Trainer</th><th>Date</th><th>Time</th><th></th></tr></thead>
          <tbody>
            {[
              { cls: 'HIIT Cardio',   trainer: 'Raj Kumar',   date: 'Tomorrow', time: '6:00 AM' },
              { cls: 'Power Lifting', trainer: 'Raj Kumar',   date: 'Thu',      time: '7:00 PM' },
              { cls: 'Yoga',          trainer: 'Priya Devi',  date: 'Sat',      time: '8:00 AM' },
            ].map((c, i) => (
              <tr key={i}>
                <td className="font-medium">{c.cls}</td>
                <td className="text-white/40">{c.trainer}</td>
                <td>{c.date}</td>
                <td>{c.time}</td>
                <td>
                  <button className="btn-action text-[10px]" onClick={() => toast.success('Class booked!')}>BOOK</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Announcements */}
      <div className="border border-white/10">
        <div className="px-6 py-4 border-b border-white/10">
          <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Announcements</span>
        </div>
        <div className="p-6 space-y-4">
          {[
            { text: 'New Zumba classes starting Monday — limited spots!', highlight: true },
            { text: 'Gym will be closed on April 14 for maintenance.' },
            { text: 'New Olympic platforms installed in Zone C — check it out!' },
            { text: 'Monthly fitness assessment available — book with your trainer.' },
          ].map((a, i) => (
            <div key={i}
              className={`pl-4 border-l-2 py-2 font-grotesk text-sm
                ${a.highlight ? 'border-white/60 text-white' : 'border-white/15 text-white/40'}`}>
              {a.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USER SCHEDULE ─────────────────────────────────────────────────────────────
function UserSchedule() {
  return (
    <div className="space-y-6">
      <div className="section-heading">Weekly Class Schedule — Click to Book</div>
      <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10">
        {Object.entries(SCHEDULE).map(([day, classes]) => (
          <div key={day} className="bg-black min-h-28 p-3">
            <div className="font-orbitron text-[10px] tracking-widest text-white/35 uppercase mb-3">{day}</div>
            {classes.map((c, i) => (
              <div key={i} className="schedule-class" onClick={() => toast.success(`${c.name} added to calendar!`)}>
                <div className="font-grotesk font-semibold text-[11px]">{c.name}</div>
                <div className="font-grotesk text-[10px] text-white/40">{c.time}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── USER PROGRESS ─────────────────────────────────────────────────────────────
function UserProgress() {
  return (
    <div className="space-y-8">
      {/* Goal progress */}
      <div className="border border-white/10 p-6">
        <div className="section-heading">Fitness Goals</div>
        <div className="space-y-6">
          {[
            { label: 'Strength Goal',    pct: 68 },
            { label: 'Cardio Goal',      pct: 82 },
            { label: 'Flexibility Goal', pct: 45 },
            { label: 'Weight Goal',      pct: 71 },
          ].map(g => (
            <div key={g.label}>
              <div className="flex justify-between mb-2">
                <span className="font-grotesk font-medium text-sm">{g.label}</span>
                <span className="font-grotesk text-xs text-white/40">{g.pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${g.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout history */}
      <div className="border border-white/10">
        <div className="px-6 py-4 border-b border-white/10">
          <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Workout History</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Class</th><th>Duration</th><th>Calories</th><th>Trainer</th></tr></thead>
          <tbody>
            {[
              { date: 'Apr 10', cls: 'HIIT Cardio',   dur: '45 min', cal: '420', trainer: 'Raj Kumar' },
              { date: 'Apr 8',  cls: 'Power Lifting', dur: '60 min', cal: '280', trainer: 'Raj Kumar' },
              { date: 'Apr 6',  cls: 'Yoga',          dur: '75 min', cal: '180', trainer: 'Priya Devi' },
              { date: 'Apr 4',  cls: 'Boxing',        dur: '50 min', cal: '510', trainer: 'Aryan Mehta' },
              { date: 'Apr 2',  cls: 'Olympic Lift',  dur: '55 min', cal: '320', trainer: 'Sahil Khan' },
            ].map((r, i) => (
              <tr key={i}>
                <td className="text-white/40">{r.date}</td>
                <td className="font-medium">{r.cls}</td>
                <td>{r.dur}</td>
                <td>{r.cal} kcal</td>
                <td className="text-white/40">{r.trainer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── USER PACKAGE PAGE ────────────────────────────────────────────────────────
function UserPackage() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.get('/users/purchases').then(r => setPurchases(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="border border-white/10 p-6">
        <div className="section-heading">My Membership</div>
        {purchases.length > 0 ? (
          <div className="space-y-4">
            {purchases.map(p => (
              <div key={p._id} className="flex justify-between items-center border border-white/10 p-4">
                <div>
                  <div className="font-bebas text-2xl tracking-wide">{p.package?.name}</div>
                  <div className="font-grotesk text-xs text-white/40">
                    {new Date(p.startDate).toLocaleDateString()} → {new Date(p.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bebas text-2xl">₹{p.amount?.toLocaleString()}</div>
                  <span className={`badge badge-${p.status === 'completed' ? 'active' : 'inactive'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="font-bebas text-5xl text-white/10 mb-4">NO PLAN</div>
            <p className="font-grotesk text-white/40 text-sm mb-6">You don't have an active membership plan.</p>
            <button className="btn-primary px-8 py-3" onClick={() => navigate('/pricing')}>
              VIEW PLANS →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── USER SUPPORT ─────────────────────────────────────────────────────────────
function UserSupport() {
  const [queries, setQueries]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');
  const [form, setForm] = useState({ subject: '', message: '', category: 'General', priority: 'medium' });
  const [loading, setLoading]   = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    api.get('/queries/my').then(r => setQueries(r.data.data || [])).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/queries', form);
      setQueries(prev => [r.data.data, ...prev]);
      setShowForm(false);
      setForm({ subject: '', message: '', category: 'General', priority: 'medium' });
      toast.success('Query submitted! A trainer will respond shortly.');
    } catch { toast.error('Failed to submit query'); }
    finally { setLoading(false); }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    const r = await api.post(`/queries/${selected._id}/reply`, { message: reply });
    setQueries(prev => prev.map(q => q._id === selected._id ? r.data.data : q));
    setSelected(r.data.data);
    setReply('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="btn-primary py-2 px-6 text-xs" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'CANCEL' : '+ NEW QUERY'}
        </button>
      </div>

      {showForm && (
        <div className="border border-white/10 p-6 animate-fadeUp">
          <div className="section-heading">Submit a Query</div>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={set('category')}>
                  {['General','Training','Billing','Package','Complaint','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={set('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="Brief description of your issue"
                value={form.subject} onChange={set('subject')} required />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea className="form-input h-32 resize-none" placeholder="Describe your issue in detail..."
                value={form.message} onChange={set('message')} required />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary py-2 px-8 text-xs">
                {loading ? 'SUBMITTING...' : 'SUBMIT QUERY'}
              </button>
            </div>
          </form>
        </div>
      )}

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
                <div className="font-grotesk text-xs text-white/30">{q.category}</div>
              </div>
            ))}
            {!queries.length && <div className="p-6 text-center text-white/30 text-sm">No queries yet</div>}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 border border-white/10 flex flex-col min-h-64">
          {selected ? (
            <>
              <div className="px-6 py-4 border-b border-white/10">
                <div className="font-grotesk font-semibold">{selected.subject}</div>
                <div className="font-grotesk text-xs text-white/40 mt-0.5">{selected.category} · {selected.priority} priority</div>
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
                  <input className="form-input flex-1" placeholder="Add a message..."
                    value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendReply()} />
                  <button className="btn-primary py-2 px-5 text-xs" onClick={sendReply}>SEND</button>
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
    </div>
  );
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────
function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit]       = useState(false);
  const [form, setForm]       = useState({ name: '', phone: '', goal: '' });

  useEffect(() => {
    api.get('/users/profile').then(r => {
      setProfile(r.data.data);
      setForm({ name: r.data.data.name, phone: r.data.data.phone || '', goal: r.data.data.goal || '' });
    }).catch(() => {});
  }, []);

  const save = async () => {
    await api.put('/users/profile', form);
    setProfile(p => ({ ...p, ...form }));
    setEdit(false);
    toast.success('Profile updated');
  };

  const p = profile || user;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile card */}
      <div className="border border-white/10 p-6 text-center">
        <div className="w-20 h-20 bg-white/[0.06] border border-white/10 flex items-center justify-center
                        font-bebas text-3xl mx-auto mb-4 rounded-sm">
          {p?.name?.[0] || 'U'}
        </div>
        <div className="font-bebas text-3xl tracking-wide mb-1">{p?.name}</div>
        <div className="font-grotesk text-xs text-white/40 mb-4">
          Member since {p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '—'}
        </div>
        <span className="badge badge-active">{profile?.plan?.name || 'No Plan'}</span>

        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mt-6">
          <div className="bg-black p-3">
            <div className="font-bebas text-2xl">{p?.sessions || 0}</div>
            <div className="font-grotesk text-[10px] text-white/35 uppercase tracking-wider">Sessions</div>
          </div>
          <div className="bg-black p-3">
            <div className="font-bebas text-2xl">7</div>
            <div className="font-grotesk text-[10px] text-white/35 uppercase tracking-wider">Streak</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="section-heading mb-0">Account Details</div>
            <button className="btn-action text-[10px]" onClick={() => setEdit(e => !e)}>
              {edit ? 'CANCEL' : 'EDIT'}
            </button>
          </div>

          {edit ? (
            <div className="space-y-4">
              <div><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label className="form-label">Fitness Goal</label><input className="form-input" placeholder="e.g. Lose weight, Build muscle..." value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} /></div>
              <button className="btn-primary py-2 px-6 text-xs" onClick={save}>SAVE CHANGES</button>
            </div>
          ) : (
            <table className="data-table">
              <tbody>
                {[
                  ['Email', p?.email],
                  ['Phone', p?.phone || '—'],
                  ['Fitness Goal', p?.goal || '—'],
                  ['Plan', profile?.plan?.name || 'None'],
                  ['Plan Expires', profile?.planExpiresAt ? new Date(profile.planExpiresAt).toLocaleDateString() : '—'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="text-white/40 w-1/3">{k}</td>
                    <td className="font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── USER PORTAL LAYOUT ───────────────────────────────────────────────────────
const USER_TABS = [
  { label: 'Dashboard',  path: '/dashboard' },
  { label: 'Schedule',   path: '/dashboard/schedule' },
  { label: 'Progress',   path: '/dashboard/progress' },
  { label: 'My Package', path: '/dashboard/package' },
  { label: 'Support',    path: '/dashboard/support' },
  { label: 'Profile',    path: '/dashboard/profile' },
];

export default function UserPortal() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="portal-wrapper pt-20 px-4 pb-12 max-w-7xl mx-auto">
      <div className="portal-header">
        <div>
          <h1 className="portal-title">MY FORGE</h1>
          <p className="portal-role">Member Portal · {user?.name}</p>
        </div>
      </div>

      <div className="tab-bar overflow-x-auto">
        {USER_TABS.map(t => (
          <Link key={t.path} to={t.path}
            className={`tab-item flex-shrink-0 ${location.pathname === t.path ? 'active' : ''}`}>
            {t.label}
          </Link>
        ))}
      </div>

      <Routes>
        <Route index            element={<UserOverview />} />
        <Route path="schedule"  element={<UserSchedule />} />
        <Route path="progress"  element={<UserProgress />} />
        <Route path="package"   element={<UserPackage />} />
        <Route path="support"   element={<UserSupport />} />
        <Route path="profile"   element={<UserProfile />} />
      </Routes>
    </div>
  );
}

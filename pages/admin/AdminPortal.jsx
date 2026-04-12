import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub, up }) {
  return (
    <div className="card-stat transition-all duration-300 hover:-translate-y-0.5">
      <div className="font-grotesk text-xs tracking-widest uppercase text-white/35 mb-3">{label}</div>
      <div className="font-bebas text-5xl tracking-wide leading-none">{value}</div>
      {sub && <div className={`font-grotesk text-xs mt-2 ${up ? 'text-white/60' : 'text-white/30'}`}>{sub}</div>}
    </div>
  );
}

// ─── ADMIN OVERVIEW ─────────────────────────────────────────────────────────────
function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data.data)).catch(() => {});
    api.get('/admin/users').then(r => setRecentUsers(r.data.data?.slice(0, 5) || [])).catch(() => {});
  }, []);

  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
        <StatCard label="Total Members"   value={stats?.totalUsers      ?? '—'} sub="+12% this month" up />
        <StatCard label="Total Employees" value={stats?.totalEmployees  ?? '—'} sub="All active"      up />
        <StatCard label="Purchases"       value={stats?.totalPurchases  ?? '—'} sub="+18% this month" up />
        <StatCard label="Open Queries"    value={stats?.openQueries     ?? '—'} sub="Needs attention" />
        <StatCard label="Revenue"         value={stats?.totalRevenue ? fmt(stats.totalRevenue) : '₹0'} sub="All time" up />
      </div>

      {/* Recent members */}
      <div className="border border-white/10">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <span className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Recent Members</span>
          <Link to="/admin/members" className="font-grotesk text-xs text-white/40 hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-white/40">{u.email}</td>
                <td><span className="badge badge-active">{u.plan?.name || 'None'}</span></td>
                <td><span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="text-white/40">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!recentUsers.length && (
              <tr><td colSpan={5} className="text-center text-white/30 py-8">No members yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MEMBERS MANAGEMENT ─────────────────────────────────────────────────────────
function AdminMembers() {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const toggle = async (id) => {
    try {
      const r = await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: r.data.data.isActive } : u));
      toast.success('Member status updated');
    } catch { toast.error('Failed to update'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this member permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('Member deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input className="form-input max-w-xs" placeholder="Search members..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <span className="font-grotesk text-xs text-white/30">{filtered.length} members</span>
      </div>

      <div className="border border-white/10">
        <table className="data-table">
          <thead>
            <tr><th>Member</th><th>Email</th><th>Plan</th><th>Sessions</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-white/40">{u.email}</td>
                <td><span className="badge badge-active">{u.plan?.name || 'None'}</span></td>
                <td>{u.sessions}</td>
                <td><span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="text-white/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-action" onClick={() => toggle(u._id)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-danger" onClick={() => del(u._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} className="text-center text-white/30 py-8">No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── EMPLOYEE MANAGEMENT ──────────────────────────────────────────────────────
function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', designation: 'Head Trainer', department: 'Fitness', phone: '', salary: '' });
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    api.get('/admin/employees').then(r => setEmployees(r.data.data || [])).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const addEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/admin/employees', form);
      setEmployees(prev => [r.data.data, ...prev]);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', designation: 'Head Trainer', department: 'Fitness', phone: '', salary: '' });
      toast.success('Employee added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    await api.delete(`/admin/employees/${id}`);
    setEmployees(prev => prev.filter(e => e._id !== id));
    toast.success('Employee removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="font-grotesk text-xs text-white/30">{employees.length} employees</span>
        <button className="btn-primary py-2 px-6 text-xs" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'CANCEL' : '+ ADD EMPLOYEE'}
        </button>
      </div>

      {showForm && (
        <div className="border border-white/10 p-6 animate-fadeUp">
          <div className="section-heading">Add New Employee</div>
          <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={set('name')} required /></div>
            <div><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={set('email')} required /></div>
            <div><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={set('password')} required /></div>
            <div><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={set('phone')} /></div>
            <div>
              <label className="form-label">Designation</label>
              <select className="form-select" value={form.designation} onChange={set('designation')}>
                {['Head Trainer','Yoga Instructor','Combat Coach','Nutritionist','Reception','Maintenance'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Department</label>
              <select className="form-select" value={form.department} onChange={set('department')}>
                {['Fitness','Wellness','Combat','Nutrition','Operations'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" className="btn-action" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary py-2 px-6 text-xs">
                {loading ? 'ADDING...' : 'ADD EMPLOYEE'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-white/10">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Designation</th><th>Department</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e._id}>
                <td className="font-medium">{e.name}</td>
                <td className="text-white/40">{e.email}</td>
                <td>{e.designation}</td>
                <td className="text-white/40">{e.department}</td>
                <td><span className={`badge badge-${e.isActive ? 'active' : 'inactive'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <button className="btn-danger" onClick={() => del(e._id)}>Remove</button>
                </td>
              </tr>
            ))}
            {!employees.length && (
              <tr><td colSpan={6} className="text-center text-white/30 py-8">No employees yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAYMENTS / FINANCIALS ────────────────────────────────────────────────────
function AdminPayments() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.get('/admin/purchases').then(r => setPurchases(r.data.data || [])).catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const r = await api.put(`/admin/purchases/${id}/status`, { status });
      setPurchases(prev => prev.map(p => p._id === id ? { ...p, status: r.data.data.status } : p));
      toast.success('Payment status updated');
    } catch { toast.error('Failed to update'); }
  };

  const totalRevenue = purchases.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
        <StatCard label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} sub="All time" up />
        <StatCard label="Completed" value={purchases.filter(p => p.status === 'completed').length} sub="Transactions" up />
        <StatCard label="Pending"   value={purchases.filter(p => p.status === 'pending').length}   sub="Need review" />
      </div>

      <div className="border border-white/10">
        <table className="data-table">
          <thead>
            <tr><th>Member</th><th>Package</th><th>Amount</th><th>Billing</th><th>Method</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p._id}>
                <td className="font-medium">{p.user?.name || '—'}</td>
                <td>{p.package?.name || '—'}</td>
                <td className="font-bebas text-lg">₹{p.amount?.toLocaleString()}</td>
                <td className="text-white/40 capitalize">{p.billingCycle}</td>
                <td className="text-white/40 capitalize">{p.paymentMethod}</td>
                <td><span className={`badge badge-${p.status === 'completed' ? 'active' : p.status === 'pending' ? 'pending' : 'inactive'}`}>{p.status}</span></td>
                <td className="text-white/40">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  {p.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="btn-action text-[10px]" onClick={() => updateStatus(p._id, 'completed')}>Approve</button>
                      <button className="btn-danger"            onClick={() => updateStatus(p._id, 'failed')}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!purchases.length && (
              <tr><td colSpan={8} className="text-center text-white/30 py-8">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PACKAGE MANAGEMENT ───────────────────────────────────────────────────────
function AdminPackages() {
  const [pkgs, setPkgs]       = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: 'Basic',
    'price.monthly': '', 'price.quarterly': '', 'price.yearly': '',
    features: '', isPopular: false, isActive: true,
  });

  useEffect(() => {
    api.get('/packages').then(r => setPkgs(r.data.data || [])).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const addPkg = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name, description: form.description, category: form.category,
      price: { monthly: +form['price.monthly'], quarterly: +form['price.quarterly'], yearly: +form['price.yearly'] },
      features: form.features.split('\n').filter(Boolean),
      isPopular: form.isPopular, isActive: form.isActive,
    };
    const r = await api.post('/packages', payload);
    setPkgs(prev => [...prev, r.data.data]);
    setShowForm(false);
    toast.success('Package created');
  };

  const togglePkg = async (id, isActive) => {
    await api.put(`/packages/${id}`, { isActive: !isActive });
    setPkgs(prev => prev.map(p => p._id === id ? { ...p, isActive: !isActive } : p));
    toast.success('Package updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="btn-primary py-2 px-6 text-xs" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'CANCEL' : '+ NEW PACKAGE'}
        </button>
      </div>

      {showForm && (
        <div className="border border-white/10 p-6 animate-fadeUp">
          <div className="section-heading">Create Package</div>
          <form onSubmit={addPkg} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="form-label">Package Name</label><input className="form-input" value={form.name} onChange={set('name')} required /></div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                {['Basic','Premium','Elite'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={set('description')} required /></div>
            <div><label className="form-label">Monthly Price (₹)</label><input className="form-input" type="number" value={form['price.monthly']} onChange={set('price.monthly')} required /></div>
            <div><label className="form-label">Quarterly Price (₹)</label><input className="form-input" type="number" value={form['price.quarterly']} onChange={set('price.quarterly')} /></div>
            <div><label className="form-label">Yearly Price (₹)</label><input className="form-input" type="number" value={form['price.yearly']} onChange={set('price.yearly')} /></div>
            <div>
              <label className="form-label">Features (one per line)</label>
              <textarea className="form-input h-28 resize-none" value={form.features} onChange={set('features')} placeholder={"Full gym access\nUnlimited classes"} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPopular} onChange={set('isPopular')} className="w-4 h-4" />
                <span className="form-label mb-0">Mark as Popular</span>
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="submit" className="btn-primary py-2 px-6 text-xs">CREATE PACKAGE</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {pkgs.map(p => (
          <div key={p._id} className="bg-black p-6 hover:bg-white/[0.03] transition-all">
            {p.isPopular && <span className="badge badge-active mb-3">POPULAR</span>}
            <div className="font-bebas text-3xl tracking-wide mb-1">{p.name}</div>
            <div className="font-grotesk text-xs text-white/40 mb-4">{p.category}</div>
            <div className="font-bebas text-4xl mb-4">₹{p.price?.monthly?.toLocaleString()}<span className="font-grotesk text-sm text-white/30">/mo</span></div>
            <div className="flex gap-2 mt-4">
              <button className="btn-action flex-1 text-[10px]" onClick={() => togglePkg(p._id, p.isActive)}>
                {p.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUERIES VIEW ─────────────────────────────────────────────────────────────
function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');

  useEffect(() => {
    api.get('/admin/queries').then(r => setQueries(r.data.data || [])).catch(() => {});
  }, []);

  const sendReply = async () => {
    if (!reply.trim()) return;
    const r = await api.post(`/queries/${selected._id}/reply`, { message: reply });
    setQueries(prev => prev.map(q => q._id === selected._id ? r.data.data : q));
    setSelected(r.data.data);
    setReply('');
    toast.success('Reply sent');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Query list */}
      <div className="border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 font-orbitron text-xs tracking-widest text-white/40 uppercase">
          All Queries ({queries.length})
        </div>
        <div className="divide-y divide-white/[0.05]">
          {queries.map(q => (
            <div key={q._id}
              className={`p-4 cursor-pointer transition-colors hover:bg-white/[0.04] ${selected?._id === q._id ? 'bg-white/[0.06]' : ''}`}
              onClick={() => setSelected(q)}>
              <div className="flex justify-between items-start mb-1">
                <div className="font-grotesk font-medium text-sm truncate pr-2">{q.subject}</div>
                <span className={`badge badge-${q.status === 'open' ? 'open' : q.status === 'in-progress' ? 'progress' : 'resolved'} text-[10px] flex-shrink-0`}>
                  {q.status}
                </span>
              </div>
              <div className="font-grotesk text-xs text-white/30">{q.user?.name} · {q.category}</div>
            </div>
          ))}
          {!queries.length && <div className="p-6 text-center text-white/30 text-sm">No queries</div>}
        </div>
      </div>

      {/* Query detail */}
      <div className="lg:col-span-2 border border-white/10 flex flex-col">
        {selected ? (
          <>
            <div className="px-6 py-4 border-b border-white/10">
              <div className="font-grotesk font-semibold">{selected.subject}</div>
              <div className="font-grotesk text-xs text-white/40 mt-0.5">
                From: {selected.user?.name} · {selected.category} · {selected.priority} priority
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-white/[0.04] border border-white/10 p-4 font-grotesk text-sm text-white/70">
                {selected.message}
              </div>
              {selected.replies?.map((r, i) => (
                <div key={i} className={`p-4 border font-grotesk text-sm
                  ${r.from === 'user'
                    ? 'border-white/10 bg-white/[0.02] text-white/60'
                    : 'border-white/20 bg-white/[0.06] text-white'}`}>
                  <div className="font-orbitron text-[10px] tracking-widest text-white/30 mb-2 uppercase">{r.from}</div>
                  {r.message}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-3">
              <input className="form-input flex-1" placeholder="Write a reply..."
                value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()} />
              <button className="btn-primary py-2 px-6 text-xs" onClick={sendReply}>SEND</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20 font-grotesk text-sm">
            Select a query to view details
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN LAYOUT ─────────────────────────────────────────────────────────────
const ADMIN_TABS = [
  { label: 'Overview',   path: '/admin' },
  { label: 'Members',    path: '/admin/members' },
  { label: 'Employees',  path: '/admin/employees' },
  { label: 'Payments',   path: '/admin/payments' },
  { label: 'Packages',   path: '/admin/packages' },
  { label: 'Queries',    path: '/admin/queries' },
];

export default function AdminPortal() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="portal-wrapper pt-20 px-4 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="portal-header">
        <div>
          <h1 className="portal-title animate-glitch">ADMIN CONTROL</h1>
          <p className="portal-role">System Administrator · {user?.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {ADMIN_TABS.map(t => (
          <Link key={t.path} to={t.path}
            className={`tab-item ${location.pathname === t.path ? 'active' : ''}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <Routes>
        <Route index          element={<AdminOverview />} />
        <Route path="members"   element={<AdminMembers />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="payments"  element={<AdminPayments />} />
        <Route path="packages"  element={<AdminPackages />} />
        <Route path="queries"   element={<AdminQueries />} />
      </Routes>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATIC_PACKAGES = [
  {
    _id: 'basic', name: 'Basic Forge', category: 'Basic', isPopular: false,
    description: 'The perfect starting point. Access core gym equipment and group classes.',
    price: { monthly: 999, quarterly: 2699, yearly: 9999 },
    features: [
      'Full gym floor access',
      '2 group classes/week',
      'Locker room access',
      'Basic fitness assessment',
      'App access & workout tracking',
    ],
  },
  {
    _id: 'premium', name: 'Premium Forge', category: 'Premium', isPopular: true,
    description: 'Our most popular plan. Unlimited classes, personal training sessions included.',
    price: { monthly: 1999, quarterly: 5399, yearly: 18999 },
    features: [
      'Everything in Basic',
      'Unlimited group classes',
      '4 PT sessions/month',
      'Nutrition consultation',
      'Sauna & recovery lounge',
      'Priority class booking',
      'Guest passes (2/month)',
    ],
  },
  {
    _id: 'elite', name: 'Elite Forge', category: 'Elite', isPopular: false,
    description: 'The ultimate IronForge experience. Dedicated coach, custom programming.',
    price: { monthly: 3999, quarterly: 10799, yearly: 35999 },
    features: [
      'Everything in Premium',
      'Dedicated personal coach',
      'Custom training program',
      'Weekly nutrition check-in',
      'Unlimited PT sessions',
      'Merchandise credit (₹500/mo)',
      '24/7 gym access',
      'Free guest access',
    ],
  },
];

export default function PricingPage({ onSignup }) {
  const { user, isUser } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages]     = useState(STATIC_PACKAGES);
  const [billing, setBilling]       = useState('monthly');
  const [purchasing, setPurchasing] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPkg, setSelectedPkg]   = useState(null);
  const [payMethod, setPayMethod]       = useState('card');

  useEffect(() => {
    api.get('/packages').then(r => {
      if (r.data.data?.length) setPackages(r.data.data);
    }).catch(() => {}); // fall back to static
  }, []);

  const handleBuy = (pkg) => {
    if (!user) { onSignup?.(); return; }
    if (!isUser) { toast.error('Please login as a member to purchase a plan.'); return; }
    setSelectedPkg(pkg);
    setShowPayModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPkg) return;
    setPurchasing(selectedPkg._id);
    try {
      await api.post(`/packages/${selectedPkg._id}/purchase`, { billingCycle: billing, paymentMethod: payMethod });
      toast.success(`🎉 ${selectedPkg.name} activated! Welcome to the next level.`);
      setShowPayModal(false);
      navigate('/dashboard/package');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed. Try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const price = (pkg) => pkg.price?.[billing] ?? pkg.price?.monthly;
  const savings = (pkg) => {
    const mon = pkg.price?.monthly * (billing === 'quarterly' ? 3 : 12);
    const act = pkg.price?.[billing];
    return billing !== 'monthly' ? Math.round(((mon - act) / mon) * 100) : 0;
  };

  return (
    <div className="relative z-10 min-h-screen pt-24 pb-20 px-4">
      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="font-orbitron text-xs tracking-widest text-white/30 uppercase mb-4">Membership Plans</p>
        <h1 className="font-bebas text-7xl sm:text-9xl tracking-wide leading-none mb-6">PRICING</h1>
        <p className="font-grotesk text-white/40 leading-relaxed">
          No hidden fees. No lock-in contracts. Just results. Choose the plan that fits your goals.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-14">
        <div className="flex border border-white/15">
          {['monthly', 'quarterly', 'yearly'].map(b => (
            <button key={b}
              className={`px-6 py-2.5 font-grotesk text-xs tracking-widest uppercase transition-all duration-200
                ${billing === b ? 'bg-white text-black font-semibold' : 'text-white/40 hover:text-white/70'}`}
              onClick={() => setBilling(b)}>
              {b}
              {b === 'yearly' && <span className="ml-1.5 text-[10px] text-white/50">(Save 30%)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {packages.map(pkg => (
          <div key={pkg._id}
            className={`relative bg-black p-8 flex flex-col transition-all duration-300 hover:bg-white/[0.03]
              ${pkg.isPopular ? 'border-t-2 border-t-white' : ''}`}>
            {pkg.isPopular && (
              <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-full
                              font-orbitron text-[10px] tracking-widest uppercase bg-white text-black px-3 py-1">
                MOST POPULAR
              </div>
            )}

            <div className="mb-6">
              <div className="font-orbitron text-xs tracking-widest text-white/40 uppercase mb-2">{pkg.category}</div>
              <h3 className="font-bebas text-4xl tracking-wide mb-3">{pkg.name}</h3>
              <p className="font-grotesk text-white/40 text-sm leading-relaxed">{pkg.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="font-grotesk text-sm text-white/40">₹</span>
                <span className="font-bebas text-6xl tracking-wide">{price(pkg).toLocaleString()}</span>
                <span className="font-grotesk text-xs text-white/30">/{billing === 'monthly' ? 'mo' : billing === 'quarterly' ? 'qtr' : 'yr'}</span>
              </div>
              {savings(pkg) > 0 && (
                <div className="font-grotesk text-xs text-white/40 mt-1">
                  Save {savings(pkg)}% vs monthly
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-10 flex-1">
              {pkg.features?.map(f => (
                <li key={f} className="flex items-start gap-3 font-grotesk text-sm text-white/60">
                  <span className="text-white mt-0.5 flex-shrink-0">—</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy(pkg)}
              disabled={purchasing === pkg._id}
              className={`w-full py-3.5 font-grotesk font-bold text-sm tracking-widest uppercase transition-all duration-300
                ${pkg.isPopular
                  ? 'btn-primary'
                  : 'btn-outline'
                } disabled:opacity-50`}>
              {purchasing === pkg._id ? 'PROCESSING...' : !user ? 'GET STARTED →' : 'SELECT PLAN →'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ strip */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { q: 'Cancel anytime?', a: 'Yes. No contracts, no questions. Cancel in your dashboard instantly.' },
            { q: 'Is equipment included?', a: 'Full access to all gym equipment with every plan.' },
            { q: 'Free trial available?', a: 'Yes! First 7 days free when you sign up for any plan.' },
          ].map(f => (
            <div key={f.q} className="border border-white/10 p-6">
              <div className="font-orbitron text-sm font-bold mb-3">{f.q}</div>
              <div className="font-grotesk text-xs text-white/40 leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && selectedPkg && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPayModal(false)}>
          <div className="modal-box max-w-sm">
            <button onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 w-8 h-8 border border-white/15 text-white/40 flex items-center justify-center text-sm hover:border-white/50 hover:text-white transition-all">
              ✕
            </button>

            <div className="font-orbitron font-black text-sm tracking-widest mb-8">
              IRON<span className="text-white/30">FORGE</span>
            </div>

            <h3 className="font-bebas text-4xl tracking-wide mb-1">CHECKOUT</h3>
            <p className="text-white/40 text-xs tracking-wider mb-8">Complete your membership purchase</p>

            {/* Order summary */}
            <div className="border border-white/10 p-4 mb-6 space-y-2 font-grotesk text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Plan</span>
                <span className="font-semibold">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Billing</span>
                <span className="capitalize">{billing}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-white/50">Total</span>
                <span className="font-bebas text-2xl">₹{price(selectedPkg).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="mb-6">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="cash">Pay at Counter</option>
              </select>
            </div>

            {payMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="form-label">Card Number</label>
                  <input className="form-input" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Expiry</label>
                    <input className="form-input" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="form-label">CVV</label>
                    <input className="form-input" placeholder="•••" />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div className="mb-6">
                <label className="form-label">UPI ID</label>
                <input className="form-input" placeholder="yourname@upi" />
              </div>
            )}

            <button onClick={confirmPurchase} disabled={!!purchasing}
              className="btn-primary w-full py-4 disabled:opacity-50">
              {purchasing ? 'PROCESSING...' : `PAY ₹${price(selectedPkg).toLocaleString()} →`}
            </button>

            <p className="text-[10px] text-white/20 text-center mt-4">
              🔒 Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

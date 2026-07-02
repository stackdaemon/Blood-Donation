import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../context/AuthContext';
import { Heart, Coins, DollarSign, Calendar, Mail, User, ShieldCheck } from 'lucide-react';

const Funding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fundingLogs, setFundingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [donateAmount, setDonateAmount] = useState('20');
  const [customAmount, setCustomAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchFundingHistory = async () => {
    try {
      const response = await api.get('/funding');
      setFundingLogs(response.data);
    } catch (err) {
      console.error('Failed to load funding history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check URL parameters for Stripe success/cancel redirect states
  useEffect(() => {
    const handleRedirectCallbacks = async () => {
      await fetchFundingHistory();

      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      const isMock = searchParams.get('mock') === 'true';
      const mockAmount = searchParams.get('amount');

      if (success === 'true') {
        if (isMock && mockAmount) {
          // If in mock mode, trigger a call to log the simulated payment in DB
          try {
            await api.post('/funding/log-mock', { amount: Number(mockAmount) });
            setSuccessMessage(`Thank you! Your mock donation of $${mockAmount} was recorded successfully.`);
            await fetchFundingHistory();
          } catch (err) {
            console.error('Failed to save mock donation:', err);
            setErrorMessage('Mock payment succeeded, but failed to log transaction.');
          }
        } else {
          // Live/Test Webhook processed payment
          setSuccessMessage('Thank you! Your donation was completed successfully via Stripe checkout.');
          await fetchFundingHistory();
        }
      } else if (canceled === 'true') {
        setErrorMessage('Donation was cancelled. Feel free to contribute at any time!');
      }

      // Clear search query parameters to keep URL clean
      if (success || canceled) {
        setSearchParams({});
      }
    };

    handleRedirectCallbacks();
  }, [searchParams]);

  const getAmountToDonate = () => {
    if (donateAmount === 'custom') {
      return Number(customAmount) || 0;
    }
    return Number(donateAmount);
  };

  const handleDonateCheckout = async () => {
    const finalAmount = getAmountToDonate();
    if (finalAmount <= 0) {
      alert('Please select or specify a valid donation amount.');
      return;
    }

    setCheckoutLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Call backend to create checkout session
      const res = await api.post('/funding/create-checkout-session', { amount: finalAmount });
      const { url } = res.data;

      // Redirect to Stripe checkout page (or mock URL)
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to redirect to Stripe checkout.');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold uppercase tracking-wider rounded-full">
            <Coins className="h-3.5 w-3.5" />
            <span>Support Platform</span>
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Funding & Donations</h1>
          <p className="text-slate-500 text-sm">Contribute to administrative costs and camp logistics to save more lives.</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-3xl p-5 text-sm font-semibold max-w-lg mx-auto flex items-center space-x-2 shadow-sm animate-in fade-in duration-200">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl p-5 text-sm font-semibold max-w-lg mx-auto shadow-sm animate-in fade-in duration-250">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation CTA Widget */}
          <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-100/50 space-y-6 self-start">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-1.5">
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                <span>Give Support</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose a pre-defined donation amount or write a custom value. You will be securely redirected to Stripe checkout to complete the payment.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['10', '20', '50'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setDonateAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    donateAmount === amt
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setDonateAmount('custom')}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  donateAmount === 'custom'
                    ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Custom Amount
              </button>

              {donateAmount === 'custom' && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Custom Amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleDonateCheckout}
              disabled={checkoutLoading}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2 text-xs disabled:opacity-50"
            >
              {checkoutLoading ? (
                <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Coins className="h-4.5 w-4.5" />
                  <span>Donate ${getAmountToDonate()} with Card</span>
                </>
              )}
            </button>
          </div>

          {/* Funding Logs Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl shadow-md shadow-slate-100/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/40">
              <h3 className="font-bold text-slate-800 text-sm">Donation History Log</h3>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
              </div>
            ) : fundingLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                      <th className="px-6 py-4">Donor</th>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fundingLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{log.donorName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5 animate-in">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span>{log.donorEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-[10px] truncate max-w-[120px]">
                          {log.paymentIntentId}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <div className="flex items-center space-x-1 mt-2.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-800">
                          ${log.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Coins className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs">No donations recorded yet. Be the first to contribute!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Funding;

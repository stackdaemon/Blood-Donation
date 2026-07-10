import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api, useAuth } from '../context/AuthContext';
import { Heart, Coins, DollarSign, Calendar, Mail, User, ShieldCheck, ArrowLeft, Landmark, CreditCard, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { showInfoToast, showErrorToast } from '../utils/alert';

// Load Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_for_local_testing_purposes';
let stripePromise = null;
if (stripePublishableKey && !stripePublishableKey.startsWith('pk_test_placeholder')) {
  stripePromise = loadStripe(stripePublishableKey);
}

// Subcomponent: Live Payment Form (using Stripe Elements context)
const LiveCheckoutFormContent = ({ onClose, currency, amount, donorEmail, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(donorEmail || '');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Stripe is still loading. Please try again.');
      setProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/funding?success=true`,
        receipt_email: email,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col justify-between h-full min-h-[400px]">
      <div className="space-y-5">
        {/* Pay with Link Button */}
        <button
          type="button"
          onClick={() => {
            showInfoToast('Stripe Link is in sandbox mode. Fill out the card details below to complete payment.');
          }}
          className="bg-[#00d66f] hover:bg-[#00c265] text-black text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm w-full select-none"
        >
          <span>Pay with</span>
          <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter italic select-none">
            link
          </span>
        </button>

        {/* OR Separator */}
        <div className="flex items-center py-0.5">
          <div className="flex-grow border-t border-slate-200/80"></div>
          <span className="mx-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">OR</span>
          <div className="flex-grow border-t border-slate-200/80"></div>
        </div>

        {/* Contact Information */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact information</label>
          <div className="bg-[#f8f9fa] border border-slate-200 focus-within:border-black rounded-xl flex items-center px-3.5 py-3 text-sm transition-colors">
            <span className="text-slate-400 w-16 select-none font-medium text-xs">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-slate-800 font-semibold text-xs focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment method</label>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-[#f8f9fa] border-b border-slate-200 px-4 py-3 flex items-center space-x-2 text-xs font-bold text-slate-700 select-none">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" />
              <span>Card</span>
            </div>
            <div className="p-4">
              <PaymentElement />
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs font-semibold leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Action Footer */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={processing}
          className="bg-[#0070f3] hover:bg-[#0060df] text-white font-bold py-3 rounded-xl w-full transition-all text-xs shadow-md shadow-blue-500/15 disabled:opacity-50 select-none flex items-center justify-center space-x-2"
        >
          {processing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <span>Pay {currency === 'sgd' ? `SGD ${amount.toFixed(2)}` : currency === 'bdt' ? `BDT ${amount.toFixed(2)}` : `$${amount.toFixed(2)}`}</span>
          )}
        </button>

        <div className="flex items-center justify-center space-x-1 text-[9px] text-slate-400 font-medium pt-3 border-t border-slate-100 select-none">
          <span>Powered by</span>
          <span className="font-extrabold text-slate-500">stripe</span>
          <span>|</span>
          <a href="#" className="hover:text-slate-600">Terms</a>
          <a href="#" className="hover:text-slate-600">Privacy</a>
        </div>
      </div>
    </form>
  );
};

// Subcomponent: Mock Payment Form (independent of Stripe context)
const MockCheckoutFormContent = ({ onClose, currency, amount, donorEmail, onPaymentSuccess }) => {
  const [email, setEmail] = useState(donorEmail || '');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('Singapore');
  const [saveInfo, setSaveInfo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock card values
  const [mockCardNum, setMockCardNum] = useState('');
  const [mockExpiry, setMockExpiry] = useState('');
  const [mockCvc, setMockCvc] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    setMockCardNum(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
    }
    setMockExpiry(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) return;
    setProcessing(true);
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      setProcessing(false);
      return;
    }
    if (mockCardNum.replace(/\s/g, '').length < 16) {
      setErrorMessage('Please enter a valid credit card number.');
      setProcessing(false);
      return;
    }
    if (mockExpiry.replace(/\s/g, '').length < 5) {
      setErrorMessage('Please enter a valid card expiration date.');
      setProcessing(false);
      return;
    }
    if (mockCvc.length < 3) {
      setErrorMessage('Please enter a valid CVC code.');
      setProcessing(false);
      return;
    }

    // Simulate payment delay
    setTimeout(async () => {
      try {
        await api.post('/funding/log-mock', {
          amount: amount,
          currency: currency,
        });
        setProcessing(false);
        onPaymentSuccess(`Thank you! Your mock donation of ${currency.toUpperCase()} ${amount.toFixed(2)} was recorded successfully.`);
        onClose();
      } catch (err) {
        console.error(err);
        setErrorMessage('Mock payment succeeded, but failed to log transaction.');
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col justify-between h-full min-h-[400px]">
      <div className="space-y-5">
        {/* Pay with Link Button */}
        <button
          type="button"
          onClick={() => {
            showInfoToast('Stripe Link is in sandbox mode. Fill out the card details below to complete payment.');
          }}
          className="bg-[#00d66f] hover:bg-[#00c265] text-black text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm w-full select-none"
        >
          <span>Pay with</span>
          <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter italic select-none">
            link
          </span>
        </button>

        {/* OR Separator */}
        <div className="flex items-center py-0.5">
          <div className="flex-grow border-t border-slate-200/80"></div>
          <span className="mx-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">OR</span>
          <div className="flex-grow border-t border-slate-200/80"></div>
        </div>

        {/* Contact Information */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact information</label>
          <div className="bg-[#f8f9fa] border border-slate-200 focus-within:border-black rounded-xl flex items-center px-3.5 py-3 text-sm transition-colors">
            <span className="text-slate-400 w-16 select-none font-medium text-xs">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-slate-800 font-semibold text-xs focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment method</label>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            
            {/* Card Tab Header */}
            <div className="bg-[#f8f9fa] border-b border-slate-200 px-4 py-3 flex items-center space-x-2 text-xs font-bold text-slate-700 select-none">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" />
              <span>Card</span>
            </div>

            {/* Mock Fields mimicking Stripe Card inputs */}
            <div className="p-4 space-y-3">
              {/* Card Information */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card information</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-shadow">
                  
                  {/* Number row */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200">
                    <input
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      value={mockCardNum}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      className="bg-transparent border-0 outline-none w-full text-slate-800 text-xs font-semibold focus:ring-0 focus:outline-none"
                    />
                    {/* Card logos */}
                    <div className="flex items-center space-x-1 shrink-0 select-none">
                      <span className="text-[8px] font-extrabold text-[#1a1f71] bg-slate-100 px-1 py-0.5 rounded">VISA</span>
                      <span className="text-[8px] font-extrabold text-[#eb001b] bg-slate-100 px-1 py-0.5 rounded">MC</span>
                      <span className="text-[8px] font-extrabold text-[#017cc2] bg-slate-100 px-1 py-0.5 rounded">AMEX</span>
                    </div>
                  </div>

                  {/* Expiry and CVC split row */}
                  <div className="flex items-center divide-x divide-slate-200">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={mockExpiry}
                      onChange={handleExpiryChange}
                      maxLength="7"
                      className="w-1/2 px-3 py-2.5 bg-transparent border-0 outline-none text-xs font-semibold focus:ring-0 focus:outline-none"
                    />
                    <div className="w-1/2 flex items-center justify-between px-3 py-2.5 bg-transparent">
                      <input
                        type="password"
                        placeholder="CVC"
                        value={mockCvc}
                        onChange={(e) => setMockCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength="4"
                        className="bg-transparent border-0 outline-none w-full text-xs font-semibold focus:ring-0 focus:outline-none"
                      />
                      <Lock className="h-3 w-3 text-slate-300 shrink-0" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cardholder name</label>
                <input
                  type="text"
                  required
                  placeholder="Full name on card"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white"
                />
              </div>

              {/* Country dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Country or region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white text-slate-800"
                >
                  <option value="Singapore">Singapore</option>
                  <option value="United States">United States</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Save info Checkbox Card */}
        <div 
          onClick={() => setSaveInfo(!saveInfo)}
          className="border border-slate-200 rounded-xl p-3 bg-white hover:bg-slate-50/50 flex items-start space-x-2.5 select-none cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            className="mt-0.5 h-3 w-3 accent-[#0070f3] rounded border-slate-300"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="space-y-0.5">
            <span className="font-bold text-[11px] text-slate-700 block">Save my information for faster checkout</span>
            <span className="text-[9px] text-slate-400 font-medium block">
              Pay securely on this site and everywhere Link is accepted.
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs font-semibold leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Action Footer */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={processing}
          className="bg-[#0070f3] hover:bg-[#0060df] text-white font-bold py-3 rounded-xl w-full transition-all text-xs shadow-md shadow-blue-500/15 disabled:opacity-50 select-none flex items-center justify-center space-x-2"
        >
          {processing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <span>Pay {currency === 'sgd' ? `SGD ${amount.toFixed(2)}` : currency === 'bdt' ? `BDT ${amount.toFixed(2)}` : `$${amount.toFixed(2)}`}</span>
          )}
        </button>

        <div className="flex items-center justify-center space-x-1 text-[9px] text-slate-400 font-medium pt-3 border-t border-slate-100 select-none">
          <span>Powered by</span>
          <span className="font-extrabold text-slate-500">stripe</span>
          <span>|</span>
          <a href="#" className="hover:text-slate-600">Terms</a>
          <a href="#" className="hover:text-slate-600">Privacy</a>
        </div>
      </div>
    </form>
  );
};

// Subcomponent: Elements Wrapper and Layout container
const CheckoutModalWrapper = ({ isOpen, onClose, baseAmount, donorEmail, donorName, onPaymentSuccess }) => {
  const [currency, setCurrency] = useState('sgd');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMode, setPaymentMode] = useState('mock');
  const [loadingIntent, setLoadingIntent] = useState(false);

  const USD_TO_SGD = 1.3438;
  const USD_TO_BDT = 117.50;
  const usdAmount = baseAmount;
  const sgdAmount = Number((baseAmount * USD_TO_SGD).toFixed(2));
  const bdtAmount = Number((baseAmount * USD_TO_BDT).toFixed(2));
  const activeAmount = currency === 'sgd' ? sgdAmount : currency === 'bdt' ? bdtAmount : usdAmount;

  const fetchPaymentIntent = async (curr) => {
    setLoadingIntent(true);
    const amountVal = curr === 'sgd' ? sgdAmount : curr === 'bdt' ? bdtAmount : usdAmount;
    try {
      const res = await api.post('/funding/create-payment-intent', {
        amount: amountVal,
        currency: curr,
      });
      setClientSecret(res.data.clientSecret);
      setPaymentMode(res.data.mode);
    } catch (err) {
      console.warn('Payment Intent creation failed, falling back to mock mode:', err);
      setClientSecret(`pi_mock_secret_${Math.random().toString(36).substring(2, 10)}`);
      setPaymentMode('mock');
    } finally {
      setLoadingIntent(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPaymentIntent(currency);
    }
  }, [isOpen, currency, baseAmount]);

  if (!isOpen) return null;

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        fontFamily: 'Inter, system-ui, sans-serif',
        colorPrimary: '#0070f3',
        colorBackground: '#ffffff',
        colorText: '#1e293b',
        borderRadius: '8px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
          padding: '12px',
          backgroundColor: '#ffffff',
        },
        '.Input:focus': {
          border: '1px solid #0070f3',
          boxShadow: '0 0 0 2px rgba(0, 112, 243, 0.15)',
        },
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a2540]/60 backdrop-blur-[3px] flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#f8f9fa] rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200/60 max-h-[95vh] md:max-h-[85vh]">
        
        {/* Left Section - Invoice & Currency selection */}
        <div className="w-full md:w-5/12 bg-[#f8f9fa] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80">
          <div className="space-y-6">
            {/* Header controls */}
            <div className="flex items-center justify-between">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200/60 rounded-full text-slate-600 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center space-x-2">
                <Landmark className="h-4 w-4 text-slate-500" />
                <span className="text-[9px] bg-[#0a2540] text-white font-extrabold uppercase px-2 py-0.5 rounded tracking-wider select-none">
                  Sandbox
                </span>
              </div>
            </div>

            {/* Currency select */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Choose a currency:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrency('sgd')}
                  className={`p-2.5 rounded-xl text-[10px] font-bold bg-white flex items-center justify-center space-x-1.5 border transition-all ${
                    currency === 'sgd'
                      ? 'border-black border-2 text-black shadow-md shadow-slate-200/50'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">🇸🇬</span>
                  <span>SGD {sgdAmount.toFixed(2)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('usd')}
                  className={`p-2.5 rounded-xl text-[10px] font-bold bg-white flex items-center justify-center space-x-1.5 border transition-all ${
                    currency === 'usd'
                      ? 'border-black border-2 text-black shadow-md shadow-slate-200/50'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">🇺🇸</span>
                  <span>${usdAmount.toFixed(2)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('bdt')}
                  className={`p-2.5 rounded-xl text-[10px] font-bold bg-white flex items-center justify-center space-x-1.5 border transition-all ${
                    currency === 'bdt'
                      ? 'border-black border-2 text-black shadow-md shadow-slate-200/50'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">🇧🇩</span>
                  <span>BDT {bdtAmount.toFixed(2)}</span>
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-medium space-y-0.5 mt-1 block select-none">
                <div>1 USD = 1.3438 SGD</div>
                <div>1 USD = 117.50 BDT</div>
              </div>
            </div>
          </div>

          {/* Line Item Summary */}
          <div className="pt-6 border-t border-slate-200/60 mt-8 md:mt-0">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-500">Basil</span>
              <span className="font-extrabold text-slate-900">
                {currency === 'sgd' ? `SGD ${sgdAmount.toFixed(2)}` : currency === 'bdt' ? `BDT ${bdtAmount.toFixed(2)}` : `$${usdAmount.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Form */}
        <div className="w-full md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {loadingIntent ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0070f3]"></div>
              <p className="text-xs text-slate-400 font-medium">Loading checkout options...</p>
            </div>
          ) : paymentMode === 'live' && stripePromise && clientSecret ? (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <LiveCheckoutFormContent 
                onClose={onClose}
                currency={currency}
                amount={activeAmount}
                donorEmail={donorEmail}
                onPaymentSuccess={onPaymentSuccess}
              />
            </Elements>
          ) : (
            <MockCheckoutFormContent 
              onClose={onClose}
              currency={currency}
              amount={activeAmount}
              donorEmail={donorEmail}
              onPaymentSuccess={onPaymentSuccess}
            />
          )}
        </div>

      </div>
    </div>
  );
};

// Main Funding Page Component
const Funding = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fundingLogs, setFundingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateAmount, setDonateAmount] = useState('20');
  const [customAmount, setCustomAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Checkout modal controls
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutBaseAmount, setCheckoutBaseAmount] = useState(0);

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

  useEffect(() => {
    const handleRedirectCallbacks = async () => {
      await fetchFundingHistory();

      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');

      if (success === 'true') {
        setSuccessMessage('Thank you! Your donation was completed successfully via Stripe checkout.');
        await fetchFundingHistory();
      } else if (canceled === 'true') {
        setErrorMessage('Donation was cancelled. Feel free to contribute at any time!');
      }

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

  const handleDonateCheckout = () => {
    const finalAmount = getAmountToDonate();
    if (finalAmount <= 0) {
      showErrorToast('Please select or specify a valid donation amount.');
      return;
    }
    setCheckoutBaseAmount(finalAmount);
    setShowCheckoutModal(true);
  };

  const handlePaymentSuccess = (msg) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    fetchFundingHistory();
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
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2 text-xs"
            >
              <Coins className="h-4.5 w-4.5" />
              <span>Donate ${getAmountToDonate()} with Card</span>
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
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0 animate-in" />
                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-800">
                          {log.currency === 'sgd' ? `SGD ${log.amount.toFixed(2)}` : log.currency === 'bdt' ? `BDT ${log.amount.toFixed(2)}` : `$${log.amount.toFixed(2)}`}
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

      {/* Stripe checkout elements Modal overlay */}
      <CheckoutModalWrapper
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        baseAmount={checkoutBaseAmount}
        donorEmail={user?.email}
        donorName={user?.name}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Footer />
    </div>
  );
};

export default Funding;

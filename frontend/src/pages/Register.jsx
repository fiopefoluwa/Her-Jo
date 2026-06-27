import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiFetch, setToken, setStoredUser } from '../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords dont match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!phone && !email) {
      setError('Please provide a phone number or email address.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, password }),
      });

      setToken(data.token);
      setStoredUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warmgray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Sparkles className="w-7 h-7 text-terracotta-500" />
          <span className="text-2xl font-semibold text-terracotta-800">HerJo</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-warmgray-200">
          <h1 className="text-2xl font-bold text-warmgray-900">Create your account</h1>
          <p className="text-warmgray-500 text-sm mt-1">Start building your financial identity</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300 focus:outline-none"
                placeholder="Amina Okafor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300 focus:outline-none"
                placeholder="080 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300 focus:outline-none"
                placeholder="amina@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300 focus:outline-none"
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300 focus:outline-none"
                placeholder="Confirm password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-terracotta-600 text-black py-3 rounded-xl font-medium hover:bg-terracotta-700 transition shadow-sm disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-warmgray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
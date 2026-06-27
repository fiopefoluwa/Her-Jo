// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiFetch, setToken, setStoredUser } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const body = isEmail
      ? { email: identifier, password }
      : { phone: identifier, password };

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setToken(data.token);
      setStoredUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          <h1 className="text-2xl font-bold text-warmgray-900">Welcome back</h1>
          <p className="text-warmgray-500 text-sm mt-1">Log in to manage your savings groups</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">
                Phone or email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300"
                placeholder="080 1234 5678 or amina@herjo.app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-warmgray-300 text-terracotta-600"
                />
                <span className="text-warmgray-600">Remember me</span>
              </label>
              <a href="#" className="text-terracotta-600 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-terracotta-600 text-white py-3 rounded-xl font-medium hover:bg-terracotta-700 transition shadow-sm disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-warmgray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-terracotta-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Quick demo hint */}
        <p className="mt-4 text-center text-xs text-warmgray-400">
          Demo: <span className="font-mono">amina@herjo.app</span> / <span className="font-mono">herjo123</span>
        </p>
      </div>
    </div>
  );
}
// pages/Login.jsx
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Login() {
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
          <form className="mt-6 space-y-4">
            <div><label className="block text-sm font-medium text-warmgray-700">Phone or email</label><input type="text" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300" placeholder="080 1234 5678" /></div>
            <div><label className="block text-sm font-medium text-warmgray-700">Password</label><input type="password" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300" placeholder="••••••••" /></div>
            <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" className="rounded border-warmgray-300 text-terracotta-600" /> <span className="text-warmgray-600">Remember me</span></label><a href="#" className="text-terracotta-600 hover:underline">Forgot password?</a></div>
            <Link to="/dashboard">
            <button className="w-full bg-terracotta-100 text-black py-3 rounded-xl font-medium hover:bg-terracotta-700 transition shadow-sm">Log in</button>
          </Link>
          </form>
          <p className="mt-6 text-center text-sm text-warmgray-600">Don't have an account? <Link to="/register" className="text-terracotta-600 font-medium hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
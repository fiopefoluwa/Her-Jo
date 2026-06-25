// pages/Register.jsx
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Register() {
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
          <form className="mt-6 space-y-3">
            <div><label className="block text-sm font-medium text-warmgray-700">Full name</label><input type="text" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300" placeholder="Amina Okafor" /></div>
            <div><label className="block text-sm font-medium text-warmgray-700">Phone number</label><input type="tel" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300" placeholder="080 1234 5678" /></div>
            <div><label className="block text-sm font-medium text-warmgray-700">Email (optional)</label><input type="email" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300" placeholder="amina@example.com" /></div>
            <div><label className="block text-sm font-medium text-warmgray-700">Password</label><input type="password" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300" placeholder="Min 8 characters" /></div>
            <div><label className="block text-sm font-medium text-warmgray-700">Confirm password</label><input type="password" className="mt-1 w-full px-4 py-3 rounded-xl border border-warmgray-200 focus:ring-2 focus:ring-terracotta-300" placeholder="Confirm password" /></div>
            <button className="w-full bg-terracotta-600 text-white py-3 rounded-xl font-medium hover:bg-terracotta-700 transition shadow-sm">Create account</button>
          </form>
          <p className="mt-6 text-center text-sm text-warmgray-600">Already have an account? <Link to="/login" className="text-terracotta-600 font-medium hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { signInAnonymously } from 'firebase/auth';
import Card from '../ui/Card';

const AuthPage = ({ auth, setView }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <Card className="w-full max-w-md text-center py-12">
      <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-purple-200">K</div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to KiddoZ</h2>
      <p className="text-slate-500 mb-8">Secure Access Portal</p>
      <div className="space-y-4">
        <button onClick={async () => {
          await signInAnonymously(auth);
          setView('dashboard');
        }} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition shadow-lg">
          Parent Login (Demo Guest)
        </button>
        <button onClick={async () => {
          await signInAnonymously(auth);
          setView('admin');
        }} className="w-full bg-white border-2 border-purple-100 text-purple-700 font-bold py-4 rounded-xl hover:bg-purple-50 transition">
          Staff / Admin Login
        </button>
        <button onClick={() => setView('home')} className="text-purple-600 font-bold hover:underline">Back to Home</button>
      </div>
    </Card>
  </div>
);

export default AuthPage;
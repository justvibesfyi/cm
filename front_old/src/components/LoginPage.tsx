import { useState } from 'react';
import { MessageSquare, Mail, Send, MessageCircle, Check } from 'lucide-react';
import { login } from '../lib/api/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const result = await login(email);
      if (result.success) {
        setMessage('Magic link sent to your email! Check your inbox.');
      } else {
        setMessage(result.error?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-blue-500 mr-3" />
            <span className="text-3xl font-bold">ChatMesh</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your email to receive a magic link</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-300"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('sent') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            <div className="flex items-center">
              {message.includes('sent') && <Check className="w-5 h-5 mr-2" />}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Platform Icons */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">Unify all your messaging platforms</p>
          <div className="flex justify-center space-x-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
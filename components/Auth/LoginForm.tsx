import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User } from '@/types';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [year, setYear] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [isLogin, setIsLogin] = useState(true);
  const { setCurrentUser, addUser, users } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Special admin login
      if (email === 'admin@TJHS' && password === 'admin2025') {
        const adminUser: User = {
          id: 'admin-001',
          email: 'admin@TJHS',
          name: 'TJHS Administrator',
          role: 'admin',
          createdAt: new Date()
        };
        setCurrentUser(adminUser);
        onSuccess();
        return;
      }
      
      // Regular login logic
      const user = users.find(u => u.email === email);
      if (user) {
        setCurrentUser(user);
        onSuccess();
      } else {
        alert('User not found. Please register first.');
      }
    } else {
      // Registration logic
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        studentId: role === 'student' ? studentId : undefined,
        year: role === 'student' ? parseInt(year) : undefined,
        createdAt: new Date()
      };
      
      addUser(newUser);
      setCurrentUser(newUser);
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to' : 'Create account for'}
          </h2>
          <h3 className="mt-2 text-center text-2xl font-bold text-tjhs-blue">
            TJHS Sports Rental
          </h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role === 'student' && (
                <>
                  <div>
                    <label htmlFor="studentId" className="sr-only">
                      Student ID
                    </label>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                      placeholder="Student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="sr-only">
                      Year
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min="7"
                      max="12"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                      placeholder="Year (7-12)"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tjhs-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tjhs-blue"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-tjhs-blue hover:text-blue-700"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

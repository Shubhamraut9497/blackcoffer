import React, { useState } from 'react';
import { TrendingUp, Bell, Search, User, Menu, X, BarChart3, PieChart, Globe, Filter, Settings, LogOut } from 'lucide-react';



const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-xs text-slate-400">Data Visualization Platform</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search insights, topics, regions..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium hidden md:block">John Doe</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-white font-medium text-sm">John Doe</p>
                    <p className="text-slate-400 text-xs">john@example.com</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2 text-sm">
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2 text-sm">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden`}>
          <nav className="p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-4 border-cyan-500 rounded-lg hover:bg-slate-700/30 transition-all">
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all">
              <PieChart size={20} />
              <span className="font-medium">Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all">
              <Globe size={20} />
              <span className="font-medium">Regions</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all">
              <Filter size={20} />
              <span className="font-medium">Filters</span>
            </button>
          </nav>

          {/* Filters Section */}
          <div className="p-4 mt-6 border-t border-slate-700/50">
            <h3 className="text-slate-400 text-xs font-semibold uppercase mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <label className="text-slate-300 text-sm font-medium block mb-2">Year</label>
                <select className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                  <option>All Years</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <label className="text-slate-300 text-sm font-medium block mb-2">Region</label>
                <select className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                  <option>All Regions</option>
                  <option>Northern America</option>
                  <option>Europe</option>
                  <option>Asia</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Insights', value: '1,234', change: '+12.5%', color: 'from-cyan-500 to-blue-500' },
              { label: 'Active Topics', value: '45', change: '+8.2%', color: 'from-purple-500 to-pink-500' },
              { label: 'Countries', value: '28', change: '+3.1%', color: 'from-orange-500 to-red-500' },
              { label: 'Avg Intensity', value: '6.8', change: '+5.4%', color: 'from-green-500 to-teal-500' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Intensity by Region</h3>
              <div className="h-64 flex items-center justify-center text-slate-400">
                Chart will be rendered here
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Topics Distribution</h3>
              <div className="h-64 flex items-center justify-center text-slate-400">
                Chart will be rendered here
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Recent Insights</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Energy Sector Analysis</h4>
                      <p className="text-slate-400 text-sm">Northern America - United States</p>
                    </div>
                    <span className="text-cyan-400 text-sm font-semibold">High Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-white font-bold text-lg">Analytics Dashboard</span>
              </div>
              <p className="text-slate-400 text-sm">
                Comprehensive data visualization platform for global insights and analytics.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Email: support@analytics.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Location: Hyderabad, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-6 pt-6 text-center text-slate-400 text-sm">
            <p>© 2025 Analytics Dashboard. All rights reserved. Built with React & TypeScript</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
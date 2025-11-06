import { useEffect, useState } from "react";
import {
  TrendingUp,
  Bell,
  Search,
  User,
  Menu,
  X,
  BarChart3,
  PieChart,
  Globe,
  Filter,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_CONFIG, API_ENDPOINTS, getApiHeaders } from "../config/api";
// lightweight visualizations (no chart.js dependency) to avoid runtime errors when libs aren't installed

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>({});
  const [filters, setFilters] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "regions" | "filters"
  >("dashboard");
  const auth = useAuth();
console.log(loading);
  useEffect(() => {
    // fetch meta for filter options
    const headers: any = { "Content-Type": "application/json" };
    if (auth.token) headers.Authorization = `Bearer ${auth.token}`;

    fetch(API_ENDPOINTS.DATA.META, {
      headers: getApiHeaders(auth.token as string | undefined),
      ...API_CONFIG,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMeta(d.values || {});
      })
      .catch((e) => console.error(e));

    // fetch initial data
    fetchData({ limit: 100 });
  }, []);

  const fetchData = (extra: any = {}) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(extra.limit || 50) });
    if (extra.region) params.set("region", extra.region);
    if (extra.topics) params.set("topics", extra.topics);

    const headers2: any = { "Content-Type": "application/json" };
    if (auth.token) headers2.Authorization = `Bearer ${auth.token}`;

    // call the filter endpoint for consistency with backend CLI-style params
    fetch(`${API_ENDPOINTS.DATA.FILTER}?${params.toString()}`, {
      headers: getApiHeaders(auth.token as string | undefined),
      ...API_CONFIG,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.items || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const applyFilter = () => {
    fetchData({ limit: 200, region: filters.region, topics: filters.topics });
  };

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
                <h1 className="text-xl font-bold text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-xs text-slate-400">
                  Data Visualization Platform
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
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
                <span className="text-white text-sm font-medium hidden md:block">
                  {auth.user?.name ?? auth.user?.email ?? "User"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-white font-medium text-sm">
                      {auth.user?.name ?? auth.user?.email ?? "User"}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {auth.user?.email ?? ""}
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2 text-sm">
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => auth.logout()}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2 text-sm"
                  >
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
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 ${
                activeTab === "dashboard"
                  ? "text-white bg-linear-to-r from-cyan-500/20 to-purple-500/20 border-l-4 border-cyan-500"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              } rounded-lg transition-all`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 ${
                activeTab === "analytics"
                  ? "text-white bg-linear-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              } rounded-lg transition-all`}
            >
              <PieChart size={20} />
              <span className="font-medium">Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab("regions")}
              className={`w-full flex items-center gap-3 px-4 py-3 ${
                activeTab === "regions"
                  ? "text-white bg-linear-to-r from-green-500/20 to-teal-500/20 border-l-4 border-green-500"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              } rounded-lg transition-all`}
            >
              <Globe size={20} />
              <span className="font-medium">Regions</span>
            </button>
            <button
              onClick={() => setActiveTab("filters")}
              className={`w-full flex items-center gap-3 px-4 py-3 ${
                activeTab === "filters"
                  ? "text-white bg-linear-to-r from-orange-500/20 to-yellow-500/20 border-l-4 border-orange-500"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              } rounded-lg transition-all`}
            >
              <Filter size={20} />
              <span className="font-medium">Filters</span>
            </button>
          </nav>

          {/* Filters Section */}
          <div className="p-4 mt-6 border-t border-slate-700/50">
            <h3 className="text-slate-400 text-xs font-semibold uppercase mb-3">
              Quick Filters
            </h3>
            <div className="space-y-2">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <label className="text-slate-300 text-sm font-medium block mb-2">
                  Year
                </label>
                <select className="w-full bg-linear-to-r from-cyan-700/80 to-purple-700/80 border border-cyan-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 hover:bg-cyan-800/80">
                  <option>All Years</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <label className="text-slate-300 text-sm font-medium block mb-2">
                  Region
                </label>
                <select className="w-full bg-linear-to-r from-pink-700/80 to-purple-700/80 border border-pink-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-pink-400 hover:bg-pink-800/80">
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
          {/* Filter controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="bg-slate-800/50 p-3 rounded-md">
              <label className="text-slate-300 text-xs">Region</label>
              <select
                value={filters.region || ""}
                onChange={(e) =>
                  setFilters((s: any) => ({ ...s, region: e.target.value }))
                }
                className="ml-2 bg-linear-to-r from-cyan-700/80 to-purple-700/80 border border-cyan-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 hover:bg-cyan-800/80"
              >
                <option value="">All Regions</option>
                {(meta.region || []).slice(0, 50).map((r: any, i: number) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-md">
              <label className="text-slate-300 text-xs">Topics</label>
              <select
                value={filters.topics || ""}
                onChange={(e) =>
                  setFilters((s: any) => ({ ...s, topics: e.target.value }))
                }
                className="ml-2 bg-linear-to-r from-pink-700/80 to-purple-700/80 border border-pink-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-pink-400 hover:bg-pink-800/80"
              >
                <option value="">All Topics</option>
                {(meta.topics || []).slice(0, 50).map((t: any, i: number) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={applyFilter}
                className="px-4 py-2 bg-cyan-500 text-white rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              {
                label: "Total Insights",
                value: "1,234",
                change: "+12.5%",
                color: "from-cyan-500 to-blue-500",
              },
              {
                label: "Active Topics",
                value: "45",
                change: "+8.2%",
                color: "from-purple-500 to-pink-500",
              },
              {
                label: "Countries",
                value: "28",
                change: "+3.1%",
                color: "from-orange-500 to-red-500",
              },
              {
                label: "Avg Intensity",
                value: "6.8",
                change: "+5.4%",
                color: "from-green-500 to-teal-500",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">
                  {stat.label}
                </h3>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Intensity by Region
              </h3>
              <div className="space-y-2">
                {(() => {
                  const counts: Record<string, { sum: number; count: number }> =
                    {};
                  items.forEach((it: any) => {
                    const r = it.region || "Unknown";
                    if (!counts[r]) counts[r] = { sum: 0, count: 0 };
                    counts[r].sum += Number(it.intensity) || 0;
                    counts[r].count += 1;
                  });
                  const rows = Object.entries(counts)
                    .sort(
                      (a: any, b: any) =>
                        b[1].sum / b[1].count - a[1].sum / a[1].count
                    )
                    .slice(0, 8);
                  const maxAvg = rows.length
                    ? Math.max(...rows.map((r) => r[1].sum / r[1].count))
                    : 1;
                  return (
                    <div className="space-y-2">
                      {rows.map(([region, v]: any, idx: number) => {
                        const avg = v.sum / v.count || 0;
                        const pct = Math.round((avg / maxAvg) * 100);
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-32 text-slate-300 text-sm">
                              {region}
                            </div>
                            <div className="flex-1 bg-slate-700 rounded overflow-hidden h-4">
                              <div
                                className="bg-cyan-500 h-4"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="w-12 text-right text-white text-sm">
                              {avg.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Topics Distribution
              </h3>
              <div className="space-y-2">
                {(() => {
                  const tcounts: Record<string, number> = {};
                  items.forEach((it: any) => {
                    (it.topics || []).forEach((t: string) => {
                      if (!t) return;
                      tcounts[t] = (tcounts[t] || 0) + 1;
                    });
                  });
                  const rows = Object.entries(tcounts)
                    .sort((a: any, b: any) => b[1] - a[1])
                    .slice(0, 10);
                  const total =
                    rows.reduce((s: number, r: any) => s + r[1], 0) || 1;
                  return (
                    <div className="space-y-2">
                      {rows.map(([topic, c]: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-40 text-slate-300 text-sm truncate">
                            {topic}
                          </div>
                          <div className="flex-1 bg-slate-700 rounded overflow-hidden h-3">
                            <div
                              className="bg-purple-500 h-3"
                              style={{
                                width: `${Math.round((c / total) * 100)}%`,
                              }}
                            />
                          </div>
                          <div className="w-12 text-right text-white text-sm">
                            {c}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              Recent Insights
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        Energy Sector Analysis
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Northern America - United States
                      </p>
                    </div>
                    <span className="text-cyan-400 text-sm font-semibold">
                      High Priority
                    </span>
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
                <span className="text-white font-bold text-lg">
                  Analytics Dashboard
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Comprehensive data visualization platform for global insights
                and analytics.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Support
                  </a>
                </li>
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
            <p>
              © 2025 Analytics Dashboard. All rights reserved. Built with React
              & TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

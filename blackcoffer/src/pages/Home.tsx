import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, getApiHeaders, API_CONFIG } from '../config/api';

const Home = () => {
  const auth = useAuth();
  const [meta, setMeta] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    region: "",
    topics: "",
    endYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
console.log(loading);
  useEffect(() => {
    fetchMeta();
    fetchSample();
    // Show stats section with a slight delay for better UX
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchMeta = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.DATA.META, {
        headers: getApiHeaders(auth.token as string | undefined),
        ...API_CONFIG
      });
      const d = await res.json();
      if (d.success) setMeta(d.values || {});
    } catch (e) {
      console.error("meta error", e);
    }
  };

  const fetchSample = async (extra: any = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(extra.limit || 200) });
      if (extra.region) params.set("region", extra.region);
      if (extra.topics) params.set("topics", extra.topics);
      if (extra.endYear) params.set("end_year", extra.endYear);

      const res = await fetch(
        `${API_ENDPOINTS.DATA.FILTER}?${params.toString()}`,
        { headers: getApiHeaders(auth.token || undefined), ...API_CONFIG }
      );
      const d = await res.json();
      if (d.success) setItems(d.items || []);
    } catch (e) {
      console.error("fetch sample error", e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchSample(filters);
  };

  // derived stats
  const totalInsights = items.length ? items.length : 0;
  const topicsCount: Record<string, number> = {};
  const countryCount: Record<string, number> = {};
  items.forEach((it) => {
    (it.topics || []).forEach((t: any) => {
      if (t) topicsCount[t] = (topicsCount[t] || 0) + 1;
    });
    const c = it.country || "Unknown";
    countryCount[c] = (countryCount[c] || 0) + 1;
  });

  const topTopics = Object.entries(topicsCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 6);
  const topCountries = Object.entries(countryCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <header className="py-4 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-r from-cyan-500 to-purple-500 p-3 rounded-lg shadow-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                Blackcoffer Insights
              </h1>
              <p className="text-slate-300 text-sm">
                Interactive visualization platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {auth.token ? (
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <User className="text-cyan-400" />
                <div className="text-sm">
                  <div className="font-medium text-white">
                    {auth.user?.name ?? auth.user?.email ?? "User"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {auth.user?.email ?? ""}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2 bg-linear-to-r  text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Discover Global Insights <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                Make Better Decisions
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-xl">
              Access comprehensive data analysis and visualization tools to
              understand global trends, market dynamics, and strategic insights
              across industries and regions.
            </p>
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-linear-to-r  text-white rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <TrendingUp size={20} />
                Open Dashboard
              </Link>
              <a
                href="#stats"
                className="px-8 py-3 bg-slate-800 text-white rounded-lg font-medium border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square bg-linear-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full animate-pulse"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
                {[
                  totalInsights,
                  Object.keys(topicsCount).length,
                  Object.keys(countryCount).length,
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/80 backdrop-blur p-4 rounded-lg border border-slate-700/50"
                  >
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                      {stat}
                    </div>
                    <div className="text-sm text-slate-400">
                      {i === 0
                        ? "Total Insights"
                        : i === 1
                        ? "Topics"
                        : "Countries"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-6 bg-slate-900/50" id="stats">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section
            className="lg:col-span-2 space-y-8 animate-fade-in"
            style={{
              animationDelay: showStats ? "0.5s" : "0s",
              opacity: showStats ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
                <p className="text-sm text-slate-400 mb-1">Total Insights</p>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                  {totalInsights}
                </div>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
                <p className="text-sm text-slate-400 mb-1">Topics</p>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                  {Object.keys(topicsCount).length}
                </div>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
                <p className="text-sm text-slate-400 mb-1">Countries</p>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                  {Object.keys(countryCount).length}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
              <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                Data Explorer
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filters.region}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, region: e.target.value }))
                  }
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All Regions</option>
                  {(meta.region || []).slice(0, 50).map((r: any, i: number) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.topics}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, topics: e.target.value }))
                  }
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Topics</option>
                  {(meta.topics || []).slice(0, 50).map((t: any, i: number) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-linear-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Explore
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
                <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                  Top Topics
                </h3>
                <div className="space-y-3">
                  {topTopics.length ? (
                    topTopics.map(([t, c]: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800"
                      >
                        <div className="truncate text-slate-300">{t}</div>
                        <div className="font-semibold text-cyan-400">{c}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-center py-4">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
                <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
                  Top Countries
                </h3>
                <div className="space-y-3">
                  {topCountries.length ? (
                    topCountries.map(([c, n]: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800"
                      >
                        <div className="truncate text-slate-300">{c}</div>
                        <div className="font-semibold text-purple-400">{n}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-center py-4">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
            <h4 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
              Quick Access
            </h4>
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-white hover:bg-slate-700/50 transition-colors"
              >
                <TrendingUp className="text-cyan-400" size={20} />
                <span>Interactive Dashboard</span>
              </Link>
              {auth.token && (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-white hover:bg-slate-700/50 transition-colors"
                >
                  <User className="text-purple-400" size={20} />
                  <span>View Profile</span>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700/50 backdrop-blur">
            <h4 className="text-lg font-semibold mb-4">Need Help?</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Explore our documentation and API references to get started with
              data analysis and visualization.
            </p>
            <a
              href="#"
              className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Documentation →
            </a>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-linear-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-lg">Blackcoffer Insights</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering decisions through comprehensive data analysis and
              visualization tools.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    API Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800">
          <div className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Blackcoffer Insights. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

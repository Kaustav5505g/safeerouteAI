function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-[270px] glass border-r border-white/10 p-7 flex flex-col justify-between">

        <div>

          <div>
            <h1 className="text-4xl font-bold gradient-text">
              SafeRoute
            </h1>

            <p className="text-gray-400 mt-2 text-sm">
              AI Mobility Intelligence
            </p>
          </div>

          <div className="mt-14 space-y-4">

            <div className="bg-pink-500/15 border border-pink-500/20 p-4 rounded-2xl glow">
              Dashboard
            </div>

            <div className="hover:bg-white/5 transition p-4 rounded-2xl cursor-pointer">
              Live Tracking
            </div>

            <div className="hover:bg-white/5 transition p-4 rounded-2xl cursor-pointer">
              Safe Zones
            </div>

            <div className="hover:bg-white/5 transition p-4 rounded-2xl cursor-pointer">
              AI Reports
            </div>

            <div className="hover:bg-white/5 transition p-4 rounded-2xl cursor-pointer">
              Emergency
            </div>

          </div>

        </div>

        <button className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl font-semibold glow">
          🚨 Emergency SOS
        </button>

      </div>

      {/* Main */}
      <div className="flex-1 p-8 relative overflow-y-auto">

        {/* Background */}
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px]"></div>

        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px]"></div>

        <div className="relative z-10">

          {/* Topbar */}
          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-6xl font-bold tracking-tight">
                Command Center
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Real-time AI-powered secure commute monitoring
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3">

                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

                <span className="text-green-400">
                  System Active
                </span>

              </div>

              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 glow"></div>

            </div>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-4 gap-6 mt-10">

            <div className="glass rounded-3xl p-6 hover-card">

              <p className="text-gray-400">
                Safety Score
              </p>

              <h1 className="text-6xl font-bold mt-4 text-green-400">
                94%
              </h1>

              <p className="text-green-400 mt-4 text-sm">
                ↑ 12% improvement
              </p>

            </div>

            <div className="glass rounded-3xl p-6 hover-card">

              <p className="text-gray-400">
                Risk Alerts
              </p>

              <h1 className="text-6xl font-bold mt-4 text-red-400">
                03
              </h1>

              <p className="text-red-400 mt-4 text-sm">
                High-risk areas
              </p>

            </div>

            <div className="glass rounded-3xl p-6 hover-card">

              <p className="text-gray-400">
                Safe Zones
              </p>

              <h1 className="text-6xl font-bold mt-4 text-blue-400">
                18
              </h1>

              <p className="text-blue-400 mt-4 text-sm">
                AI verified
              </p>

            </div>

            <div className="glass rounded-3xl p-6 hover-card">

              <p className="text-gray-400">
                Monitoring
              </p>

              <h1 className="text-6xl font-bold mt-4 text-yellow-400">
                LIVE
              </h1>

              <p className="text-yellow-400 mt-4 text-sm">
                Real-time tracking
              </p>

            </div>

          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6 mt-10">

            {/* Map */}
            <div className="col-span-2 glass rounded-3xl p-6 relative overflow-hidden">

              <div className="flex justify-between items-center">

                <div>

                  <h1 className="text-3xl font-bold tracking-tight">
                    AI Safety Map
                  </h1>

                  <p className="text-gray-400 mt-2">
                    Smart route optimization & danger prediction
                  </p>

                </div>

                <div className="bg-pink-500/15 border border-pink-500/20 px-5 py-2 rounded-2xl">
                  Live Tracking
                </div>

              </div>

              {/* Fake Map */}
              <div className="mt-6 h-[520px] rounded-3xl bg-[#0B1120] border border-white/10 relative overflow-hidden">

                {/* Grid */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:55px_55px]"></div>

                {/* Route */}
                <div className="absolute top-[45%] left-[18%] w-[420px] h-[5px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full rotate-12 shadow-[0_0_30px_rgba(236,72,153,0.6)]"></div>

                {/* Dots */}
                <div className="absolute top-[42%] left-[15%] w-6 h-6 bg-green-400 rounded-full animate-pulse glow"></div>

                <div className="absolute top-[55%] right-[18%] w-6 h-6 bg-red-500 rounded-full animate-ping"></div>

                {/* Floating AI Card */}
                <div className="absolute bottom-8 left-8 glass rounded-3xl p-6 w-[320px] float">

                  <p className="text-gray-400 text-sm">
                    AI Recommendation
                  </p>

                  <h2 className="text-2xl font-bold mt-3">
                    Safer Route Detected
                  </h2>

                  <p className="text-gray-400 mt-4 text-sm leading-6">
                    Avoiding poorly lit roads and recent risk reports using live predictive analysis.
                  </p>

                </div>

              </div>

            </div>

            {/* Right Side */}
            <div className="space-y-6">

              <div className="glass rounded-3xl p-6">

                <h2 className="text-2xl font-bold">
                  AI Alerts
                </h2>

                <div className="mt-6 space-y-4">

                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                    Unsafe activity detected near Central Mall
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                    Poor lighting detected near Lake Road
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                    AI found safer alternate path
                  </div>

                </div>

              </div>

              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-7 glow">

                <p className="opacity-80">
                  Emergency Assistance
                </p>

                <h1 className="text-4xl font-bold mt-4">
                  One Tap Protection
                </h1>

                <p className="mt-4 opacity-80">
                  Instantly alert trusted contacts and emergency services.
                </p>

                <button className="mt-7 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
                  Activate SOS
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
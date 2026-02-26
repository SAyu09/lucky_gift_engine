// src/app/(dashboard)/admin/global-stats/page.tsx
import { 
  BarChart3, 
  Activity, 
  Users, 
  Coins, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Database
} from 'lucide-react';

export default function GlobalStatsPage() {
  // Mock data for the static UI representing the platform pulse
  const stats = [
    {
      name: 'Total Active B2B Clients',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Global Platform Reserve',
      value: '$4,285,150.00',
      change: '+5.4%',
      changeType: 'positive',
      icon: Database,
    },
    {
      name: 'Total Spins (24h)',
      value: '1.2M',
      change: '-2.1%',
      changeType: 'negative',
      icon: Activity,
    },
    {
      name: 'Average Network RTP',
      value: '94.82%',
      change: 'Target: 95.0%',
      changeType: 'neutral',
      icon: TrendingUp,
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          Global Engine Statistics
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Real-time metrics tracking the health and economic stability of the Continuous Engine platform.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md"
          >
            <dt>
              <div className="absolute rounded-lg bg-blue-50 p-3 flex border border-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              
              <div className="ml-auto flex items-baseline">
                {stat.changeType === 'positive' && (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
                {stat.changeType === 'negative' && (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Additional UI Mocks for Dashboard robustness */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Mock Chart Area */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-gray-400" />
            Reserve Volatility (30 Days)
          </h3>
          <div className="h-64 w-full bg-gray-50 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300">
             {/* Simple pseudo-chart visualization */}
             <div className="flex w-full items-end justify-between px-8 h-40 space-x-2">
               {[40, 60, 45, 80, 55, 90, 75, 85, 60, 70, 40, 50, 75, 95].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="w-full bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-colors"></div>
               ))}
             </div>
             <p className="text-sm text-gray-400 mt-4">Chart visualization requires external library (e.g. Recharts)</p>
          </div>
        </div>

        {/* Recent Platform Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Alerts</h3>
          <div className="space-y-4">
            {[
              { time: '10 mins ago', message: 'Client "Global Spin" RTP deviation alert (+1.2%)', type: 'warning' },
              { time: '1 hour ago', message: 'Reserve pool rebalanced automatically.', type: 'info' },
              { time: '3 hours ago', message: 'New B2B Client "Acme Corp" onboarded successfully.', type: 'success' },
              { time: '1 d ago', message: 'Scheduled maintenance completed.', type: 'info' }
            ].map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg flex items-start gap-3 border ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                alert.type === 'success' ? 'bg-green-50 border-green-100' :
                'bg-gray-50 border-gray-100'
              }`}>
                <div className={`mt-0.5 w-2 h-2 rounded-full ${
                   alert.type === 'warning' ? 'bg-yellow-400' :
                   alert.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

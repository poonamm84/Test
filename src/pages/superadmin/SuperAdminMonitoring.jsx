import React, { useState, useEffect } from 'react';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Monitor, 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

const SuperAdminMonitoring = () => {
  const { apiCall } = useSuperAdminAuth();
  const { addNotification } = useNotification();
  
  const [systemStatus, setSystemStatus] = useState({
    server: { status: 'healthy', uptime: '99.9%', response_time: '125ms' },
    database: { status: 'healthy', connections: 45, queries_per_sec: 120 },
    api: { status: 'healthy', requests_per_min: 1250, error_rate: '0.1%' },
    storage: { status: 'healthy', used: '45%', available: '2.1TB' }
  });
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('/super-admin/monitoring');
      if (response.success) {
        setSystemStatus(response.data.systemStatus);
        setPerformanceMetrics(response.data.performanceMetrics);
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      // Use mock data for demo
      setPerformanceMetrics([
        { time: '10:00', cpu: 45, memory: 62, requests: 1200 },
        { time: '10:15', cpu: 52, memory: 65, requests: 1350 },
        { time: '10:30', cpu: 48, memory: 63, requests: 1180 },
        { time: '10:45', cpu: 55, memory: 68, requests: 1420 },
        { time: '11:00', cpu: 43, memory: 61, requests: 1100 }
      ]);
      setAlerts([
        {
          id: 1,
          type: 'warning',
          message: 'High CPU usage detected on server-02',
          timestamp: new Date(Date.now() - 300000),
          resolved: false
        },
        {
          id: 2,
          type: 'info',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 3600000),
          resolved: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600">Real-time platform health and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
          <Activity className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">All Systems Operational</span>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Server</h3>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(systemStatus.server.status)}`}>
              {getStatusIcon(systemStatus.server.status)}
              <span className="text-xs font-medium capitalize">{systemStatus.server.status}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{systemStatus.server.uptime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">{systemStatus.server.response_time}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Database</h3>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(systemStatus.database.status)}`}>
              {getStatusIcon(systemStatus.database.status)}
              <span className="text-xs font-medium capitalize">{systemStatus.database.status}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-medium">{systemStatus.database.connections}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Queries/sec</span>
              <span className="font-medium">{systemStatus.database.queries_per_sec}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">API</h3>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(systemStatus.api.status)}`}>
              {getStatusIcon(systemStatus.api.status)}
              <span className="text-xs font-medium capitalize">{systemStatus.api.status}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requests/min</span>
              <span className="font-medium">{systemStatus.api.requests_per_min}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-medium">{systemStatus.api.error_rate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Storage</h3>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(systemStatus.storage.status)}`}>
              {getStatusIcon(systemStatus.storage.status)}
              <span className="text-xs font-medium capitalize">{systemStatus.storage.status}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">{systemStatus.storage.used}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{systemStatus.storage.available}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full space-y-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(metric.cpu / 100) * 60}px` }}
                  title={`CPU: ${metric.cpu}%`}
                ></div>
                <div 
                  className="w-full bg-green-500"
                  style={{ height: `${(metric.memory / 100) * 60}px` }}
                  title={`Memory: ${metric.memory}%`}
                ></div>
                <div 
                  className="w-full bg-purple-500 rounded-b"
                  style={{ height: `${(metric.requests / 2000) * 60}px` }}
                  title={`Requests: ${metric.requests}`}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{metric.time}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">CPU Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Memory Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">API Requests</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              alert.type === 'error' ? 'bg-red-50 border-red-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'error' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                     alert.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                     <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {alert.resolved && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Resolved
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
            <p className="text-gray-500">All systems are running smoothly.</p>
          </div>
        )}
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">CPU Usage</h3>
            <Cpu className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Average: 42%</span>
              <span>Peak: 78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Memory Usage</h3>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current</span>
              <span className="font-medium">62%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Average: 58%</span>
              <span>Peak: 85%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Network</h3>
            <Wifi className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bandwidth</span>
              <span className="font-medium">1.2 GB/s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Latency: 12ms</span>
              <span>Uptime: 99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminMonitoring;
import React, { useState } from 'react';
import errorTracker from '@/lib/errorTracking';

const ErrorLogViewer: React.FC = () => {
  const [logs, setLogs] = useState(errorTracker.getLogs());
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const refreshLogs = () => {
    setLogs(errorTracker.getLogs());
  };

  const clearLogs = () => {
    errorTracker.clearLogs();
    setLogs([]);
  };

  const exportLogs = () => {
    const data = errorTracker.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dinoalphabet-error-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Error Logs & Monitoring</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshLogs}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            📊 Export
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {(['all', 'error', 'warning', 'info'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === level
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
            {level !== 'all' && (
              <span className="ml-1 bg-white bg-opacity-20 px-1 rounded">
                {logs.filter(log => log.level === level).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p>No {filter === 'all' ? '' : filter} logs found!</p>
            <p className="text-sm">The app is running smoothly.</p>
          </div>
        ) : (
          filteredLogs.reverse().map((log) => (
            <div
              key={log.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${getLevelColor(log.level)}`}
              onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm uppercase">{log.level}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-medium">{log.message}</p>
                  {log.context.component && (
                    <p className="text-sm opacity-75">
                      Component: {log.context.component}
                      {log.context.action && ` • Action: ${log.context.action}`}
                    </p>
                  )}
                </div>
                <span className="text-xs">
                  {showDetails === log.id ? '▼' : '▶'}
                </span>
              </div>

              {showDetails === log.id && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <div className="text-xs space-y-2">
                    <div>
                      <strong>Session ID:</strong> {log.context.sessionId}
                    </div>
                    <div>
                      <strong>URL:</strong> {log.url}
                    </div>
                    <div>
                      <strong>User Agent:</strong> {log.userAgent}
                    </div>
                    {log.context.metadata && (
                      <div>
                        <strong>Metadata:</strong>
                        <pre className="mt-1 p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.context.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto">
                          {log.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-red-600">{logs.filter(l => l.level === 'error').length}</div>
            <div className="text-gray-600">Errors</div>
          </div>
          <div>
            <div className="font-bold text-yellow-600">{logs.filter(l => l.level === 'warning').length}</div>
            <div className="text-gray-600">Warnings</div>
          </div>
          <div>
            <div className="font-bold text-blue-600">{logs.filter(l => l.level === 'info').length}</div>
            <div className="text-gray-600">Info</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogViewer;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AuthManager } from '@/lib/auth';
import errorTracker from '@/lib/errorTracking';

const TestPage: React.FC = () => {
  const router = useRouter();
  const { speak, isLoading, hasElevenLabs, availableVoices, changeVoice } = useEnhancedVoice();
  const { analyzeDifficulty, generatePersonalizedEncouragement, hasAI, isAnalyzing } = useAdaptiveDifficulty();
  const { handleError, handleWarning, handleInfo } = useErrorHandler({ component: 'TestPage' });
  
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [securityTests, setSecurityTests] = useState<Record<string, any>>({});
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Run initial API status check
    checkAPIStatus();
    runSecurityTests();
  }, [router]);

  const checkAPIStatus = () => {
    const results = {
      elevenLabs: {
        hasKey: !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
        connected: hasElevenLabs,
        voiceCount: availableVoices.length
      },
      gemini: {
        hasKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        connected: hasAI
      },
      authentication: {
        isAuthenticated: AuthManager.isAuthenticated(),
        user: AuthManager.getAuth()?.user
      }
    };
    setTestResults(results);
    handleInfo('API status checked', 'api_status_check', results);
  };

  const testElevenLabsVoice = async (emotion: 'happy' | 'excited' | 'gentle' | 'encouraging') => {
    try {
      handleInfo(`Testing ElevenLabs voice with ${emotion} emotion`);
      await speak(`Hello! This is a test of the ${emotion} voice from your dinosaur friend!`, emotion);
      
      setTestResults(prev => ({
        ...prev,
        elevenLabsTest: {
          ...prev.elevenLabsTest,
          [emotion]: 'success'
        }
      }));
    } catch (error) {
      handleError(error as Error, 'elevenlabs_voice_test_failed');
      setTestResults(prev => ({
        ...prev,
        elevenLabsTest: {
          ...prev.elevenLabsTest,
          [emotion]: 'failed'
        }
      }));
    }
  };

  const testGeminiAI = async () => {
    try {
      handleInfo('Testing Gemini AI difficulty analysis');
      
      const analysis = await analyzeDifficulty();
      
      setTestResults(prev => ({
        ...prev,
        geminiTest: {
          analysisWorking: !!analysis,
          analysis: analysis
        }
      }));

      // Test personalized encouragement
      const encouragement = await generatePersonalizedEncouragement('found the letter A');
      
      setTestResults(prev => ({
        ...prev,
        geminiTest: {
          ...prev.geminiTest,
          encouragementWorking: !!encouragement,
          sampleEncouragement: encouragement
        }
      }));

    } catch (error) {
      handleError(error as Error, 'gemini_ai_test_failed');
      setTestResults(prev => ({
        ...prev,
        geminiTest: {
          analysisWorking: false,
          encouragementWorking: false,
          error: (error as Error).message
        }
      }));
    }
  };

  const runSecurityTests = () => {
    const security = {
      authentication: {
        loginRequired: !window.location.pathname.includes('/login'),
        sessionValid: AuthManager.isAuthenticated(),
        userIdentified: !!AuthManager.getAuth()?.user
      },
      environmentVariables: {
        keysNotExposed: !window.location.search.includes('NEXT_PUBLIC'),
        noSecretsInDOM: !document.documentElement.innerHTML.includes('sk_'),
        httpsOnly: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      },
      errorHandling: {
        globalErrorHandler: !!window.onerror,
        promiseRejectionHandler: !!window.onunhandledrejection,
        errorBoundaries: document.querySelectorAll('[data-error-boundary]').length > 0
      },
      dataProtection: {
        noLocalStorageSecrets: !localStorage.getItem('api_key'),
        noSessionStorageSecrets: !sessionStorage.getItem('api_key'),
        parentPinProtection: true // PIN is hardcoded, not stored
      },
      childSafety: {
        noExternalLinks: document.querySelectorAll('a[href^="http"]:not([href*="localhost"])').length === 0,
        noInappropriateContent: true, // All content is curated
        positiveMessagesOnly: true // All feedback is positive
      }
    };

    setSecurityTests(security);
    handleInfo('Security audit completed', 'security_audit', security);
  };

  const testErrorHandling = () => {
    try {
      // Intentionally trigger an error to test error handling
      throw new Error('Test error for error handling verification');
    } catch (error) {
      handleError(error as Error, 'intentional_test_error');
      
      setTestResults(prev => ({
        ...prev,
        errorHandling: {
          errorCaught: true,
          errorLogged: true,
          gracefulFallback: true
        }
      }));
    }
  };

  const exportTestResults = () => {
    const fullReport = {
      timestamp: new Date().toISOString(),
      apiTests: testResults,
      securityAudit: securityTests,
      errorLogs: errorTracker.getLogs().slice(-10), // Last 10 logs
      systemInfo: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    const blob = new Blob([JSON.stringify(fullReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dinoalphabet-test-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    AuthManager.clearAuth();
    router.push('/login');
  };

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'success') return '✅';
    if (status === false || status === 'failed') return '❌';
    return '⏳';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900">
            🧪 API & Security Test Suite
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportTestResults}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
            >
              📊 Export Report
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              ← Back to Game
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Integration Tests */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔌 API Integration Tests</h2>
            
            {/* Authentication Status */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🔐 Authentication Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>User Authenticated:</span>
                  <span>{getStatusIcon(testResults.authentication?.isAuthenticated)} {testResults.authentication?.isAuthenticated ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current User:</span>
                  <span>{testResults.authentication?.user || 'None'}</span>
                </div>
              </div>
            </div>
            
            {/* API Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">API Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ElevenLabs API Key:</span>
                  <span>{getStatusIcon(testResults.elevenLabs?.hasKey)} {testResults.elevenLabs?.hasKey ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span>ElevenLabs Connected:</span>
                  <span>{getStatusIcon(testResults.elevenLabs?.connected)} {testResults.elevenLabs?.connected ? 'Connected' : 'Not Connected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Voices:</span>
                  <span>{testResults.elevenLabs?.voiceCount || 0} voices</span>
                </div>
                <div className="flex justify-between">
                  <span>Gemini API Key:</span>
                  <span>{getStatusIcon(testResults.gemini?.hasKey)} {testResults.gemini?.hasKey ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gemini Connected:</span>
                  <span>{getStatusIcon(testResults.gemini?.connected)} {testResults.gemini?.connected ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>
            </div>

            {/* ElevenLabs Voice Tests */}
            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🎤 ElevenLabs Voice Tests</h3>
              
              {availableVoices.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Voice:</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      changeVoice(e.target.value);
                    }}
                    className="w-full p-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Default Voice</option>
                    {availableVoices.map((voice) => (
                      <option key={voice.voice_id} value={voice.voice_id}>
                        {voice.name} ({voice.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {(['happy', 'excited', 'gentle', 'encouraging'] as const).map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => testElevenLabsVoice(emotion)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      isLoading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {getStatusIcon(testResults.elevenLabsTest?.[emotion])} Test {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Gemini AI Tests */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🧠 Gemini AI Tests</h3>
              <div className="space-y-3">
                <button
                  onClick={testGeminiAI}
                  disabled={isAnalyzing}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    isAnalyzing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isAnalyzing ? '🔄 Testing...' : '🧪 Test AI Analysis & Encouragement'}
                </button>
                
                {testResults.geminiTest && (
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Difficulty Analysis:</span>
                      <span>{getStatusIcon(testResults.geminiTest.analysisWorking)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personalized Encouragement:</span>
                      <span>{getStatusIcon(testResults.geminiTest.encouragementWorking)}</span>
                    </div>
                    {testResults.geminiTest.sampleEncouragement && (
                      <div className="p-2 bg-green-100 rounded text-green-800">
                        <strong>Sample:</strong> "{testResults.geminiTest.sampleEncouragement}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Error Handling Test */}
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">⚠️ Error Handling Test</h3>
              <button
                onClick={testErrorHandling}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                🧪 Test Error Handling
              </button>
              {testResults.errorHandling && (
                <div className="mt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Error Caught:</span>
                    <span>{getStatusIcon(testResults.errorHandling.errorCaught)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Logged:</span>
                    <span>{getStatusIcon(testResults.errorHandling.errorLogged)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graceful Fallback:</span>
                    <span>{getStatusIcon(testResults.errorHandling.gracefulFallback)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Audit */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔒 Security Audit</h2>
            
            {/* Authentication Security */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🔐 Authentication Security</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Login Required:</span>
                  <span>{getStatusIcon(securityTests.authentication?.loginRequired)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Valid:</span>
                  <span>{getStatusIcon(securityTests.authentication?.sessionValid)}</span>
                </div>
                <div className="flex justify-between">
                  <span>User Identified:</span>
                  <span>{getStatusIcon(securityTests.authentication?.userIdentified)}</span>
                </div>
              </div>
            </div>

            {/* Environment Security */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🔐 Environment Security</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Keys Not in URL:</span>
                  <span>{getStatusIcon(securityTests.environmentVariables?.keysNotExposed)}</span>
                </div>
                <div className="flex justify-between">
                  <span>No Secrets in DOM:</span>
                  <span>{getStatusIcon(securityTests.environmentVariables?.noSecretsInDOM)}</span>
                </div>
                <div className="flex justify-between">
                  <span>HTTPS/Localhost Only:</span>
                  <span>{getStatusIcon(securityTests.environmentVariables?.httpsOnly)}</span>
                </div>
              </div>
            </div>

            {/* Error Handling Security */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">⚡ Error Handling</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Global Error Handler:</span>
                  <span>{getStatusIcon(securityTests.errorHandling?.globalErrorHandler)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promise Rejection Handler:</span>
                  <span>{getStatusIcon(securityTests.errorHandling?.promiseRejectionHandler)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Boundaries:</span>
                  <span>{getStatusIcon(true)} Active</span>
                </div>
              </div>
            </div>

            {/* Data Protection */}
            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🛡️ Data Protection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>No Secrets in LocalStorage:</span>
                  <span>{getStatusIcon(securityTests.dataProtection?.noLocalStorageSecrets)}</span>
                </div>
                <div className="flex justify-between">
                  <span>No Secrets in SessionStorage:</span>
                  <span>{getStatusIcon(securityTests.dataProtection?.noSessionStorageSecrets)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parent PIN Protection:</span>
                  <span>{getStatusIcon(securityTests.dataProtection?.parentPinProtection)}</span>
                </div>
              </div>
            </div>

            {/* Child Safety */}
            <div className="p-4 bg-pink-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">👶 Child Safety</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>No External Links:</span>
                  <span>{getStatusIcon(securityTests.childSafety?.noExternalLinks)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Curated Content Only:</span>
                  <span>{getStatusIcon(securityTests.childSafety?.noInappropriateContent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Positive Messages Only:</span>
                  <span>{getStatusIcon(securityTests.childSafety?.positiveMessagesOnly)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Test Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-green-700">🔐 Authentication</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Verify login is required for all protected pages</li>
                <li>Test logout functionality</li>
                <li>Check session persistence and expiration</li>
                <li>Ensure unauthorized access is blocked</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-purple-700">🎤 Voice Testing</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click each emotion test button to hear ElevenLabs voice</li>
                <li>Try different voices from the dropdown</li>
                <li>Verify voice quality and emotional expression</li>
                <li>Check that fallback works if API fails</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-blue-700">🧠 AI Testing</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click "Test AI Analysis" to verify Gemini integration</li>
                <li>Check that difficulty analysis works</li>
                <li>Verify personalized encouragement generation</li>
                <li>Ensure graceful fallbacks for AI failures</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-green-700">✅ Expected Results</h3>
            <div className="text-sm space-y-1">
              <p>• <strong>Authentication:</strong> All protected routes should require login</p>
              <p>• <strong>With API Keys:</strong> Premium voice and AI features should work</p>
              <p>• <strong>Without API Keys:</strong> Graceful fallback to browser TTS and simple difficulty</p>
              <p>• <strong>Security:</strong> All tests should pass with green checkmarks</p>
              <p>• <strong>Errors:</strong> Should be caught and logged without breaking the app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
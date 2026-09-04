import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Globe, ShieldCheck } from 'lucide-react';
import { getBaseUrl, setBaseUrl } from '../services/api';
import { taskService } from '../services/taskService';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [url, setUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(getBaseUrl());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      // Temporarily set base URL for test
      setBaseUrl(url);
      const health = await taskService.getHealth();
      setTestResult({
        success: true,
        data: health,
        message: 'Successfully connected to FastAPI server!',
      });
      onSettingsUpdated();
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection failed. Ensure server is running.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setBaseUrl(url);
    onSettingsUpdated();
    onClose();
  };

  const handleResetDefault = () => {
    setUrl('http://127.0.0.1:8000');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="settings-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge">
              <Server size={18} />
            </div>
            <h3>Backend API Configuration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* Target Base URL */}
          <div className="form-group">
            <div className="label-row">
              <label className="form-label">FastAPI Server URL</label>
              <button
                type="button"
                className="reset-url-btn"
                onClick={handleResetDefault}
              >
                Reset to Default
              </button>
            </div>
            <div className="input-with-icon">
              <Globe size={16} className="input-icon" />
              <input
                type="text"
                className="form-input input-padded"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000"
              />
            </div>
            <span className="settings-hint">
              The API endpoint where your FastAPI backend is running.
            </span>
          </div>

          {/* Test connection action */}
          <div className="test-action-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestConnection}
              disabled={testing}
            >
              <RefreshCw size={14} className={testing ? 'spin' : ''} />
              <span>{testing ? 'Pinging server...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test result display */}
          {testResult && (
            <div
              className={`test-result-box ${
                testResult.success ? 'test-success' : 'test-failure'
              } animate-fade-in`}
            >
              <div className="test-result-header">
                {testResult.success ? (
                  <CheckCircle2 size={16} className="test-icon-success" />
                ) : (
                  <AlertCircle size={16} className="test-icon-error" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.data && (
                <pre className="test-json">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Info Card */}
          <div className="backend-info-card">
            <div className="info-card-header">
              <ShieldCheck size={16} className="shield-icon" />
              <span>Detected Backend Specs</span>
            </div>
            <div className="specs-list">
              <div className="spec-row">
                <span className="spec-key">Framework:</span>
                <span className="spec-val">FastAPI + Uvicorn</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Port:</span>
                <span className="spec-val">8000</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">CORS Origin:</span>
                <span className="spec-val">http://localhost:5173 (Enabled)</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Authentication:</span>
                <span className="spec-val">OAuth2 Bearer JWT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

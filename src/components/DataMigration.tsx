/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Data Migration Component
 * UI for migrating data from vanilla app to React app
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import {
  performMigration,
  needsMigration,
  backupOldData,
  restoreFromBackup,
  exportData,
  importData,
} from '../utils/dataMigration';

interface Props {
  onClose: () => void;
  onMigrationComplete: () => void;
}

export function DataMigration({ onClose, onMigrationComplete }: Props) {
  const [migrationStatus, setMigrationStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'info';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleMigrate = () => {
    // Backup first
    const backupSuccess = backupOldData();
    if (!backupSuccess) {
      setMigrationStatus({
        type: 'info',
        message: 'No old data found to backup. You can start fresh!',
      });
      return;
    }

    // Perform migration
    const result = performMigration();

    if (result.success) {
      setMigrationStatus({
        type: 'success',
        message: `Successfully migrated ${result.profileCount} profile(s)! Click "Done" to continue.`,
      });
    } else {
      setMigrationStatus({
        type: 'error',
        message: result.error || 'Migration failed',
      });
    }
  };

  const handleExport = () => {
    const data = exportData();
    if (!data) {
      setMigrationStatus({
        type: 'error',
        message: 'No data found to export',
      });
      return;
    }

    // Create download link
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathplay-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMigrationStatus({
      type: 'success',
      message: 'Data exported successfully!',
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);

        if (success) {
          setMigrationStatus({
            type: 'success',
            message: 'Data imported successfully! Click "Done" to reload.',
          });
        } else {
          setMigrationStatus({
            type: 'error',
            message: 'Failed to import data. Please check the file format.',
          });
        }
      } catch (error) {
        setMigrationStatus({
          type: 'error',
          message: 'Error reading file. Please check the file format.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = () => {
    const success = restoreFromBackup();
    if (success) {
      setMigrationStatus({
        type: 'success',
        message: 'Old data restored from backup',
      });
    } else {
      setMigrationStatus({
        type: 'error',
        message: 'No backup found to restore',
      });
    }
  };

  const showMigrationButton = needsMigration();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-gray-800 mb-2">Data Migration</h2>
          <p className="text-gray-600">
            Migrate your data from the old Math Fun app to the new React version
          </p>
        </div>

        {/* Status Message */}
        {migrationStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              migrationStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : migrationStatus.type === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {migrationStatus.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {migrationStatus.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {migrationStatus.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <p>{migrationStatus.message}</p>
          </motion.div>
        )}

        {/* Migration Options */}
        <div className="space-y-4 mb-8">
          {/* Auto Migration */}
          {showMigrationButton && (
            <button
              onClick={handleMigrate}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Automatic Migration</div>
                <div className="text-sm opacity-90">Migrate all profiles from old app</div>
              </div>
            </button>
          )}

          {!showMigrationButton && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold">Migration Complete!</p>
              <p className="text-sm">Your data has already been migrated</p>
            </div>
          )}

          {/* Export Data */}
          <button
            onClick={handleExport}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">Export Data</div>
              <div className="text-sm">Download backup as JSON file</div>
            </div>
          </button>

          {/* Import Data */}
          <label className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-4 rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer">
            <Upload className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">Import Data</div>
              <div className="text-sm">Restore from JSON backup file</div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* Restore Backup */}
          <button
            onClick={handleRestore}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">Restore from Backup</div>
              <div className="text-sm">Restore old data from automatic backup</div>
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Migration Instructions
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Automatic migration will backup your old data first</li>
            <li>Export data to save a manual backup before migrating</li>
            <li>Import data to restore from a previously exported file</li>
            <li>Old session history will not be migrated automatically</li>
            <li>Badges and stats will be preserved</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (migrationStatus.type === 'success') {
                onMigrationComplete();
              }
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl transition-all"
          >
            {migrationStatus.type === 'success' ? 'Done' : 'Skip for Now'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { MeterReading, MeterSettings } from '../lib/supabase';

export interface EnergyData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  energyToday: number;
  loadPercentage: number;
  powerFactor: number;
  frequency: number;
  temperature: number;
  humidity: number;
  relayStatus: 'active' | 'tripped';
  overloadThreshold: number;
  isOverloaded: boolean;
  timestamp: number;
  tripReason: 'overload' | 'undervoltage' | 'overvoltage' | 'none';
}

export function useEnergyData() {
  const [activeSensorId, setActiveSensorId] = useState<number>(1);
  const [readingsMap, setReadingsMap] = useState<Record<number, MeterReading>>({});
  const [settingsMap, setSettingsMap] = useState<Record<number, MeterSettings>>({});
  const [historyList, setHistoryList] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);

  // Load settings and latest readings initially
  const fetchData = useCallback(async () => {
    const settings = await supabase.getSettings();
    const settingsObj: Record<number, MeterSettings> = {};
    settings.forEach(s => {
      settingsObj[s.sensor_id] = s;
    });
    setSettingsMap(settingsObj);

    // Fetch latest reading for each of the 3 sensors
    const newReadingsMap: Record<number, MeterReading> = {};
    for (let id = 1; id <= 3; id++) {
      const readings = await supabase.getReadings(id, 1);
      if (readings.length > 0) {
        newReadingsMap[id] = readings[0];
      }
    }
    setReadingsMap(newReadingsMap);
    setLoading(false);
  }, []);

  // Fetch history for the active sensor
  const fetchHistory = useCallback(async () => {
    const readings = await supabase.getReadings(activeSensorId, 60);
    setHistoryList(readings);
  }, [activeSensorId]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch history when active sensor changes
  useEffect(() => {
    fetchHistory();
  }, [activeSensorId, fetchHistory]);

  // Polling for updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      // Polling latest readings
      const newReadingsMap: Record<number, MeterReading> = { ...readingsMap };
      let activeChanged = false;

      for (let id = 1; id <= 3; id++) {
        const readings = await supabase.getReadings(id, 1);
        if (readings.length > 0) {
          const latest = readings[0];
          // Check if it's newer than what we have
          if (!newReadingsMap[id] || newReadingsMap[id].id !== latest.id) {
            newReadingsMap[id] = latest;
            if (id === activeSensorId) {
              activeChanged = true;
            }
          }
        }
      }

      setReadingsMap(newReadingsMap);

      if (activeChanged) {
        fetchHistory();
      }

      // Periodically refresh settings as well (in case changed from other source)
      const settings = await supabase.getSettings();
      const settingsObj: Record<number, MeterSettings> = {};
      settings.forEach(s => {
        settingsObj[s.sensor_id] = s;
      });
      setSettingsMap(settingsObj);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSensorId, readingsMap, fetchHistory]);

  // Trigger settings updates
  const updateSensorSettings = useCallback(async (sensorId: number, newSettings: Partial<Omit<MeterSettings, 'sensor_id'>>) => {
    const success = await supabase.updateSettings(sensorId, newSettings);
    if (success) {
      setSettingsMap(prev => ({
        ...prev,
        [sensorId]: {
          ...prev[sensorId],
          ...newSettings,
          sensor_id: sensorId
        } as MeterSettings
      }));
    }
    return success;
  }, []);

  // Reset relay (manual turn back ON / active)
  const resetRelay = useCallback(async () => {
    await updateSensorSettings(activeSensorId, { relay_state: true });
  }, [activeSensorId, updateSensorSettings]);

  // Map settings and readings for the active sensor
  const activeReading = readingsMap[activeSensorId];
  const activeSettings = settingsMap[activeSensorId];

  // Helper to determine if a sensor is online (received data in the last 15 seconds)
  const getIsOnline = (reading?: MeterReading) => {
    if (!reading) return false;
    const diff = Date.now() - new Date(reading.created_at).getTime();
    return diff < 15000; // 15 seconds threshold
  };

  const deviceOnlineMap: Record<number, boolean> = {};
  const deviceLastActiveMap: Record<number, number> = {};

  for (let id = 1; id <= 3; id++) {
    const r = readingsMap[id];
    deviceOnlineMap[id] = getIsOnline(r);
    deviceLastActiveMap[id] = r ? new Date(r.created_at).getTime() : 0;
  }

  // Determine trip reason if relay is tripped
  let tripReason: 'overload' | 'undervoltage' | 'overvoltage' | 'none' = 'none';
  if (activeSettings && activeSettings.relay_state === false) {
    if (activeReading) {
      if (activeReading.voltage < activeSettings.min_voltage) {
        tripReason = 'undervoltage';
      } else if (activeReading.voltage > activeSettings.max_voltage) {
        tripReason = 'overvoltage';
      } else {
        tripReason = 'overload';
      }
    }
  }

  // If no readings, generate a placeholder / loading state
  const data: EnergyData = {
    voltage: activeReading?.voltage ?? 0,
    current: activeReading?.current ?? 0,
    power: activeReading?.power ?? 0,
    energy: activeReading?.energy ?? 0,
    energyToday: activeReading?.energy ?? 0, // Using total accumulated energy
    loadPercentage: activeReading && activeSettings ? Math.min(100, Math.round((activeReading.power / activeSettings.max_power) * 100)) : 0,
    powerFactor: activeReading?.pf ?? 1.0,
    frequency: activeReading?.frequency ?? 50.0,
    temperature: 28.5 + (Math.random() - 0.5) * 0.4, // Small fluctuation for realism
    humidity: 60.0 + (Math.random() - 0.5) * 1.0,
    relayStatus: activeSettings?.relay_state ? 'active' : 'tripped',
    overloadThreshold: activeSettings ? Math.round((activeSettings.max_power / 3000.0) * 100) : 100, // Map power to percentage for the UI slide
    isOverloaded: activeReading && activeSettings ? activeReading.power > activeSettings.max_power : false,
    timestamp: activeReading ? new Date(activeReading.created_at).getTime() : Date.now(),
    tripReason,
  };

  // Map history list to charts format
  const history = {
    voltage: historyList.map(h => h.voltage),
    current: historyList.map(h => h.current),
    power: historyList.map(h => h.power),
    timestamps: historyList.map(h => new Date(h.created_at).getTime()),
  };

  return {
    data,
    history,
    loading,
    activeSensorId,
    setActiveSensorId,
    settings: activeSettings,
    allSettings: settingsMap,
    allReadings: readingsMap,
    deviceOnlineMap,
    deviceLastActiveMap,
    resetRelay,
    updateSensorSettings,
    refreshData: fetchData
  };
}

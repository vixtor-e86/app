import { useState, useEffect, useRef, useCallback } from 'react';

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
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function generateFluctuation(base: number, variance: number) {
  return base + (Math.random() - 0.5) * variance * 2;
}

export function useEnergyData() {
  const [data, setData] = useState<EnergyData>({
    voltage: 226.4,
    current: 4.82,
    power: 1091.2,
    energy: 15678.45,
    energyToday: 12.34,
    loadPercentage: 42.5,
    powerFactor: 0.92,
    frequency: 50.02,
    temperature: 32.5,
    humidity: 58.0,
    relayStatus: 'active',
    overloadThreshold: 80,
    isOverloaded: false,
    timestamp: Date.now(),
  });

  const historyRef = useRef<{ voltage: number[]; current: number[]; power: number[]; timestamps: number[] }>({
    voltage: [],
    current: [],
    power: [],
    timestamps: [],
  });

  const [history, setHistory] = useState(historyRef.current);

  const setOverloadThreshold = useCallback((threshold: number) => {
    setData(prev => ({ ...prev, overloadThreshold: clamp(threshold, 50, 100) }));
  }, []);

  const resetRelay = useCallback(() => {
    setData(prev => ({ ...prev, relayStatus: 'active', isOverloaded: false }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const voltage = clamp(generateFluctuation(prev.voltage, 1.5), 210, 245);
        const current = clamp(generateFluctuation(prev.current, 0.3), 0.1, 15);
        const power = voltage * current * 0.92;
        const newEnergy = prev.energy + power / 3600000;
        const newEnergyToday = prev.energyToday + power / 3600000;
        const loadPercentage = clamp((current / 10) * 100, 0, 100);
        const powerFactor = clamp(generateFluctuation(prev.powerFactor, 0.02), 0.75, 1.0);
        const frequency = clamp(generateFluctuation(prev.frequency, 0.05), 49.5, 50.5);
        const temperature = clamp(generateFluctuation(prev.temperature, 0.5), 25, 60);
        const humidity = clamp(generateFluctuation(prev.humidity, 1), 30, 90);
        const isOverloaded = loadPercentage > prev.overloadThreshold;
        const relayStatus = isOverloaded ? 'tripped' : prev.relayStatus === 'tripped' ? 'tripped' : 'active';

        const newData: EnergyData = {
          ...prev,
          voltage: Math.round(voltage * 100) / 100,
          current: Math.round(current * 100) / 100,
          power: Math.round(power * 100) / 100,
          energy: Math.round(newEnergy * 100) / 100,
          energyToday: Math.round(newEnergyToday * 100) / 100,
          loadPercentage: Math.round(loadPercentage * 10) / 10,
          powerFactor: Math.round(powerFactor * 100) / 100,
          frequency: Math.round(frequency * 100) / 100,
          temperature: Math.round(temperature * 10) / 10,
          humidity: Math.round(humidity * 10) / 10,
          isOverloaded,
          relayStatus,
          timestamp: Date.now(),
        };

        historyRef.current.voltage.push(newData.voltage);
        historyRef.current.current.push(newData.current);
        historyRef.current.power.push(newData.power);
        historyRef.current.timestamps.push(newData.timestamp);

        if (historyRef.current.voltage.length > 60) {
          historyRef.current.voltage.shift();
          historyRef.current.current.shift();
          historyRef.current.power.shift();
          historyRef.current.timestamps.shift();
        }

        setHistory({ ...historyRef.current });

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, history, setOverloadThreshold, resetRelay };
}

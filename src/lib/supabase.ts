const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers = {
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};

export interface MeterReading {
  id: number;
  sensor_id: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  pf: number;
  created_at: string;
}

export interface MeterSettings {
  sensor_id: number;
  min_voltage: number;
  max_voltage: number;
  max_power: number;
  relay_state: boolean;
  updated_at?: string;
}

export interface SystemEvent {
  id: number;
  sensor_id: number;
  event_type: string;
  description: string;
  created_at: string;
}

export const supabase = {
  async getSettings(): Promise<MeterSettings[]> {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/meter_settings?order=sensor_id.asc`, { headers });
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  
  async updateSettings(sensorId: number, data: Partial<Omit<MeterSettings, 'sensor_id'>>): Promise<boolean> {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/meter_settings?sensor_id=eq.${sensorId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          ...data,
          updated_at: new Date().toISOString()
        })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async getReadings(sensorId: number, limit = 60): Promise<MeterReading[]> {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/meter_readings?sensor_id=eq.${sensorId}&order=created_at.desc&limit=${limit}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch readings');
      const data: MeterReading[] = await res.json();
      return data.reverse(); // return in chronological order for graphs
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async getEvents(limit = 10): Promise<SystemEvent[]> {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/system_events?order=created_at.desc&limit=${limit}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch events');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }
};

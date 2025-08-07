'use strict';

const Homey = require('homey');

class HartslagNuDevice extends Homey.Device {
  async onInit() {
    this.log('HartslagNu-apparaat geïnitialiseerd:', this.getName());

    const token = await this.getStoreValue('access_token');
    const user = await this.getStoreValue('username');

    if (token) {
      this.log(`Access token aanwezig voor gebruiker: ${user}`);
      
      // Start monitoring for emergency calls
      this.startMonitoring();
    } else {
      this.log('Geen access token gevonden');
      this.setUnavailable('No authentication token found');
    }
  }

  async startMonitoring() {
    this.log('🚨 Starten met monitoring van noodoproepen...');

    // Stop eventuele eerdere monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.log('Vorige monitoring gestopt.');
    }

    // Start nieuwe monitoring
    this.monitoringInterval = setInterval(async () => {
      try {
        const emergencyCalls = await this.checkForEmergencyCalls();

        if (emergencyCalls && emergencyCalls.length > 0) {
          this.log(`✅ ${emergencyCalls.length} noodoproep(en) gevonden.`);
          
          // Verwerk elke oproep
          emergencyCalls.forEach(call => {
            this.handleEmergencyCall(call);
          });
        } else {
          this.log('Geen nieuwe noodoproepen.');
        }
      } catch (error) {
        this.error('❌ Fout bij het controleren van noodoproepen:', error);
      }
    }, 30000); // Elke 30 seconden
  }

  async checkForEmergencyCalls() {
    const token = session.getStoreValue('access_token');

    const response = await fetch('https://webapi.heartsafeliving.com/api/Alarm/GetUserAlarmResponse', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('API-fout bij ophalen van noodoproepen');
    }

    const data = await response.json();
    return data.calls || [];
  }

  async triggerEmergencyCall(description) {
    this.log('Triggering emergency call:', description);
    
    const trigger = this.homey.flow.getDeviceTriggerCard('oproep_ontvangen');
    await trigger.trigger(this, {
      omschrijving: description
    });
  }

  async onDeleted() {
    this.log('Device deleted, cleaning up...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

module.exports = HartslagNuDevice;

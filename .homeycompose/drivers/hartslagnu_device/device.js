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
    this.log('Starting emergency call monitoring...');
    
    // TODO: Implement actual API polling or websocket connection
    // For now, simulate periodic checks
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkForEmergencyCalls();
      } catch (error) {
        this.error('Error checking for emergency calls:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  async checkForEmergencyCalls() {
    // TODO: Implement actual API call to check for new emergency calls
    // const token = await this.getStoreValue('access_token');
    // const response = await fetch('https://api.mijnhartslagnu.nl/calls', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    
    // For now, this is just a placeholder
    this.log('Checking for emergency calls...');
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

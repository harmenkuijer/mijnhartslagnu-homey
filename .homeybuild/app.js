'use strict';

const Homey = require('homey');

class MijnHartslagNuApp extends Homey.App {
  async onInit() {
    this.log('MijnHartslagNu App gestart');

    this.trigger = this.homey.flow.getTriggerCard('oproep_ontvangen');

    // Register API endpoints
    this.homey.api.realtime('test_trigger', async (args) => {
      this.log('Test trigger API called');
      
      await this.trigger.trigger({
        omschrijving: args.body.description || 'Test oproep via API'
      });
      
      return { success: true, message: 'Trigger executed' };
    });

    // Simuleer een trigger na 10 seconden voor testing
    setTimeout(() => {
      this.trigger.trigger({
        omschrijving: 'Testoproep via Homey App - opstarten'
      });
      this.log('Initial test trigger uitgevoerd');
    }, 10000);
  }

  // Method to trigger emergency calls from devices
  async triggerEmergencyCall(description, deviceId = null) {
    this.log('Triggering emergency call:', description);
    
    const tokens = {
      omschrijving: description
    };

    if (deviceId) {
      // Trigger for specific device
      const device = this.homey.drivers.getDevice({ id: deviceId });
      if (device) {
        await this.trigger.trigger(device, tokens);
      }
    } else {
      // Global trigger
      await this.trigger.trigger(tokens);
    }
  }
}

module.exports = MijnHartslagNuApp;

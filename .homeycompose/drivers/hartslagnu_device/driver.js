'use strict';

const Homey = require('homey');

class HartslagNuDriver extends Homey.Driver {
  async onInit() {
    this.log('MijnHartslagNu Driver initialized');
  }

  async onPair(session) {
    this.log('Pairing started');

    session.setHandler('list_devices', async () => {
      return [
        {
          name: 'MijnHartslagNu Apparaat',
          data: { id: 'hartslagnu-device-001' }
        }
      ];
    });

    session.setHandler('login', async (data) => {
      const { username, password } = data;

      if (!username || !password) {
        return { success: false, error: 'Gebruikersnaam en wachtwoord zijn vereist.' };
      }

      this.log('Login poging met gebruikersnaam:', username);

      try {
        const response = await fetch('https://webapi.heartsafeliving.com/api/Token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return { success: false, error: errorData.message || 'Authenticatie mislukt.' };
        }

        const result = await response.json();

        // Stel dat de API een access_token teruggeeft
        if (result.access_token) {
          session.setStoreValue('username', username);
          session.setStoreValue('access_token', result.access_token);

          return { success: true };
        } else {
          return { success: false, error: 'Geen toegangstoken ontvangen van de API.' };
        }
      } catch (err) {
        this.log('Fout bij login:', err);
        return { success: false, error: 'Netwerkfout of server niet bereikbaar.' };
      }
    });

  }
}

module.exports = HartslagNuDriver;

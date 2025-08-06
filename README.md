# MijnHartslagNu Homey App

This Homey app integrates with the MijnHartslagNu emergency response system, allowing you to receive notifications about emergency calls directly in your Homey flows.

## Features

- **Emergency Call Notifications**: Receive real-time notifications when emergency calls are dispatched
- **Flow Integration**: Use emergency calls as triggers in your Homey flows
- **Device Management**: Add and manage MijnHartslagNu devices with authentication
- **Multi-language Support**: Available in English and Dutch

## Installation

1. Install the app from the Homey App Store (when published)
2. Add a MijnHartslagNu device
3. Enter your MijnHartslagNu credentials during pairing
4. The device will start monitoring for emergency calls

## Flow Cards

### Triggers
- **Emergency call received**: Triggered when a new emergency call is received
  - Token: `omschrijving` (Description of the emergency call)

## Configuration

The app requires valid MijnHartslagNu credentials to function. These are entered during the device pairing process.

## Development

### Prerequisites
- Node.js
- Homey CLI (`npm install -g homey`)

### Setup
```bash
npm install
homey app build
homey app install
```

### Testing
The app includes a test trigger that fires 10 seconds after startup for testing purposes.

## API Integration

The app is designed to integrate with the MijnHartslagNu API. Currently, authentication and API calls are simulated for development purposes.

### TODO
- [ ] Implement actual MijnHartslagNu API integration
- [ ] Add proper error handling for API failures
- [ ] Implement websocket connection for real-time updates
- [ ] Add device settings for polling intervals
- [ ] Add more detailed emergency call information (location, type, etc.)

## Support

For issues and feature requests, please use the GitHub repository.

## License

ISC License - see LICENSE file for details.
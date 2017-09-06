//setupJest.js
// 修正 Invariant Violation: Native module cannot be null.
jest.mock('NetInfo', () => {
    return {
        isConnected: {
            fetch: () => {
                return new Promise((accept, resolve) => {
                    accept(true);
                })
            },
            addEventListener: jest.fn()
        }
    }
});

jest.mock('react-native-device-info');
jest.mock('react-native-alert');
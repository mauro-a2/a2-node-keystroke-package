import { KeystrokeManager } from '../src';

import { getInitialTypingData } from '../src/helpers';

jest.mock('../src/helpers', () => ({
  getInitialTypingData: jest.fn(() => ({
    length: 0,
    pressTimes: [],
    releaseTimes: [],
    keyCode: [],
    keyArea: [],
    keyTypes: [],
    startUnixTime: null,
  })),
  getKeyCode: jest.fn((key: string) => key.charCodeAt(0)),
  getKeyArea: jest.fn((key: string) =>
    key >= 'a' && key <= 'z' ? 'alphabet' : 'other'
  ),
  getKeyType: jest.fn((key: string) =>
    key >= 'a' && key <= 'z' ? 'lowercase' : 'other'
  ),
}));

describe('KeystrokeManager', () => {
  let manager: KeystrokeManager;

  beforeEach(() => {
    manager = new KeystrokeManager();
  });

  it('should initialize with default values', () => {
    expect(manager.getIsTypingSessionActive).toBe(false);
    expect(getInitialTypingData).toHaveBeenCalled();
  });

  it('should update typing data on handleInputChange', () => {
    manager.processInputChange('hello');
    expect(manager['typingData']).toEqual({
      ...getInitialTypingData(),
      length: 5,
    });
  });

  it('should handle keydown and start a typing session', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000); // Mock time for predictable results
    manager.processKeydown('a');

    expect(manager.getIsTypingSessionActive).toBe(true);
    expect(manager['typingData'].startUnixTime).toBe(1000 / 1000); // seconds
    expect(manager['openKeyEntries']).toHaveProperty('a');
    expect(manager['openKeyEntries']['a']).toEqual({
      pressTime: 0,
      keyCode: 97,
      keyArea: 'alphabet',
      keyType: 'lowercase',
    });
  });

  it('should handle keyup and update typing data', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    manager.processKeydown('a');
    jest.spyOn(Date, 'now').mockReturnValue(2000); // Mock time again
    manager.processKeyup('a');

    expect(manager['typingData'].pressTimes).toEqual([0]);
    expect(manager['typingData'].releaseTimes).toEqual([1000 / 1000]);
    expect(manager['typingData'].keyArea).toEqual(['alphabet']);
    expect(manager['typingData'].keyTypes).toEqual(['lowercase']);
    expect(manager['openKeyEntries']).not.toHaveProperty('a');
  });

  it('should end the typing session and return typing data', () => {
    manager.processInputChange('test');
    const data = manager.endTypingSession();

    expect(manager.getIsTypingSessionActive).toBe(false);
    expect(data).toEqual({
      ...getInitialTypingData(),
      length: 4,
    });
  });

  it('should reset typing data', () => {
    manager.processInputChange('reset test');
    manager.resetTypingData();

    expect(manager['typingData']).toEqual(getInitialTypingData());
    expect(manager['openKeyEntries']).toEqual({});
  });
});

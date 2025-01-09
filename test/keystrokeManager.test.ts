import { KeystrokeManager } from '../src';

import { getInitialTypingData } from '../src/helpers';

jest.mock('../src/helpers', () => ({
  getInitialTypingData: jest.fn(() => ({
    text: '',
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
    manager.handleInputChange('hello');
    expect(manager['typingData']).toEqual({
      ...getInitialTypingData(),
      text: 'hello',
      length: 5,
    });
  });

  it('should handle keydown and start a typing session', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000); // Mock time for predictable results
    manager.handleKeydown('a');

    expect(manager.getIsTypingSessionActive).toBe(true);
    expect(manager['typingData'].startUnixTime).toBe(1000 * 1000); // Microseconds
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
    manager.handleKeydown('a');
    jest.spyOn(Date, 'now').mockReturnValue(2000); // Mock time again
    manager.handleKeyup('a');

    expect(manager['typingData'].pressTimes).toEqual([0]);
    expect(manager['typingData'].releaseTimes).toEqual([1000 * 1000]);
    expect(manager['typingData'].keyCode).toEqual([97]);
    expect(manager['typingData'].keyArea).toEqual(['alphabet']);
    expect(manager['typingData'].keyTypes).toEqual(['lowercase']);
    expect(manager['openKeyEntries']).not.toHaveProperty('a');
  });

  it('should end the typing session and return typing data', () => {
    manager.handleInputChange('test');
    const data = manager.endTypingSession();

    expect(manager.getIsTypingSessionActive).toBe(false);
    expect(data).toEqual({
      ...getInitialTypingData(),
      text: 'test',
      length: 4,
    });
  });

  it('should reset typing data', () => {
    manager.handleInputChange('reset test');
    manager.resetTypingData();

    expect(manager['typingData']).toEqual(getInitialTypingData());
    expect(manager['openKeyEntries']).toEqual({});
  });
});

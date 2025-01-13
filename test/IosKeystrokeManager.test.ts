import { IosKeystrokeManager } from '../src';

import { getInitialMobileTypingData } from '../src/helpers';

jest.mock('../src/helpers', () => ({
  getInitialMobileTypingData: jest.fn(() => ({
    startUnixTime: undefined,
    pasteTimes: [],
    pasteLengths: [],
    autocorrectTimes: [],
    autocorrectLengths: [],
    predictionTimes: [],
    predictionLengths: [],
    pressTimes: [],
    releaseTimes: [],
    keyArea: [],
    keyTypes: [],
    emojis: [],
    performance: [],
    textField: '',
    keyboardArea: '',
    timeZone: 0,
  })),
  getKeyCode: jest.fn((key: string) => key.charCodeAt(0)),
  getKeyArea: jest.fn((key: string) =>
    key >= 'a' && key <= 'z' ? 'alphabet' : 'other'
  ),
  getKeyType: jest.fn((key: string) =>
    key >= 'a' && key <= 'z' ? 'lowercase' : 'other'
  ),
}));

jest.mock('../src/utils', () => ({
  checkIsEmoji: jest.fn(() => false),
  getDifferenceBetweenWords: jest.fn((a, b) => a.replace(b, '')),
  getEmojiUnicode: jest.fn(() => 'emoji-unicode'),
  getInputType: jest.fn(() => 'text'),
  getKeyboardArea: jest.fn(() => 'mobile-keyboard'),
}));

describe('IosKeystrokeManager', () => {
  let manager: IosKeystrokeManager;

  beforeEach(() => {
    manager = new IosKeystrokeManager();
  });

  it('should initialize with default values', () => {
    expect(manager.getIsTypingSessionActive).toBe(false);
    expect(getInitialMobileTypingData).toHaveBeenCalled();
  });

  it('processPaste should update pasteTimes and pasteLengths', () => {
    const mockInput = document.createElement('input');
    manager.processKeydown('A ', mockInput);
    manager.processPaste('sample text');
    expect(manager.endTypingSession()).toEqual({
      ...getInitialMobileTypingData(),
      pasteTimes: expect.any(Array),
      pasteLengths: [11], // "sample text".length
      keyboardArea: 'mobile-keyboard',
      textField: 'text',
      timeZone: expect.any(Number),
      startUnixTime: expect.any(Number),
    });
  });

  it('processKeydown should handle new key presses', () => {
    const mockInput = document.createElement('input');
    manager.processKeydown('a', mockInput);

    expect(manager['openKeyEntry']).toHaveProperty('a');
    expect(manager['openKeyEntry']['a']).toEqual({
      pressTime: expect.any(Number),
      keyCode: 97,
      keyArea: 'alphabet',
      keyType: 'lowercase',
    });
  });

  it('processPrediction should not trigger on single character changes', () => {
    manager.setPrevContentLength = 5;
    manager.processPrediction('hello', 'hell');

    const data = manager.endTypingSession();
    expect(data.predictionTimes.length).toBe(0);
  });

  it('processKeyup should update releaseTimes and performance', () => {
    manager.processKeydown('A', document.createElement('input'));
    manager.processKeyup('A');

    const data = manager.endTypingSession();
    expect(data.releaseTimes.length).toBe(1);
    expect(data.performance.length).toBe(1);
  });

  it('endTypingSession should return final typing data', () => {
    manager.processKeydown('A', document.createElement('input'));
    const data = manager.endTypingSession();

    expect(data).toEqual(
      expect.objectContaining({
        pressTimes: expect.any(Array),
        releaseTimes: expect.any(Array),
      })
    );
    expect(manager.getIsTypingSessionActive).toBe(false);
  });

  it('resetTypingData should reset all data to initial state', () => {
    manager.processKeydown('A', document.createElement('input'));
    manager.resetTypingData();

    const data = manager.endTypingSession();
    expect(data.pressTimes.length).toBe(0);
    expect(data.releaseTimes.length).toBe(0);
  });
});

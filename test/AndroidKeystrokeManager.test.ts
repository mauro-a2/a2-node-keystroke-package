import { AndroidKeystrokeManager } from '../src';

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

describe('AndroidKeystrokeManager', () => {
  let manager: AndroidKeystrokeManager;

  beforeEach(() => {
    manager = new AndroidKeystrokeManager();
  });

  test('should initialize with default values', () => {
    expect(manager.getIsTypingSessionActive).toBe(false);
  });

  test('processBeforeInput should set prevContentLength and previousText', () => {
    manager.processBeforeInput('hello', 'hell');
    expect((manager as any).prevContentLength).toBe(5);
    expect((manager as any).previousText).toBe('hell');
  });

  test('processPaste should update pasteTimes and pasteLengths', () => {
    const mockInput = document.createElement('input');
    manager.processKeydown(mockInput);
    manager.processPaste('sample text');
    const data = manager.endTypingSession();

    expect(data.pasteTimes).toHaveLength(1);
    expect(data.pasteLengths).toEqual([11]); // "sample text".length
  });

  test('processKeyInput should handle key presses', () => {
    manager.processBeforeInput('hello', 'hell');
    manager.processKeyInput('hello!');

    expect((manager as any).lastKeyPressed).toBe('!');
  });

  test('processKeydown should initialize typing session', () => {
    const mockInput = document.createElement('input');
    manager.processKeydown(mockInput);

    const data = manager.endTypingSession();
    expect(data.textField).toBe('Text_ACOFF'); // Mocked value
    expect(data.pressTimes).toEqual([0]);
  });

  test('processKeyup should update typing data with key details', () => {
    (manager as any).lastKeyPressed = 'A';
    manager.processKeyup();

    const data = manager.endTypingSession();
    expect(data.keyArea).toContain('other'); // Mocked value
    expect(data.keyTypes).toContain('other'); // Mocked value
    expect(data.emojis).toHaveLength(0);
  });

  test('endTypingSession should return final typing data and deactivate session', () => {
    const mockInput = document.createElement('input');
    manager.processKeydown(mockInput);
    manager.processPaste('sample');
    const data = manager.endTypingSession();

    expect(data.pasteLengths).toEqual([6]);
    expect(manager.getIsTypingSessionActive).toBe(false);
  });

  test('resetTypingData should reset all data to initial state', () => {
    manager.processPaste('sample');
    manager.resetTypingData();

    const data = manager.endTypingSession();
    expect(data.pasteTimes).toHaveLength(0);
    expect(data.pasteLengths).toHaveLength(0);
    expect((manager as any).performanceStart).toBe(0);
  });
});

import { TokenParserMiddleware } from './token-parser.middleware';

describe('TokenParserMiddleware', () => {
  it('should be defined', () => {
    expect(new TokenParserMiddleware()).toBeDefined();
  });
});

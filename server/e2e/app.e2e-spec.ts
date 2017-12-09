import { MeanChatPage } from './app.po';

describe('mean-chat App', () => {
  let page: MeanChatPage;

  beforeEach(() => {
    page = new MeanChatPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

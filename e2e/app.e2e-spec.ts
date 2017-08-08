import { ServerlessGraphqlSubscriptionsPage } from './app.po';

describe('serverless-graphql-subscriptions App', () => {
  let page: ServerlessGraphqlSubscriptionsPage;

  beforeEach(() => {
    page = new ServerlessGraphqlSubscriptionsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

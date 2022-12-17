import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

const repositoryName = prismic.getRepositoryName(process.env.PRISMIC_API_ENDPOINT);
// const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

export interface PrismicConfig {
  req?: HttpRequestLike;
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(
    repositoryName,
    // {accessToken},
  );

  enableAutoPreviews({client, req: config.req});

  return client;
}

import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import {
  ContentfulCreateRecordAction,
  ContentfulGetRecordAction,
  ContentfulSearchRecordsAction,
} from './lib/actions/records';
import { ContentfulAuth } from './lib/common';

export const contentful = createPiece({
  displayName: 'Contentful',
  auth: ContentfulAuth,
  minimumSupportedRelease: '0.6.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/contentful.png',
  authors: ['cyrilselasi'],
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  actions: [
    ContentfulSearchRecordsAction,
    ContentfulGetRecordAction,
    ContentfulCreateRecordAction,
    createCustomApiCallAction({
      baseUrl: () => `https://api.contentful.com`,
      auth: ContentfulAuth,
      authMapping: (auth) => ({
        Authorization: `Bearer ${(auth as { apiKey: string }).apiKey}`,
      }),
    }),
  ],
  triggers: [],
});

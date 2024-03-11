import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { readFileAction } from './lib/actions/read-file';

export const filesHelper = createPiece({
  displayName: 'Files Helper',
description: "Effortlessly manage your files",

  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/file-piece.svg',
  categories: [PieceCategory.CORE],
  authors: ['Salem-Alaa'],
  actions: [readFileAction],
  triggers: [],
});

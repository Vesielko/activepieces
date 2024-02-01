import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { addWorksheetAction } from './lib/actions/add-worksheet';
import { appendRowAction } from './lib/actions/append-row';
import { appendTableRowsAction } from './lib/actions/append-table-rows';
import { clearWorksheetAction } from './lib/actions/clear-worksheet';
import { convertToRangeAction } from './lib/actions/convert-to-range';
import { createTableAction } from './lib/actions/create-table';
import { deleteTableAction } from './lib/actions/delete-table';
import { deleteWorkbookAction } from './lib/actions/delete-workbook';
import { deleteWorksheetAction } from './lib/actions/delete-worksheet';
import { getTableColumnsAction } from './lib/actions/get-table-columns';
import { getTableRowsAction } from './lib/actions/get-table-rows';
import { getWorkbooksAction } from './lib/actions/get-workbooks';
import { getWorksheetRowsAction } from './lib/actions/get-worksheet-rows';
import { getWorksheetsAction } from './lib/actions/get-worksheets';
import { lookupTableColumnAction } from './lib/actions/lookup-table-column';
import { updateRowAction } from './lib/actions/update-row';
import { readNewRows } from './lib/trigger/new-row-added';

export const excelAuth = PieceAuth.OAuth2({
  description: 'Authentication for Microsoft Excel 365',
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  required: true,
  scope: ['Files.ReadWrite', 'offline_access'],
});

export const microsoftExcel = createPiece({
  displayName: 'Microsoft Excel 365',
  auth: excelAuth,
  minimumSupportedRelease: '0.8.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/microsoft-excel-365.png',
  authors: ['BastienMe'],
  categories: [PieceCategory.CONTENT_AND_FILES],
  actions: [
    appendRowAction,
    getWorksheetsAction,
    getWorksheetRowsAction,
    updateRowAction,
    clearWorksheetAction,
    deleteWorksheetAction,
    getWorkbooksAction,
    deleteWorkbookAction,
    addWorksheetAction,
    getTableRowsAction,
    getTableColumnsAction,
    createTableAction,
    deleteTableAction,
    lookupTableColumnAction,
    appendTableRowsAction,
    convertToRangeAction,
  ],
  triggers: [readNewRows],
});

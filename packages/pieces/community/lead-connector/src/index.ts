import {
  AuthenticationType,
  createCustomApiCallAction,
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';
import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { baseUrl } from './lib/common';

import { PieceCategory } from '@activepieces/shared';
import { addContactToCampaignAction } from './lib/actions/add-contact-to-campaign';
import { addContactToWorkflowAction } from './lib/actions/add-contact-to-workflow';
import { addNoteToContactAction } from './lib/actions/add-note-to-contact';
import { createContact } from './lib/actions/create-contact';
import { createOpportunityAction } from './lib/actions/create-opportunity';
import { createTaskAction } from './lib/actions/create-task';
import { searchContactsAction } from './lib/actions/search-contacts';
import { updateContactAction } from './lib/actions/update-contact';
import { updateOpportunityAction } from './lib/actions/update-opportunity';
import { updateTaskAction } from './lib/actions/update-task';
import { contactUpdated } from './lib/triggers/contact-updated';
import { newContact } from './lib/triggers/new-contact';
import { newFormSubmission } from './lib/triggers/new-form-submission';
import { newOpportunity } from './lib/triggers/new-opportunity';

const markdownDescription = `
To obtain your API key, follow the steps below:
1. Go to Settings -> Business Profile
2. Under General Information, find the API Key
3. Copy the API Key and paste it in the API Key field
`;

export const leadConnectorAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: markdownDescription,
  required: true,
  async validate({ auth }) {
    try {
      await httpClient.sendRequest({
        url: `${baseUrl}/campaigns?status=published`,
        method: HttpMethod.GET,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: auth,
        },
      });

      return {
        valid: true,
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API key.',
      };
    }
  },
});

export const leadConnector = createPiece({
  displayName: 'LeadConnector',
  description: 'Lead Connector - Go High Level',
  auth: leadConnectorAuth,
  minimumSupportedRelease: '0.9.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/lead-connector.png',
  authors: ['MoShizzle'],
  categories: [PieceCategory.SALES_AND_CRM, PieceCategory.MARKETING],
  actions: [
    createContact,
    updateContactAction,
    addContactToCampaignAction,
    addContactToWorkflowAction,
    addNoteToContactAction,
    searchContactsAction,
    createOpportunityAction,
    updateOpportunityAction,
    createTaskAction,
    updateTaskAction,
    createCustomApiCallAction({
      baseUrl: () => {
        return baseUrl;
      },
      auth: leadConnectorAuth,
      authMapping: (auth) => {
        return {
          Authorization: `Bearer ${auth}`,
        };
      },
    }),
  ],
  triggers: [newContact, contactUpdated, newFormSubmission, newOpportunity],
});

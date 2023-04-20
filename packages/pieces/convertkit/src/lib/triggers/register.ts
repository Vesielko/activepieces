import { TriggerStrategy, createTrigger, Property, PiecePropertyMap } from '@activepieces/pieces-framework'
import { httpClient, HttpRequest, HttpMethod } from '@activepieces/pieces-common'

interface Props {
  name: string,
  event: string,
  displayName: string,
  description: string,
  sampleData: object,
  props?: PiecePropertyMap
}

export const convertkitRegisterTrigger = ({ name, event, displayName, description, sampleData, props}: Props) => createTrigger({
  name: `convertkit_trigger_${name}`,
  displayName,
  description,
  props: {
    authentication: Property.SecretText({
      displayName: 'Secret API Key',
      description: `
        To access your **Secret API Key**
        1. Log in to ConvertKit
        2. Go to [Advanced Settings](https://app.convertkit.com/account_settings/advanced_settings)
        3. Copy **API Secret** and Paste it below.
        4. Click **Save**
      `,
      required: true
    }),
    ...(props ?? {})
  },
  sampleData: sampleData,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const { authentication, ...eventProps } = context.propsValue

    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `https://api.convertkit.com/v3/automations/hooks`,
      body: {
        event: {name: event, ...eventProps} ,
        target_url: context.webhookUrl,
        api_secret: authentication
      }
    };
    const { body: webhook } = await httpClient.sendRequest<WebhookInformation>(request)
    console.debug("webhook created", webhook)

    await context.store.put<WebhookInformation>(`convertkit_${event}_trigger`, webhook)
  },
  async onDisable(context) {
    const response = await context.store.get<WebhookInformation>(`convertkit_${event}_trigger`);
    if (response !== null && response !== undefined) {
      const request: HttpRequest = {
        method: HttpMethod.DELETE,
        url: `https://api.convertkit.com/v3/automations/hooks/${response.rule.id}`,
        body: {
          api_secret: context.propsValue.authentication as string
        }
      };
      await httpClient.sendRequest(request)
    }
  },
  async run(context) {
    console.debug("payload received", context.payload.body)
    return [context.payload.body];
  }
})

interface WebhookInformation {
  rule: {
    id: number,
    account_id: number,
    event: {
      name: string
    }
  }
}
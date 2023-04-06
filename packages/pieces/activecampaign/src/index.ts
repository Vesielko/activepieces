
import { createPiece } from "@activepieces/framework"
import { activeCampaignTriggers } from "./lib/triggers"

import packageJson from "../package.json"

export const activecampaign = createPiece({
  name: "activecampaign",
  displayName: "Activecampaign",
  logoUrl: "https://www.activecampaign.com/themes/v2/images/favicons/favicon.svg",
  version: packageJson.version,
  authors: [],
  actions: [],
  triggers: activeCampaignTriggers,
});

import { Client } from "@gadget-client/moondog-checkout";

export const api = new Client({ environment: window.gadgetConfig.environment });

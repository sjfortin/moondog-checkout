import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SaveGiphyLinkShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { SaveGiphyLinkShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { SaveGiphyLinkShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const { giphyLink } = params;

  // save the selected pre-purchase product in a SHOP owned metafield
  const response = await connections.shopify.current?.graphql(
    `mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
          ownerType
          key
          namespace
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      metafields: [
        {
          key: "giphy-link",
          namespace: "moondog",
          ownerId: `gid://shopify/Shop/${record.id}`,
          type: "url",
          value: giphyLink,
        },
      ],
    }
  );

  // print to the Gadget Logs
  logger.info({ response }, "add metafields response");
}

module.exports.params = {
  giphyLink: { type: "string" },
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};

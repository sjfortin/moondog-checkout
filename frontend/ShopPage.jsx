import { useFindFirst, useAction } from "@gadgetinc/react";
import {
  Layout,
  Page,
  TextField,
  Spinner,
  BlockStack,
  InlineGrid,
  Card,
  Box,
  useBreakpoints,
  Divider,
  Text,
} from "@shopify/polaris";
import { api } from "./api";
import { useState, useCallback, useEffect } from "react";

const ShopPage = () => {
  const [giphyLink, setGiphyLink] = useState("");
  const { smUp } = useBreakpoints();

  const [{ data: shopData, fetching: shopFetching, error: shopFetchError }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        giphyLink: true,
      },
    });

  const [
    { data: saveResponse, fetching: saving, error: saveError },
    saveGiphyLink,
  ] = useAction(api.shopifyShop.saveGiphyLink);

  const handleChange = useCallback(
    (newGiphyLink) => setGiphyLink(newGiphyLink),
    []
  );

  const saveSelection = useCallback(() => {
    if (shopData && giphyLink) {
      void saveGiphyLink({ id: shopData.id, giphyLink: giphyLink });
    }
  }, [giphyLink, shopData]);

  // Set the initial giphyLink state when the data is loaded
  useEffect(() => {
    if (shopData && shopData.giphyLink) {
      setGiphyLink(shopData.giphyLink);
    }
  }, [shopData]);

  return (
    <Page
      title="Select Giphy Link to Display"
      primaryAction={{
        content: "Save",
        onAction: saveSelection,
        disabled: !giphyLink || saving,
      }}
      divider
    >
      {shopFetching ? (
        <Spinner size="large" />
      ) : (
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          {/* {smUp ? <Divider /> : null} */}
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Gif
                </Text>
                <Text as="p" variant="bodyMd">
                  Select the Giphy Link to Display in Checkout
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <TextField
                  label="Giphy link"
                  value={giphyLink}
                  onChange={handleChange}
                  autoComplete="off"
                  type="url"
                  disabled={saving}
                />
                <img src={giphyLink} alt="" />
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>
      )}
    </Page>
  );
};

export default ShopPage;

import { Page, Text } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="About the app"
      backAction={{
        content: "Shop Information",
        onAction: () => navigate("/"),
      }}
    >
      <Text variant="bodyMd" as="p">
        Checkout UI Extension Playground
      </Text>
    </Page>
  );
};

export default AboutPage;

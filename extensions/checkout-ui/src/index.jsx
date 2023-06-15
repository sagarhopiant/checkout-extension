import React, { useEffect, useState } from "react";
import {
  useExtensionApi,
  render,
  Image,
  Text,
  Banner,
  BlockStack,
  Divider,
  Heading,
  InlineLayout,
  SkeletonImage,
  SkeletonText,
  Button,
  useCartLines,
  useApplyCartLinesChange,
  Checkbox,
  useBuyerJourney,
  useExtensionEditor,
  useAttributes,
  useExtensionData,
} from "@shopify/checkout-ui-extensions-react";

render("Checkout::Dynamic::Render", () => <App />);

function App() {
  const lines = useCartLines();
  const [adding, setAdding] = useState(false);
  const applyCartLinesChange = useApplyCartLinesChange();
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const { query, i18n } = useExtensionApi();
  const [showError, setShowError] = useState(false);
  const [check, setCheck] = useState(true);
  const { rendered } = useExtensionData();

  useEffect(() => {
    setLoading(true);
    if (rendered.current) {
      query(
        `query ($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
            images(first:1){
              nodes {
                url
              }
            }
            variants(first: 1) {
              nodes {
                id
                price {
                  amount
                }
              }
            }
          }
        }`,
        {
          variables: { handle: "gift-card" },
        }
      )
        .then(({ data }) => {
          setProducts(data.productByHandle);
          const line = lines.filter(
            (line) =>
              line.merchandise.id === data.productByHandle.variants.nodes[0].id
          );
          line.length == 0 &&
            applyCartLinesChange({
              type: "addCartLine",
              merchandiseId: data.productByHandle.variants.nodes[0].id,
              quantity: 1,
            });
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, []);
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Divider />
        <Heading level={2}>You might also like</Heading>
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <SkeletonImage aspectRatio={1} />
            <BlockStack spacing="none">
              <SkeletonText inlineSize="large" />
              <SkeletonText inlineSize="small" />
            </BlockStack>
            <Button kind="secondary" disabled={true}>
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      </BlockStack>
    );
  }
  // If product variants can't be loaded, then show nothing
  if (!loading && Object.keys(products).length === 0) {
    return null;
  }
  const { images, title, variants } = products;
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
  const imageUrl =
    images.nodes[0]?.url ??
    "https://cdn.shopify.com/s/files/1/0777/6911/3904/files/Main_64x64.jpg";
  const handleCheckboxChange = async (value) => {
    setCheck(value);
    if (value) {
      await applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: variants.nodes[0].id,
        quantity: 1,
      });
    } else {
      const line = lines.find(
        (line) => line.merchandise.id === variants.nodes[0].id
      );
      await applyCartLinesChange({
        type: "updateCartLine",
        id: line.id,
        quantity: 0,
      });
    }
  };
  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          // Use the `columns` property to set the width of the columns
          // Image: column should be 64px wide
          // BlockStack: column, which contains the title and price, should "fill" all available space
          // Button: column should "auto" size based on the intrinsic width of the elements
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>

          <Checkbox
            id="checkbox"
            name="checkbox"
            onChange={(value) => handleCheckboxChange(value)}
            value={check}
          ></Checkbox>
        </InlineLayout>
      </BlockStack>
      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
    </BlockStack>
  );
}

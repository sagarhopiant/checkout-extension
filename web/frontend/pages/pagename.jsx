import {
  Avatar,
  LegacyCard,
  Page,
  ResourceItem,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";

export default function PageName() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/api/getAllUsers")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        const { data } = res;
        setUsers(data);
      });
  }, []);
  return (
    <Page>
      <TitleBar title={"All Users"} />
      <LegacyCard>
        <ResourceList
          resourceName={{ singular: "customer", plural: "customers" }}
          items={users}
          renderItem={(item) => {
            const { name, email } = item;
            const media = <Avatar size="medium" name={name} />;

            return (
              <ResourceItem
                media={media}
                accessibilityLabel={`View details for ${name}`}
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {name}
                </Text>
                <div>{email}</div>
              </ResourceItem>
            );
          }}
        />
      </LegacyCard>
    </Page>
  );
}

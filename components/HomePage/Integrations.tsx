"use client";

import React from "react";

// Local
import { useAccountContext } from "../Context/Account";
import IntegrationButton from "../Button/Integration";

const integrations = [
  {
    text: "Jira",
    integrationUrl: "https://www.atlassian.com/software/jira",
    iconPath: "/icons/jira.svg",
  },
];

const Integrations = () => {
  const { userInfos, mutateUserInfos, selectedIndex, userId, jwtToken } =
  useAccountContext();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl md:text-4xl">Integrations</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {integrations.map((integration, index) => (
          <IntegrationButton
            key={index}
            text={integration.text}
            integrationUrl={integration.integrationUrl}
            iconPath={integration.iconPath}
          />
        ))}
      </div>
    </div>
  );
};

export default Integrations;

import React from "react";
import IntegrationButton from "../Button/Integration";

const integrations = [
  {
    text: "Jira",
    integrationUrl: "https://www.atlassian.com/software/jira",
    iconPath: "/icons/jira.svg",
  },
  // {
  //   text: "Slack",
  //   integrationUrl: "https://slack.com/",
  //   iconPath: "/icons/slack.svg",
  // },
  // {
  //   text: "Trello",
  //   integrationUrl: "https://trello.com/",
  //   iconPath: "/icons/trello.svg",
  // },
  // Add more integrations as needed
];

const Integrations = () => {
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

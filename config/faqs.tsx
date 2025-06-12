import { EMAIL } from "@/config";
import { PRS } from "@/config/pricing";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export type FAQItem = {
  category: string;
  question: string;
  answer: string;
};

export const FAQS: FAQItem[] = [
  {
    category: "data",
    question: `If I install GitAuto in my company's repository, will our entire code base be sent to OpenAI?`,
    answer: `No, simply installing it will not send anything. When you assign an issue to GitAuto on GitHub, the file tree structure of the repository is sent, and only the necessary files are referenced as needed based on the issue's content.`,
  },
  {
    category: "data",
    question: `Do issues or code sent to OpenAI from our company's repository remain on OpenAI's servers?`,
    answer: `No, they do not. We have a Business Associate Agreement with OpenAI, which enforces Zero Data Retention. Under normal API usage, data would be stored on OpenAI's servers for 30 days. However, with this ZDR in place, no input data is retained at all.`,
  },
  {
    category: "data",
    question: `Will the issues and code sent to OpenAI using GitAuto in our company's repository remain on GitAuto's servers?`,
    answer: `No, they will not remain. They do not remain on OpenAI's servers, nor do they remain on any other servers, including ours. However, in case of an error, logs that does not include contents are retained on AWS Lambda for debugging purposes only.`,
  },
  {
    category: "data",
    question: `Are the issues and code sent to OpenAI from our company's repository using GitAuto subject to OpenAI's learning?`,
    answer: `No, they are not subject to learning. Not only for GitAuto but also for any data sent via [here](${ABSOLUTE_URLS.OPENAI.PRIVACY}).`,
  },
  {
    category: "data",
    question: `My company also uses the OpenAI API and we have an API key. Can I use my API key with GitAuto?`,
    answer: `Yes, while it is not supported in the Free or Standard plans, it is available in the Enterprise plan. Feel free to contact ${EMAIL} for details.`,
  },
  {
    category: "features",
    question: `Does GitAuto only work on GitHub? Is it not compatible with GitLab or BitBucket?`,
    answer: `GitAuto is a GitHub app, so it can only be installed on GitHub. However, it may be possible to support other platforms as part of an enterprise plan. Please feel free to inquire: ${EMAIL}.`,
  },
  {
    category: "features",
    question: `Dear GitAuto: What inputs does GitAuto use?`,
    answer: `GitAuto utilizes the content of assigned issues, comments, the file tree of the repository, and the contents of related files. Currently, GitHub secrets are excluded. If there are any other inputs you would like us to use, please feel free to let us know at ${EMAIL}.`,
  },
  {
    category: "features",
    question: `What does GitAuto output?`,
    answer: `For bug fixes, GitAuto outputs a pull request that includes the issue number, the cause of the bug, how to reproduce it, and how to fix it. For feature development, GitAuto outputs a pull request that includes the issue number, an overview of the feature, why the feature is needed, and how to implement it.`,
  },
  {
    category: "features",
    question: `Does GitAuto automatically merge the pull requests it creates?`,
    answer: `No, GitAuto does not automatically merge its own pull requests, nor does it have the authority to do so. More importantly, GitAuto's pull requests are intended to be reviewed by humans. Please review them and decide whether they should be merged. If there is a reason why they cannot be merged, please provide feedback, and we will attempt to improve: ${EMAIL}`,
  },
  {
    category: "language",
    question: `Do you support languages other than English?`,
    answer: `Yes, you can assign GitHub issues in languages other than English. The pull request body will also be created in the corresponding language. If it defaults to English, please specify the language in the issue. If it still doesn't work, feel free to contact us at ${EMAIL}.`,
  },
  {
    category: "language",
    question: `What are programming languages supported?`,
    answer: `Yes, all the languages supported by ChatGPT are available. For front-end development, we support standard HTML, CSS, JavaScript, and libraries/frameworks like TypeScript, Tailwind CSS, and Next.js. For back-end development, we support major languages such as Java, Python, PHP, Ruby, as well as relatively newer ones like Go, Rust, Elixir, and Julia. We also support mobile development languages like Kotlin for Android and Swift for iOS.`,
  },
  {
    category: "permissions",
    question: `I would like to use GitAuto in my company's repository, but can it only be installed by the repository owner?`,
    answer: `Your organization owners or repository admins can install GitAuto (and all the GitHub apps). If you see “Settings” tab in your repository, you are likely your organization owner or the repository admin. Even if you don't see the 'Settings' tab in your repository, you might be able to request the installation to your owners.`,
  },
  {
    category: "permissions",
    question: `If a non-owner tries to install, will the admin be notified?`,
    answer: `Yes, your owners or admins will receive a notification to approve the installation, but we recommend you should ask your owners or admins to install GitAuto where you usually communicate with them.`,
  },
  {
    category: "pricing",
    question: `What happens to unused PRs in the Standard plan with ${PRS.MONTHLY.STANDARD} PRs per month?`,
    answer: `Unused PRs don't roll over and reset at the end of your billing period. Your PR quota will reset to ${PRS.MONTHLY.STANDARD} at the beginning of the next month. You can check your current billing period on your [Usage Dashboard](${RELATIVE_URLS.DASHBOARD.USAGE}).`,
  },
  {
    category: "pricing",
    question: `What happens when I use all my PRs before the end of the month?`,
    answer: `Once you've used all your PRs, you'll need to wait until the end of your billing period when your quota resets. Your PR quota will reset to ${PRS.MONTHLY.STANDARD} at the beginning of the next month. You can monitor your usage and billing period on your [Usage Dashboard](${RELATIVE_URLS.DASHBOARD.USAGE}).`,
  },
  {
    category: "pricing",
    question: `If I subscribe to the annual plan, do PRs reset annually as well?`,
    answer: `Yes. With an annual subscription, your PR quota reset happens once at the end of your annual billing period, giving you more flexibility in how you distribute your PR usage throughout the year.`,
  },
  {
    category: "pricing",
    question: `How can I increase my PR limit to ${PRS.MONTHLY.STANDARD * 2} PRs per month?`,
    answer: `You can increase the quantity of your Standard plan. By default, the Standard plan comes with Quantity=1 for ${
      PRS.MONTHLY.STANDARD
    } PRs, but you can change it to Quantity=2 to get ${
      PRS.MONTHLY.STANDARD * 2
    } PRs per month. The price scales linearly with the quantity.`,
  },
  {
    category: "pricing",
    question: "What happens if I change my plan quantity during a billing period?",
    answer: `When you change your plan quantity during a billing period, the difference will be prorated and charged at the beginning of the next month. For example, if you're originally subscribed to 20 PRs and add another 20 PRs halfway through the month, you'll be charged approximately $50 (half of $100) in addition to your regular $100 charge at the beginning of the next month, totaling around $150.`,
  },
  {
    category: "privacy",
    question: `Is my email address collected upon installation?`,
    answer: `Yes, but only if your email address is set to public. Check your GitHub settings [here](${ABSOLUTE_URLS.GITHUB.EMAIL_SETTING}).`,
  },
  {
    category: "privacy",
    question: `What is the email address used for?`,
    answer: `Account management, notifications, and nurturing. You can opt-out at any time from the email.`,
  },
  {
    category: "support",
    question: `What kind of support does GitAuto provide?`,
    answer: `Our Customer Success team is available 24/7 via email and Slack Connect (invite ${EMAIL}). Additionally, we can also hold [online meetings](${ABSOLUTE_URLS.CALENDLY}) to discuss issues while sharing screens. However, please note that due to the increasing volume of inquiries, paid plans will be prioritized over free plans.`,
  },
  {
    category: "support",
    question: `I want to know more about GitAuto, but it's a hassle to research. Can I ask online?`,
    answer: `Sure, of course! Feel free to reach out via [Twitter DM](${ABSOLUTE_URLS.TWITTER}), [LinkedIn message](${ABSOLUTE_URLS.LINKEDIN}), email ${EMAIL}, Slack Connect (invite ${EMAIL}), or [book a meeting](${ABSOLUTE_URLS.CALENDLY}). Choose your preferred method.`,
  },
];

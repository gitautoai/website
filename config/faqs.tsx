import { EMAIL } from "@/config";
import { CREDIT_PRICING } from "@/config/pricing";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export type FAQItem = {
  category: string;
  question: string;
  answer: string;
};

export const FAQS: FAQItem[] = [
  {
    category: "data",
    question: `If I install GitAuto in my company's repository, will our entire code base be sent to the AI?`,
    answer: `No, simply installing it will not send anything. When GitAuto creates a PR, the file tree structure of the repository is sent, and only the necessary files are referenced as needed based on the PR's context.`,
  },
  {
    category: "data",
    question: `Does code sent to the AI remain on external servers?`,
    answer: `No. GitAuto uses Anthropic's Claude API, which does not train on or retain customer data. Your code is processed and discarded.`,
  },
  {
    category: "data",
    question: `Will code processed by GitAuto remain on GitAuto's servers?`,
    answer: `No. Code does not remain on our servers. However, in case of an error, logs that do not include code contents are retained on AWS Lambda for debugging purposes only.`,
  },
  {
    category: "data",
    question: `Is code processed by GitAuto subject to AI model training?`,
    answer: `No. Anthropic's API does not use customer data for training. See [Anthropic's data policy](https://www.anthropic.com/policies/privacy) for details.`,
  },
  {
    category: "features",
    question: `Does GitAuto only work on GitHub? Is it not compatible with GitLab or BitBucket?`,
    answer: `GitAuto is a GitHub app, so it can only be installed on GitHub. If you need support for other platforms, please [contact us](${RELATIVE_URLS.CONTACT}).`,
  },
  {
    category: "features",
    question: `Dear GitAuto: What inputs does GitAuto use?`,
    answer: `GitAuto utilizes the PR title, body, comments, the file tree of the repository, and the contents of related files. Currently, GitHub secrets are excluded. If there are any other inputs you would like us to use, please feel free to let us know at ${EMAIL}.`,
  },
  {
    category: "features",
    question: `What does GitAuto output?`,
    answer: `GitAuto outputs a pull request with test code for the target file. It analyzes uncovered lines and branches, writes tests to cover them, and verifies the tests pass before submitting.`,
  },
  {
    category: "features",
    question: `Does GitAuto automatically merge the pull requests it creates?`,
    answer: `No, GitAuto does not automatically merge its own pull requests, nor does it have the authority to do so. More importantly, GitAuto's pull requests are intended to be reviewed by humans. Please review them and decide whether they should be merged. If there is a reason why they cannot be merged, please provide feedback, and we will attempt to improve: ${EMAIL}`,
  },
  {
    category: "language",
    question: `Do you support languages other than English?`,
    answer: `Yes, GitAuto supports languages other than English. The pull request body will be created in the corresponding language. If it defaults to English, please specify the language in the repository rules. If it still doesn't work, feel free to [contact us](/contact).`,
  },
  {
    category: "language",
    question: `What are programming languages supported?`,
    answer: `Any language with a testing framework is supported - Python, JavaScript, TypeScript, Java, Go, PHP, Ruby, Rust, Kotlin, Swift, Objective-C, C#, C++, R, Julia, Elixir, Dart, Scala, and more. Even legacy languages like COBOL and Fortran work if they have a test runner.`,
  },
  {
    category: "permissions",
    question: `I would like to use GitAuto in my company's repository, but can it only be installed by the repository owner?`,
    answer: `Your organization owners or repository admins can install GitAuto (and all the GitHub apps). If you see "Settings" tab in your repository, you are likely your organization owner or the repository admin. Even if you don't see the "Settings" tab in your repository, you might be able to request the installation to your owners.`,
  },
  {
    category: "permissions",
    question: `If a non-owner tries to install, will the admin be notified?`,
    answer: `Yes, your owners or admins will receive a notification to approve the installation, but we recommend you should ask your owners or admins to install GitAuto where you usually communicate with them.`,
  },
  {
    category: "pricing",
    question: `What happens to unused credits?`,
    answer: `Unused credits remain in your account and don't expire for 1 year. You simply pay $${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR as you use them. You can check your current credit balance on your [Credits Dashboard](${RELATIVE_URLS.DASHBOARD.CREDITS}).`,
  },
  {
    category: "pricing",
    question: `What happens when I run out of credits?`,
    answer: `When your credit balance reaches $0, GitAuto will stop generating PRs. Simply purchase more credits to continue. If you've enabled auto-reload, credits will be automatically purchased when your balance falls below your threshold. You can monitor your usage on your [Credits Dashboard](${RELATIVE_URLS.DASHBOARD.CREDITS}).`,
  },
  {
    category: "pricing",
    question: `How does the credit system work?`,
    answer: `Credits are pre-paid funds that you purchase in advance. Each PR generation costs $${CREDIT_PRICING.PER_PR.AMOUNT_USD}, which is automatically deducted from your credit balance. Credits expire after 1 year, and you can set up auto-reload to automatically purchase more credits when your balance gets low.`,
  },
  {
    category: "pricing",
    question: `Can I purchase credits in bulk for volume discounts?`,
    answer: `Currently, you can purchase up to $5,000 in credits per transaction. For larger volume purchases, please [contact us](${RELATIVE_URLS.CONTACT}).`,
  },
  {
    category: "pricing",
    question: "What is the minimum credit purchase amount?",
    answer: `The minimum credit purchase is $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}, which gives you enough credits for about ${Math.floor(CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD / CREDIT_PRICING.PER_PR.AMOUNT_USD)} PR. You can purchase any amount between $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD} and $${CREDIT_PRICING.PURCHASE_LIMITS.MAX_AMOUNT_USD.toLocaleString()}.`,
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
    answer: `Sure, of course! Feel free to reach out via [Twitter DM](${ABSOLUTE_URLS.TWITTER}), [LinkedIn message](${ABSOLUTE_URLS.LINKEDIN}), our [contact page](${RELATIVE_URLS.CONTACT}), email ${EMAIL}, Slack Connect (invite ${EMAIL}), or [book a meeting](${ABSOLUTE_URLS.CALENDLY}). Choose your preferred method.`,
  },
  {
    category: "support",
    question: `How can I contact GitAuto for sales inquiries or custom solutions?`,
    answer: `For sales inquiries or detailed discussions about your testing needs, please visit our [contact page](/contact) or email us at ${EMAIL}.`,
  },
];

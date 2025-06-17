import type { Meta, StoryObj } from "@storybook/react";
import SyncModal from "@/app/components/SyncModal";
import { SYNC_MESSAGES } from "@/app/dashboard/coverage/constants/sync-messages";

const meta: Meta<typeof SyncModal> = {
  title: "Components/SyncModal",
  component: SyncModal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          backgroundColor: "#f3f4f6", // To make the modal easier to see
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    message: SYNC_MESSAGES.LOADING,
    type: "loading",
  },
};

export const Success: Story = {
  args: {
    message: SYNC_MESSAGES.SUCCESS(15, 3, 0),
    type: "success",
  },
};

export const Error: Story = {
  args: {
    message: SYNC_MESSAGES.ERROR,
    type: "error",
  },
};

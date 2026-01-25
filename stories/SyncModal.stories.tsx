import type { Meta, StoryObj } from "@storybook/react";
import Modal from "@/app/components/Modal";
import { SYNC_MESSAGES } from "@/app/dashboard/coverage/constants/sync-messages";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
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

export const SyncLoading: Story = {
  args: {
    title: "Syncing Repository",
    type: "loading",
    message: SYNC_MESSAGES.loading,
  },
};

export const SyncError: Story = {
  args: {
    title: "Sync Failed",
    type: "error",
    message: SYNC_MESSAGES.error,
  },
};

export const ContactSuccess: Story = {
  args: {
    title: "Thank you!",
    type: "success",
    message: "Your message has been sent successfully. We'll get back to you within 24 hours.",
    onClose: () => console.log("Modal closed"),
  },
};

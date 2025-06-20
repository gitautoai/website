"use client";

// Third party imports
import { useActionState, useState, useEffect } from "react";

// Local imports (Absolute imports)
import { sendEmail } from "@/app/actions/resend/send-email";
import { generateContactConfirmationText } from "@/app/actions/resend/generate-contact-confirmation-text";
import { slackUs } from "@/app/actions/slack/slack-us";
import { saveContact } from "@/app/actions/supabase/save-contact";
import Modal from "@/app/components/Modal";
import { EMAIL, EMAIL_FROM, PRODUCT_NAME } from "@/config";
import { getRandomItem } from "@/utils/get-random-item";

// Local imports (Relative imports)
import { formatContactMessage } from "./utils/format-message";
import FormField from "./components/FormField";
import SubmitButton from "./components/SubmitButton";
import {
  COVERAGE_TARGET_OPTIONS,
  CURRENT_COVERAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  COVERAGE_MINIMUM_OPTIONS,
} from "./constants";
import { useAccountContext } from "../components/Context/Account";

const initialState = {
  success: false,
  message: "",
};

export default function ContactPage() {
  // Context
  const { userId, userName } = useAccountContext();

  // Form states
  const [currentCoverage, setCurrentCoverage] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [targetCoverage, setTargetCoverage] = useState("");
  const [minimumCoverage, setMinimumCoverage] = useState("");

  const [currentCoverageOther, setCurrentCoverageOther] = useState("");
  const [teamSizeOther, setTeamSizeOther] = useState("");
  const [targetCoverageOther, setTargetCoverageOther] = useState("");
  const [minimumCoverageOther, setMinimumCoverageOther] = useState("");

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Form action
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    // Save to database
    const saveResult = await saveContact(formData, userId, userName);

    if (saveResult.success && saveResult.data) {
      // Send Slack notification (existing)
      const message = formatContactMessage(saveResult.data);
      await slackUs(message);

      // Send email notification (direct call)
      const subjects = [
        `Thanks for reaching out to ${PRODUCT_NAME}!`,
        `Got your message!`,
        `Thanks for contacting ${PRODUCT_NAME}`,
        `Received your ${PRODUCT_NAME} inquiry`,
      ];

      const emailResult = await sendEmail({
        from: EMAIL_FROM,
        to: [saveResult.data.email],
        cc: [EMAIL],
        subject: getRandomItem(subjects),
        text: generateContactConfirmationText(saveResult.data),
      });

      if (!emailResult.success) {
        console.error("Failed to send email notification:", emailResult.error);
      }

      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }

    return saveResult;
  }, initialState);

  // Scroll to top when form is submitted successfully
  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  return (
    <>
      {!state.success && (
        <div className="max-w-4xl mx-auto py-12 mt-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your testing challenges and how GitAuto can help your team achieve
              higher test coverage.
            </p>
          </div>
        </div>
      )}

      {!state.success && (
        <div className="max-w-4xl mx-auto px-8 md:px-12">
          <form action={formAction} className="space-y-8">
            {/* 1. Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="First Name" name="firstName" type="text" required />
              <FormField label="Last Name" name="lastName" type="text" required />
            </div>

            <FormField label="Work Email" name="email" type="email" required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Company URL"
                name="companyUrl"
                type="text"
                required
                placeholder="https://example.com"
              />
              <FormField label="Job Title" name="jobTitle" type="text" required />
            </div>

            {/* 2. Team Information */}
            <FormField
              label="Your Team Size"
              name="teamSize"
              type="select"
              required
              options={TEAM_SIZE_OPTIONS}
              onChange={(e) => setTeamSize(e.target.value)}
              selectedValue={teamSize}
              otherValue={teamSizeOther}
              onOtherChange={setTeamSizeOther}
            />

            {/* 3. Job Description */}
            <FormField
              label="What is your team working on?"
              name="jobDescription"
              type="textarea"
              required
              placeholder="Tell us about your project, tech stack, or what your team is building..."
            />

            {/* 4. Test Coverage Information - All three fields displayed together */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Current Test Coverage"
                  name="currentCoverage"
                  type="select"
                  required
                  options={CURRENT_COVERAGE_OPTIONS}
                  onChange={(e) => setCurrentCoverage(e.target.value)}
                  selectedValue={currentCoverage}
                  otherValue={currentCoverageOther}
                  onOtherChange={setCurrentCoverageOther}
                />

                <FormField
                  label="Minimum Test Coverage"
                  name="minimumCoverage"
                  type="select"
                  required
                  options={COVERAGE_MINIMUM_OPTIONS}
                  onChange={(e) => setMinimumCoverage(e.target.value)}
                  selectedValue={minimumCoverage}
                  otherValue={minimumCoverageOther}
                  onOtherChange={setMinimumCoverageOther}
                />

                <FormField
                  label="Target Test Coverage"
                  name="targetCoverage"
                  type="select"
                  required
                  options={COVERAGE_TARGET_OPTIONS}
                  onChange={(e) => setTargetCoverage(e.target.value)}
                  selectedValue={targetCoverage}
                  otherValue={targetCoverageOther}
                  onOtherChange={setTargetCoverageOther}
                />
              </div>
            </div>

            {/* 5. Testing Challenges */}
            <FormField
              label="What are your biggest testing challenges?"
              name="testingChallenges"
              type="textarea"
              placeholder="e.g., Low test coverage, no time to write tests, maintaining existing tests, slow test runs..."
            />

            {/* 6. Additional Information */}
            <FormField
              label="Anything else you'd like to add?"
              name="additionalInfo"
              type="textarea"
              placeholder="Questions, specific requirements, timeline, etc..."
            />

            <div className="text-center">
              <SubmitButton />
            </div>
          </form>
        </div>
      )}

      {state.success && (
        /* Success State with Calendly Embed */
        <div className="w-full mt-16">
          <iframe
            src="https://calendly.com/gitauto/15-min?embed_domain=gitauto.ai&embed_type=Inline"
            width="100%"
            height="700"
            style={{ border: 0 }}
            title="Schedule a demo with GitAuto"
          />
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          type="success"
          title="Thank you!"
          message="Your message has been sent successfully. We'll get back to you within 24 hours, or schedule a 15-minute demo now!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <Modal
          type="error"
          title="Error"
          message={state.message || "Sorry, there was an error sending your message."}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}

import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

export const countTokens = (text: string): number => {
  try {
    const encoding = new Tiktoken(o200k_base);
    return encoding.encode(text).length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return 0;
  }
};

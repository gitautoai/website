export const verifyNpmToken = async (token: string) => {
  try {
    const response = await fetch("https://registry.npmjs.org/-/whoami", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) return { valid: true };

    // Try to get detailed error message from npm response body (optional enhancement)
    let npmError = "";
    try {
      const body = await response.text();
      // Only include npm response if it's meaningful (not empty, not just {})
      if (body && body.trim() !== "{}" && body.trim() !== "") {
        npmError = ` npm response: ${body}`;
      }
    } catch {
      // Don't fail validation if we can't parse response body - the validation result is already determined by response.ok
    }

    if (response.status === 401) {
      return {
        valid: false,
        error: `npm authentication failed (401 Unauthorized).${npmError ? npmError + "." : ""} The token may be invalid, expired, or malformed.`,
      };
    }

    return {
      valid: false,
      error: `npm registry returned error ${response.status}.${npmError ? npmError + "." : ""} Please check your token and try again.`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return {
      valid: false,
      error: `Could not connect to npm registry: ${errorMsg}. Check your internet connection and try again.`,
    };
  }
};

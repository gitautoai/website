import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
app.post('/update', async (req, res) => {
  try {
    const { id } = req.body;
    const object = await database.findObjectById(id);
    if (!object) {
      return res.status(404).send({ error: 'Object not found matching ID:' + id });
    }
    // Proceed with the update operation
    await database.updateObject(id, req.body);
    res.send({ success: true });
  } catch (error) {
    console.error('Update operation failed:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// A faulty API route to test Sentry's error monitoring
export function GET() {
  throw new Error("Sentry Example API Route Error");
  return NextResponse.json({ data: "Testing Sentry Error..." });
}

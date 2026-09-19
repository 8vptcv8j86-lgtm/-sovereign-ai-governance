import { desc, eq } from "drizzle-orm";
import { aiSystems } from "../../../db/schema";
import { actorFor } from "../../org-auth";
import { errorResponse, json, readJsonObject } from "../http";
import { assertActionAllowed } from "../governance/access";
import { auditedBatch } from "../governance/audit";
import { validateActionPayload } from "../governance/validation";

const id=(prefix:string)=>`${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0,4).toUpperCase()}`;

export async function GET(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const rows = await db.select().from(aiSystems)
      .where(eq(aiSystems.organizationId, actor.organizationId))
      .orderBy(desc(aiSystems.createdAt)).limit(100);
    return json({ systems: rows });
  } catch (error) {
    return errorResponse(error, "systems.read");
  }
}

export async function POST(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const body = validateActionPayload({ action: "register_system", ...await readJsonObject(request) });
    assertActionAllowed(actor, "register_system");
    const code = id("AI");
    const [rows] = await auditedBatch(
      db,
      actor,
      request,
      [
        db.insert(aiSystems).values({
          systemCode: code,
          organizationId: actor.organizationId,
          name: String(body.name),
          owner: String(body.owner),
          region: String(body.region),
          purpose: String(body.purpose),
          model: String(body.model || "Not specified"),
          risk: String(body.risk || "Medium"),
          data: String(body.data || "Not yet classified"),
          hostingLocation: String(body.hostingLocation || "Not recorded"),
          decisionImpact: String(body.decisionImpact || "Advisory"),
        }).returning(),
      ],
      {
        action: "system.registered",
        entityType: "ai_system",
        entityCode: code,
        details: String(body.name),
      },
    );
    return json({ system: (rows as unknown[])[0] }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "systems.write");
  }
}

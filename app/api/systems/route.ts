import { desc, eq } from "drizzle-orm";
import { aiSystems } from "../../../db/schema";
import { actorFor } from "../../org-auth";
import { errorResponse, json, readJsonObject } from "../http";
import { assertActionAllowed } from "../governance/access";
import { audit } from "../governance/audit";
import { validateActionPayload } from "../governance/validation";

export async function GET(request:Request) {
  try {
    const {db,actor} = await actorFor(request);
    const rows = await db.select().from(aiSystems).where(eq(aiSystems.organizationId,actor.organizationId)).orderBy(desc(aiSystems.createdAt)).limit(100);
    return json({ systems: rows });
  } catch (error) {
    return errorResponse(error,"systems.read");
  }
}

export async function POST(request:Request) {
  try {
    const {db,actor} = await actorFor(request);
    const body = validateActionPayload({action:"register_system",...await readJsonObject(request)});
    assertActionAllowed(actor,"register_system");
    const code = `AI-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const [system] = await db.insert(aiSystems).values({
      systemCode:code, organizationId:actor.organizationId, name:String(body.name), owner:String(body.owner), region:String(body.region),
      purpose:String(body.purpose), model:String(body.model||"Not specified"), risk:String(body.risk),
      data:String(body.data||"Not yet classified"),hostingLocation:String(body.hostingLocation||"Not recorded"),decisionImpact:String(body.decisionImpact||"Advisory"),
    }).returning();
    await audit(db,actor,request,"system.registered","ai_system",code,system.name);
    return json({ system },{status:201});
  } catch (error) {
    return errorResponse(error,"systems.write");
  }
}

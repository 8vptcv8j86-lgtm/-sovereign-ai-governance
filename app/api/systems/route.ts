import { desc, eq } from "drizzle-orm";
import { aiSystems } from "../../../db/schema";
import { actorFor } from "../../org-auth";

export async function GET(request:Request) {
  try {
    const {db,actor} = await actorFor(request);
    const rows = await db.select().from(aiSystems).where(eq(aiSystems.organizationId,actor.organizationId)).orderBy(desc(aiSystems.createdAt)).limit(100);
    return Response.json({ systems: rows });
  } catch (error) {
    const message=error instanceof Error?error.message:"Unable to load systems";
    return Response.json({error:message},{status:message==="AUTH_REQUIRED"?401:message==="ACCESS_DENIED"?403:500});
  }
}

export async function POST(request:Request) {
  try {
    const body = await request.json() as Record<string,string>;
    if (!body.name?.trim() || !body.owner?.trim() || !body.purpose?.trim()) return Response.json({ error:"Name, owner and purpose are required" },{status:400});
    const code = `AI-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const {db,actor} = await actorFor(request);
    const [system] = await db.insert(aiSystems).values({
      systemCode:code, organizationId:actor.organizationId, name:body.name.trim(), owner:body.owner.trim(), region:body.region || "Not specified",
      purpose:body.purpose.trim(), model:body.model?.trim() || "Not specified", risk:body.risk || "Medium",
    }).returning();
    return Response.json({ system },{status:201});
  } catch (error) {
    const message=error instanceof Error?error.message:"Unable to register system";
    return Response.json({error:message},{status:message==="AUTH_REQUIRED"?401:message==="ACCESS_DENIED"?403:500});
  }
}

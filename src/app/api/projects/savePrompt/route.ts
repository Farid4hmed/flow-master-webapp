import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { projectId, prompts } = await request.json();

    if (!projectId || !prompts) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updateResponse = await sql`
      UPDATE sm_project
      SET prompts = ${JSON.stringify(prompts)}
      WHERE id = ${projectId}
      RETURNING *;
    `;

    const updatedProject = updateResponse.rows[0]; 
    
    return new Response(JSON.stringify({ project: updatedProject }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating prompts:", error);
    return new Response(JSON.stringify({ error: "Failed to update prompts" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
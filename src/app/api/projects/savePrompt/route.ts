// app/api/updatePrompt/route.ts
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { projectId, prompts } = await request.json();

    // Validate the required fields
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

    // Update the project with the new prompts array
    const updateResponse = await sql`
      UPDATE sm_project
      SET prompts = ${JSON.stringify(prompts)}
      WHERE id = ${projectId}
      RETURNING *;
    `;

    const updatedProject = updateResponse.rows[0]; // Get the updated project
    
    console.log("HERE", updatedProject)
    // Return the updated project
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
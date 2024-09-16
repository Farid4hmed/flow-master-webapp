// app/api/updateMermaid/route.ts
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { projectId, mermaid } = await request.json();

    // Validate the required fields
    if (!projectId || !mermaid) {
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

    // Update the project with the new mermaid string
    const updateResponse = await sql`
      UPDATE sm_project
      SET mermaid = ${mermaid}
      WHERE id = ${projectId}
      RETURNING *;
    `;

    const updatedProject = updateResponse.rows[0]; // Get the updated project

    // Return the updated project
    return new Response(JSON.stringify({ project: updatedProject }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating mermaid:", error);
    return new Response(JSON.stringify({ error: "Failed to update mermaid" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { projectId, mermaid } = await request.json();

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

    const updateResponse = await sql`
      UPDATE sm_project
      SET mermaid = ${mermaid}
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
    console.error("Error updating mermaid:", error);
    return new Response(JSON.stringify({ error: "Failed to update mermaid" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
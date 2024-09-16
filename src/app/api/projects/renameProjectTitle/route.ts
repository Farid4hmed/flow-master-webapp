import { sql } from "@vercel/postgres";

export async function PATCH(request: Request) {
  try {
    const { projectId, userId, newTitle } = await request.json();

    if (!projectId || !newTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: projectId or newTitle" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await sql`
      UPDATE sm_project
      SET title = ${newTitle}
      WHERE id = ${projectId} AND user_id = ${userId}
      RETURNING *;
    `;

    const updatedProject = response.rows[0]; 

    if (!updatedProject) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify({ project: updatedProject }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating project title:", error);
    return new Response(JSON.stringify({ error: "Failed to update project title" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

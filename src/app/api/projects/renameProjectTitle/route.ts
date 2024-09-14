import { sql } from "@vercel/postgres";

export async function PATCH(request: Request) {
  try {
    // Parse the JSON body from the request
    const { projectId, userId, newTitle } = await request.json();

    // Validate the required fields
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

    // Update the project title in the sm_project table
    const response = await sql`
      UPDATE sm_project
      SET title = ${newTitle}
      WHERE id = ${projectId} AND user_id = ${userId}
      RETURNING *;
    `;

    const updatedProject = response.rows[0]; // Get the updated project

    // If no project was found and updated, return a 404 error
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

    // Return the updated project
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

// // Export the handler so that it can be properly used by the framework
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
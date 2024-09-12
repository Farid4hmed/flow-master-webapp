import { sql } from "@vercel/postgres";

export async function DELETE(request: Request) {
  try {
    // Parse the JSON body from the request
    const { projectId, userId } = await request.json();

    // Validate the required fields
    if (!projectId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: projectId or userId" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Delete the project from the sm_project table, ensuring it belongs to the specified user
    const response = await sql`
      DELETE FROM sm_project
      WHERE id = ${projectId} AND user_id = ${userId}
      RETURNING *;
    `;

    const deletedProject = response.rows[0]; // Get the deleted project

    // If no project was found and deleted, return a 404 error
    if (!deletedProject) {
      return new Response(
        JSON.stringify({ error: "Project not found or user does not have permission" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Return the deleted project
    return new Response(JSON.stringify({ project: deletedProject }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Export the handler so that it can be properly used by the framework
export const config = {
  api: {
    bodyParser: false,
  },
};
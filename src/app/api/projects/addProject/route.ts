// app/api/addProject/route.ts
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { userId, title, prompts, mermaid } = await request.json();

    // Validate the required fields
    if (!userId || !title) {
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

    // Insert the new project into the sm_project table
    const response = await sql`
      INSERT INTO sm_project (user_id, title, prompts, mermaid)
      VALUES (${userId}, ${title}, ${JSON.stringify(prompts)}, ${mermaid})
      RETURNING *;
    `;

    const newProject = response.rows[0]; // Get the newly inserted project

    // Return the newly added project
    return new Response(JSON.stringify({ project: newProject }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return new Response(JSON.stringify({ error: "Failed to add project" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
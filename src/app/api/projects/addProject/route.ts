// app/api/addProject/route.ts
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { userId, title, prompts, mermaid } = await request.json();
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

    const response = await sql`
      INSERT INTO sm_project (user_id, title, prompts, mermaid)
      VALUES (${userId}, ${title}, ${JSON.stringify(prompts)}, ${mermaid})
      RETURNING *;
    `;

    const newProject = response.rows[0]; 

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
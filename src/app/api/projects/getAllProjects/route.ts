// app/api/projects/getProjects.ts
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  try {
    // Get the userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate that the userId is provided
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Query the sm_project table for all projects associated with the userId
    const response = await sql`
      SELECT * FROM sm_project WHERE user_id = ${userId}
    `;

    // Return the projects associated with the userId, or an empty array if none are found
    return new Response(JSON.stringify({ projects: response.rows }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
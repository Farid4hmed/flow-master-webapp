export async function POST(request: Request) {
  try {
    const { userId, title, prompts, mermaid } = await request.json();
    
    // Validate required fields
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

    // Make a POST request to the external API to add the project
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/addProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title,
        prompts,
        mermaid,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200 || apiResponse.status === 201) {
      // Return the project details from the external API
      return new Response(JSON.stringify({ project: data.body }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle failed API response
      return new Response(JSON.stringify({ error: "Failed to add project" }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
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
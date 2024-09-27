export async function POST(request: Request) {
  try {
    const { projectId, prompts } = await request.json();

    // Validate that both projectId and prompts are provided
    if (!projectId || !prompts) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: projectId or prompts" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Make a PUT request to the external API to update the prompts
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/savePrompt', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        prompts,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200) {
      // Return a successful response with updated prompts
      return new Response(JSON.stringify({ message: data.body }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle failure to update prompts
      return new Response(JSON.stringify({ error: "Failed to update prompts" }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
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
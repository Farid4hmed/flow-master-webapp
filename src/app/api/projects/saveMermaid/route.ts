export async function POST(request: Request) {
  try {
    const { projectId, mermaid } = await request.json();

    // Check for required fields
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

    // Make a PUT request to the external API to save the Mermaid diagram
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/saveMermaid', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        mermaid,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200) {
      // Return success response if the Mermaid diagram is successfully updated
      return new Response(JSON.stringify({ message: data.body }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle failure response
      return new Response(JSON.stringify({ error: "Failed to update Mermaid" }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error updating mermaid:", error);
    return new Response(JSON.stringify({ error: "Failed to update Mermaid" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
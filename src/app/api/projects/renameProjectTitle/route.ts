export async function PATCH(request: Request) {
  try {
    const { projectId, userId, newTitle } = await request.json();

    // Check for required fields
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

    // Make a PUT request to the external API to rename the project
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/renameProject', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        userId,
        newTitle,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200) {
      // If successful, return the response from the external API
      return new Response(JSON.stringify({ message: data.body }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (apiResponse.status === 404) {
      // Handle project not found
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Handle other errors
      return new Response(
        JSON.stringify({ error: "Failed to rename project" }),
        {
          status: apiResponse.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
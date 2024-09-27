export async function DELETE(request: Request) {
  try {
    const { projectId, userId } = await request.json();

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

    // Make a DELETE request to the external API
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/deleteProject', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        userId,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200) {
      // Return success response when the project is deleted
      return new Response(JSON.stringify({ message: data.body }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (apiResponse.status === 404) {
      // Handle project not found or permission denied
      return new Response(JSON.stringify({ error: "Project not found or user does not have permission" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle other API response errors
      return new Response(JSON.stringify({ error: "Failed to delete project" }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
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
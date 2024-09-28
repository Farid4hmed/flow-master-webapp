export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Make a POST request to the external API to fetch projects
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/api/projects/getAllProjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200) {
      data.body.projects.forEach((project: any) => {
        project.prompts = JSON.parse(project.prompts);
      });
      // Return the projects from the API response
      return new Response(JSON.stringify({ projects: data.body.projects }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
        status: apiResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
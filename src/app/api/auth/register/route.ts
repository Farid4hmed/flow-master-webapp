import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();


    // Make an API call to the Postman API for registration
    const apiResponse = await fetch('https://fab-team-services.xyz:8089/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name: "User", birthday: "1990-01-01T00:00:00" }),
    });

    const data = await apiResponse.json();

    if (apiResponse.status === 200 && data.body === "Registered") {
      return new Response(
        JSON.stringify({ message: "Registration successful" }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Registration failed" }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.log("Error during registration:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
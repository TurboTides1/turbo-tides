/**
 * One-time script to get Google OAuth refresh tokens.
 * Run once for each instructor's Google account.
 *
 * Usage: node scripts/get-refresh-token.mjs
 */

import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars first.");
  process.exit(1);
}
const REDIRECT_URI = "http://localhost:3001/callback";
const SCOPES = "https://www.googleapis.com/auth/calendar";

// Step 1: Build the authorization URL
const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

console.log("\n=== Google Calendar OAuth Setup ===\n");
console.log("Open this URL in your browser:\n");
console.log(authUrl.toString());
console.log("\nSign in with the instructor's Google account (Kayla or Jack).");
console.log("Waiting for callback...\n");

// Step 2: Start a local server to catch the callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3001`);

  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h1>Error: ${error}</h1><p>You can close this tab.</p>`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>No code received</h1>");
    return;
  }

  // Step 3: Exchange code for tokens
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      console.error("Token error:", tokens);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h1>Error</h1><pre>${JSON.stringify(tokens, null, 2)}</pre>`);
      server.close();
      process.exit(1);
    }

    console.log("=== SUCCESS ===\n");
    console.log("Refresh Token:\n");
    console.log(tokens.refresh_token);
    console.log(
      "\nCopy this refresh token — you'll need it for the .env.local file.\n"
    );

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<h1 style="color: green;">Success!</h1>
       <p>Refresh token has been printed in your terminal.</p>
       <p>You can close this tab.</p>`
    );
  } catch (err) {
    console.error("Fetch error:", err);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>Error exchanging code</h1><pre>${err}</pre>`);
  }

  server.close();
});

server.listen(3001, () => {
  console.log("Listening on http://localhost:3001 for OAuth callback...");
});

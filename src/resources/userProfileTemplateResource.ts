import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register user profile template resource
 * @param server MCP server instance
 */
export function registerUserProfileTemplateResource(server: McpServer) {
  server.resource(
    "user-profile",
    new ResourceTemplate("resource://users/{user_id}/profile", { list: undefined }),
    async (uri, { user_id }) => ({
      contents: [{
        uri: uri.href,
        text: `
# User Profile - ${user_id}

## Basic Information
- User ID: ${user_id}
- Registration Date: 2023-01-01
- Activity Level: High

## Recent Activities
- Last Login: 2023-05-15
- Number of Transactions: 42
- Risk Score: Low
`,
        mime: "text/markdown"
      }]
    })
  );
} 
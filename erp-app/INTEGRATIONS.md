# Integration Architecture - Hardware ERP

## Overview

This document outlines the integration architecture for third-party APIs (GitHub, Figma, Octopart, Digi-Key, etc.). All external API calls go through **Supabase Edge Functions** to keep secrets secure and provide a modular integration layer.

## Architecture Diagram

```
Frontend (React)
    ↓
    ├→ Supabase Auth & Database (user data, RLS)
    └→ Supabase Edge Functions (API gateway)
        ├→ GitHub API
        ├→ Figma API
        ├→ Octopart API
        ├→ Digi-Key API
        └→ Other suppliers
```

## Benefits

- **Security**: API keys never exposed in frontend
- **Modularity**: Easy to add/remove integrations
- **Rate Limiting**: Centralized control
- **Caching**: Reduce API calls
- **Error Handling**: Consistent error responses

## Supabase Edge Functions Setup

### 1. Create Function Directory

```bash
supabase functions new github-integration
supabase functions new figma-integration
supabase functions new supplier-quotes
```

### 2. Deploy Function

```bash
supabase functions deploy github-integration --no-verify-jwt
```

### 3. Call from Frontend

```typescript
const response = await supabase.functions.invoke('github-integration', {
  body: {
    action: 'get-repos',
    owner: 'acme',
  },
});
```

## GitHub Integration

### Use Cases
- Link firmware repositories
- Track issues and pull requests
- Display release information
- Show commit history

### Edge Function Template

Create `supabase/functions/github-integration/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
const GITHUB_API_BASE = "https://api.github.com";

serve(async (req) => {
  const { action, owner, repo, issue_number } = await req.json();

  try {
    switch (action) {
      case "get-repos":
        return await getRepositories(owner);
      case "get-issues":
        return await getIssues(owner, repo);
      case "get-releases":
        return await getReleases(owner, repo);
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});

async function getRepositories(owner: string) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${owner}/repos`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  const repos = await response.json();
  return new Response(JSON.stringify(repos));
}

async function getIssues(owner: string, repo: string) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  const issues = await response.json();
  return new Response(JSON.stringify(issues));
}

async function getReleases(owner: string, repo: string) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  const releases = await response.json();
  return new Response(JSON.stringify(releases));
}
```

### Frontend Service

Create `src/services/github.ts`:

```typescript
import { supabase } from "./supabase";

export const githubService = {
  async getRepositories(owner: string) {
    const { data, error } = await supabase.functions.invoke(
      "github-integration",
      {
        body: { action: "get-repos", owner },
      }
    );
    if (error) throw error;
    return data;
  },

  async getIssues(owner: string, repo: string) {
    const { data, error } = await supabase.functions.invoke(
      "github-integration",
      {
        body: { action: "get-issues", owner, repo },
      }
    );
    if (error) throw error;
    return data;
  },

  async getReleases(owner: string, repo: string) {
    const { data, error } = await supabase.functions.invoke(
      "github-integration",
      {
        body: { action: "get-releases", owner, repo },
      }
    );
    if (error) throw error;
    return data;
  },
};
```

## Figma Integration

### Use Cases
- Embed design files
- Link design reviews
- Track design status
- Display thumbnails

### Edge Function

```typescript
// supabase/functions/figma-integration/index.ts

const FIGMA_TOKEN = Deno.env.get("FIGMA_TOKEN");
const FIGMA_API_BASE = "https://api.figma.com/v1";

export async function getFigmaFile(fileId: string) {
  const response = await fetch(
    `${FIGMA_API_BASE}/files/${fileId}`,
    {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    }
  );
  return response.json();
}

export async function getFigmaComponents(fileId: string) {
  const response = await fetch(
    `${FIGMA_API_BASE}/files/${fileId}/components`,
    {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    }
  );
  return response.json();
}
```

## Supplier Quote Integration

### Octopart API

```typescript
// supabase/functions/supplier-quotes/index.ts

const OCTOPART_API_KEY = Deno.env.get("OCTOPART_API_KEY");

async function searchParts(query: string) {
  const response = await fetch(
    `https://api.octopart.com/v4/partsearch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OCTOPART_API_KEY}`,
      },
      body: JSON.stringify({
        q: query,
        limit: 10,
      }),
    }
  );
  return response.json();
}

async function getPartPricing(partId: string) {
  const response = await fetch(
    `https://api.octopart.com/v4/parts/${partId}/pricing`,
    {
      headers: {
        Authorization: `Bearer ${OCTOPART_API_KEY}`,
      },
    }
  );
  return response.json();
}
```

### Digi-Key API

```typescript
// Similar structure for Digi-Key REST API
// https://developer.digikey.com/documentation
```

## Storage of Integration Secrets

### Supabase Edge Function Secrets

```bash
# Add secrets to Supabase
supabase secrets set GITHUB_TOKEN="ghp_xxxxx"
supabase secrets set FIGMA_TOKEN="figi_xxxxx"
supabase secrets set OCTOPART_API_KEY="xxxxx"
```

### Environment Variables

```bash
# In Supabase project: Settings > Environment Variables
GITHUB_TOKEN=your-token
FIGMA_TOKEN=your-token
OCTOPART_API_KEY=your-key
```

## Integration Data Storage

### Database Tables for Integration

```sql
-- GitHub Links (already in schema)
CREATE TABLE github_links (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  entity_type TEXT,
  entity_id UUID,
  github_url TEXT,
  repo_owner TEXT,
  repo_name TEXT,
  issue_number INT,
  pr_number INT,
  created_at TIMESTAMPTZ
);

-- Figma Files (already in schema)
CREATE TABLE design_files (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  figma_file_id TEXT,
  figma_url TEXT,
  file_name TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
);

-- Cache supplier quotes
CREATE TABLE supplier_quote_cache (
  id UUID PRIMARY KEY,
  manufacturer_part_number TEXT,
  supplier_name TEXT,
  quote_data JSONB,
  cached_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
```

## Caching Strategy

### Redis-like Caching in Supabase

Use Supabase Storage or a caching table:

```typescript
// Cache supplier quotes for 24 hours
async function getQuotesCached(mpn: string) {
  const cached = await supabase
    .from('supplier_quote_cache')
    .select('*')
    .eq('manufacturer_part_number', mpn)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached.data) {
    return cached.data.quote_data;
  }

  // Fetch fresh
  const quotes = await fetchQuotesFromSuppliers(mpn);
  
  // Cache for 24 hours
  await supabase
    .from('supplier_quote_cache')
    .insert([{
      manufacturer_part_number: mpn,
      quote_data: quotes,
      cached_at: new Date(),
      expires_at: new Date(Date.now() + 24*60*60*1000),
    }]);

  return quotes;
}
```

## Error Handling

### Standardized Response Format

```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: "Description of error",
  code: "ERROR_CODE",
  details: { ... }
}
```

### Frontend Error Handler

```typescript
async function callIntegration(action: string, payload: any) {
  try {
    const { data, error } = await supabase.functions.invoke(
      'integration-name',
      { body: { action, ...payload } }
    );

    if (error || !data.success) {
      throw new Error(data.error || error.message);
    }

    return data.data;
  } catch (err) {
    console.error(`Integration error: ${err.message}`);
    // Show user-friendly error
    throw new Error('Failed to fetch data from external service');
  }
}
```

## Rate Limiting

### Implement in Edge Function

```typescript
import { RateLimiter } from "https://deno.land/x/alosaur@v0.36.0/mod.ts";

const limiter = new RateLimiter(100, 60000); // 100 requests per minute

serve(async (req) => {
  const clientId = req.headers.get('x-user-id');
  
  if (!limiter.isAllowed(clientId)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
    });
  }

  // Process request
});
```

## Testing Integrations

### Unit Test Example

```typescript
import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";

Deno.test("GitHub integration - fetch repos", async () => {
  const repos = await getRepositories('octocat');
  assertEquals(Array.isArray(repos), true);
});
```

### Integration Test

```typescript
// Test with real API (use test account)
test('Octopart: search parts', async () => {
  const results = await searchParts('STM32F407');
  expect(results.length).toBeGreaterThan(0);
});
```

## Monitoring & Logging

### Log Integration Calls

```typescript
// In Edge Function
console.log(`[GitHub] Fetching repos for ${owner}`);
console.time(`github-repos-${owner}`);

const repos = await getRepositories(owner);

console.timeEnd(`github-repos-${owner}`);
console.log(`[GitHub] Retrieved ${repos.length} repos`);
```

### Sentry Integration (Optional)

```typescript
import * as Sentry from "https://cdn.jsdelivr.net/npm/@sentry/browser@7/+esm";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN"),
});

serve(async (req) => {
  try {
    // Process request
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
});
```

## Roadmap

### Phase 1 (Current)
- GitHub integration scaffolding
- Figma link support
- Manual supplier quote entry

### Phase 2
- GitHub issues/PRs sync
- Figma design review automation
- Octopart API integration

### Phase 3
- Digi-Key catalog search
- Arrow Electronics pricing
- Automated quote comparison

### Phase 4
- Lead time risk alerts
- Supplier performance tracking
- Bulk PO generation

## Security Considerations

1. **Never expose API keys**: All calls go through Edge Functions
2. **Validate inputs**: Check user input before API calls
3. **Rate limits**: Implement on both Edge Function and API side
4. **Error messages**: Don't leak sensitive info in errors
5. **Audit logs**: Log all integration API calls
6. **Token rotation**: Regularly rotate API keys
7. **Least privilege**: Use read-only keys where possible

## References

- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- GitHub API: https://docs.github.com/en/rest
- Figma API: https://www.figma.com/developers/api
- Octopart API: https://octopart.com/api/
- Digi-Key API: https://developer.digikey.com/

---

**Integration Framework**: Ready for Phase 2  
**Security Level**: High (secrets in Edge Functions only)  
**Extensibility**: Modular, new integrations can be added easily

#!/usr/bin/env ts-node

import { writeFileSync } from "fs";
import { join } from "path";
import { generateOpenAPIDocument } from "../config/openapi";

// Import schemas to ensure they're registered
import "../schemas/auth.schema";
import "../schemas/todos.schema";

function generateOpenAPISpec() {
  try {
    console.log("🔄 Generating OpenAPI specification...");

    const openApiDocument = generateOpenAPIDocument();
    const outputPath = join(__dirname, "../../openapi.json");

    writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));

    console.log("✅ OpenAPI specification generated successfully!");
    console.log(`📄 File saved to: ${outputPath}`);
    console.log(
      `📊 Generated ${
        Object.keys(openApiDocument.paths || {}).length
      } API endpoints`
    );
    console.log(
      `🏷️  Defined ${
        Object.keys(openApiDocument.components?.schemas || {}).length
      } schemas`
    );
  } catch (error) {
    console.error("❌ Error generating OpenAPI specification:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  generateOpenAPISpec();
}

export { generateOpenAPISpec };

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import QRCode from "qrcode";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
  name: "qrcode-generator",
  version: "1.0.0"
});

// Schema for QR code generation options
const QRCodeOptionsSchema = z.object({
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
  width: z.number().min(50).max(2000).optional(),
  margin: z.number().min(0).max(10).optional().default(4),
  color: z.object({
    dark: z.string().optional().default('#000000'),
    light: z.string().optional().default('#FFFFFF')
  }).optional(),
  type: z.enum(['image/png', 'image/jpeg', 'image/webp']).optional().default('image/png')
});

// Tool for generating QR code as data URL (base64)
server.registerTool(
  "generate-qrcode-dataurl",
  {
    title: "Generate QR Code as Data URL",
    description: "Generate a QR code from text or URL and return it as a base64 data URL",
    inputSchema: {
      text: z.string().min(1).describe("The text or URL to encode in the QR code"),
      options: QRCodeOptionsSchema.optional().describe("QR code generation options")
    }
  },
  async ({ text, options = {} }) => {
    try {
      const qrOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        width: options.width,
        margin: options.margin || 4,
        color: {
          dark: options.color?.dark || '#000000',
          light: options.color?.light || '#FFFFFF'
        }
      };

      const dataUrl = await QRCode.toDataURL(text, qrOptions);
      
      return {
        content: [
          {
            type: "text",
            text: `QR code generated successfully for: "${text}"`
          },
          {
            type: "image",
            data: dataUrl,
            mimeType: options.type || "image/png"
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
);

// Tool for generating QR code as SVG
server.registerTool(
  "generate-qrcode-svg",
  {
    title: "Generate QR Code as SVG",
    description: "Generate a QR code from text or URL and return it as SVG format",
    inputSchema: {
      text: z.string().min(1).describe("The text or URL to encode in the QR code"),
      options: z.object({
        errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
        width: z.number().min(50).max(2000).optional(),
        margin: z.number().min(0).max(10).optional().default(4),
        color: z.object({
          dark: z.string().optional().default('#000000'),
          light: z.string().optional().default('#FFFFFF')
        }).optional()
      }).optional().describe("QR code generation options")
    }
  },
  async ({ text, options = {} }) => {
    try {
      const qrOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        width: options.width,
        margin: options.margin || 4,
        color: {
          dark: options.color?.dark || '#000000',
          light: options.color?.light || '#FFFFFF'
        }
      };

      const svgString = await QRCode.toString(text, { 
        ...qrOptions,
        type: 'svg' 
      });
      
      return {
        content: [
          {
            type: "text",
            text: `QR code SVG generated successfully for: "${text}"\n\n${svgString}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating QR code SVG: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
);

// Tool for generating QR code as terminal output
server.registerTool(
  "generate-qrcode-terminal",
  {
    title: "Generate QR Code for Terminal",
    description: "Generate a QR code from text or URL and display it in terminal format",
    inputSchema: {
      text: z.string().min(1).describe("The text or URL to encode in the QR code"),
      options: z.object({
        small: z.boolean().optional().default(false).describe("Use small format for terminal display")
      }).optional().describe("Terminal display options")
    }
  },
  async ({ text, options = {} }) => {
    try {
      const terminalQR = await QRCode.toString(text, { 
        type: 'terminal',
        small: options.small || false
      });
      
      return {
        content: [
          {
            type: "text",
            text: `QR code for: "${text}"\n\n${terminalQR}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating terminal QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
);

// Tool for batch QR code generation
server.registerTool(
  "generate-qrcode-batch",
  {
    title: "Generate Multiple QR Codes",
    description: "Generate multiple QR codes from an array of texts or URLs",
    inputSchema: {
      texts: z.array(z.string().min(1)).min(1).max(10).describe("Array of texts or URLs to encode (max 10)"),
      format: z.enum(['dataurl', 'svg', 'terminal']).optional().default('dataurl').describe("Output format for QR codes"),
      options: QRCodeOptionsSchema.optional().describe("QR code generation options")
    }
  },
  async ({ texts, format = 'dataurl', options = {} }) => {
    try {
      const results = [];
      
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        
        try {
          let qrResult;
          
          if (format === 'dataurl') {
            const qrOptions = {
              errorCorrectionLevel: options.errorCorrectionLevel || 'M',
              width: options.width,
              margin: options.margin || 4,
              color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#FFFFFF'
              }
            };
            qrResult = await QRCode.toDataURL(text, qrOptions);
          } else if (format === 'svg') {
            qrResult = await QRCode.toString(text, { type: 'svg' });
          } else if (format === 'terminal') {
            qrResult = await QRCode.toString(text, { type: 'terminal' });
          }
          
          results.push({
            text,
            success: true,
            result: qrResult || ''
          });
        } catch (error) {
          results.push({
            text,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const content: Array<{
        type: "text";
        text: string;
      } | {
        type: "image";
        data: string;
        mimeType: string;
      }> = [
        {
          type: "text",
          text: `Batch QR code generation completed: ${successCount}/${texts.length} successful\n\n`
        }
      ];
      
      // Add results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.success && result.result) {
          content.push({
            type: "text",
            text: `${i + 1}. QR code for "${result.text}":`
          });
          
          if (format === 'dataurl') {
            content.push({
              type: "image",
              data: result.result,
              mimeType: options.type || "image/png"
            });
          } else {
            content.push({
              type: "text",
              text: result.result
            });
          }
        } else {
          content.push({
            type: "text",
            text: `${i + 1}. Error for "${result.text}": ${result.error || 'Unknown error'}`
          });
        }
        content.push({ type: "text", text: "\n" });
      }
      
      return { content };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error in batch QR code generation: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("QR Code MCP Server is running...");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
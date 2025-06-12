import express from "express";
import cors from "cors";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const app = express();
const PORT = 3000;

// Allow CORS (important for frontend calls)
app.use(cors());

const api = "";
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Function to call the model
async function generateTweetContent() {
  const client = ModelClient(endpoint, new AzureKeyCredential(api));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        {
          role: "system",
          content:
            "You are a social media expert and content creator specializing in generating engaging and informative tweets on trending and informative topics. Your tweets should be concise, attention-grabbing, and tailored for maximum engagement on Twitter.",
        },
        {
          role: "user",
          content: "Create a tweet on trending topic on X",
        },
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// API endpoint
app.get("/api/tweet", async (req, res) => {
  try {
    const tweet = await generateTweetContent();
    res.send(tweet);
  } catch (error) {
    console.error("Error generating tweet:", error);
    res.status(500).send("Error generating tweet");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-trancription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";
// import { fastifyCors } from "@fastify/cors";

const app = fastify();
const PORT = 3333;

// app.register(fastifyCors, {
//   origin: "*",
// });

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`Server running in port ${PORT}!`));

import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { openai } from "../lib/openai";
import { createReadStream } from "fs";

export const createTranscriptionRoute = async (app: FastifyInstance) => {
  app.post("/video/:videoId/transcription", async (request, reply) => {
    const videoIdSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = videoIdSchema.parse(request.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;
    const audioReadSteam = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
      file: audioReadSteam,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });

    const transcription = response.text;

    await prisma.video.update({
      where: {
        id: videoId,
      },

      data: {
        transcription: transcription,
      },
    });

    return { transcription };
  });
};

'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating concise summaries of learning module content.
 *
 * - summarizeLearningModule - A function that generates a summary for a given learning module.
 * - LearningModuleContent - The input type for the summarizeLearningModule function.
 * - LearningModuleSummary - The return type for the summarizeLearningModule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningModuleContentSchema = z
  .string()
  .describe('The content of the learning module to be summarized.');
export type LearningModuleContent = z.infer<typeof LearningModuleContentSchema>;

const LearningModuleSummarySchema = z.object({
  summary: z
    .string()
    .describe('The AI-generated concise summary of the learning module.'),
});
export type LearningModuleSummary = z.infer<typeof LearningModuleSummarySchema>;

const summarizeModulePrompt = ai.definePrompt({
  name: 'summarizeModulePrompt',
  input: {schema: LearningModuleContentSchema},
  output: {schema: LearningModuleSummarySchema},
  prompt: `You are an expert educational assistant. Your task is to summarize the provided learning module content concisely and clearly.

Learning Module Content:
---
{{{input}}}
---

Please provide a summary that captures the core concepts and key takeaways of the learning module. The summary should be easy to understand and reinforce the main points.`,
});

const aiModuleSummariesFlow = ai.defineFlow(
  {
    name: 'aiModuleSummariesFlow',
    inputSchema: LearningModuleContentSchema,
    outputSchema: LearningModuleSummarySchema,
  },
  async input => {
    const {output} = await summarizeModulePrompt(input);
    return output!;
  }
);

export async function summarizeLearningModule(
  content: LearningModuleContent
): Promise<LearningModuleSummary> {
  return aiModuleSummariesFlow(content);
}

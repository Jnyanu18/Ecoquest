'use server';
/**
 * @fileOverview A Genkit flow for generating personalized eco-friendly tips for students.
 *
 * - getPersonalizedEcoTips - A function that handles the generation of personalized eco-tips.
 * - PersonalizedEcoTipsInput - The input type for the getPersonalizedEcoTips function.
 * - PersonalizedEcoTipsOutput - The return type for the getPersonalizedEcoTips function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedEcoTipsInputSchema = z.object({
  learningProgressSummary: z
    .string()
    .describe(
      "A concise summary of the student's learning progress, including topics completed and average quiz scores."
    ),
  completedTasksSummary: z
    .array(z.string())
    .describe(
      'A list of brief descriptions for eco-tasks the student has successfully completed.'
    ),
});
export type PersonalizedEcoTipsInput = z.infer<
  typeof PersonalizedEcoTipsInputSchema
>;

const PersonalizedEcoTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe(
      'A list of personalized eco-friendly tips, each tailored to the student.'
    ),
});
export type PersonalizedEcoTipsOutput = z.infer<
  typeof PersonalizedEcoTipsOutputSchema
>;

export async function getPersonalizedEcoTips(
  input: PersonalizedEcoTipsInput
): Promise<PersonalizedEcoTipsOutput> {
  return personalizedEcoTipsFlow(input);
}

const personalizedEcoTipsPrompt = ai.definePrompt({
  name: 'personalizedEcoTipsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: PersonalizedEcoTipsInputSchema },
  output: { schema: PersonalizedEcoTipsOutputSchema },
  prompt: `You are an AI assistant specialized in providing personalized eco-friendly tips to students.

Based on the following learning progress and completed eco-tasks, suggest new, actionable, and personalized eco-friendly tips to help the student further contribute to environmental sustainability.
Focus on areas where they can expand their knowledge or take new actions, avoiding suggestions that are too similar to their completed tasks.

Learning Progress: {{{learningProgressSummary}}}

Completed Tasks:
{{#each completedTasksSummary}}
- {{{this}}}
{{/each}}

Please provide 3-5 distinct, concise tips.`,
});

const personalizedEcoTipsFlow = ai.defineFlow(
  {
    name: 'personalizedEcoTipsFlow',
    inputSchema: PersonalizedEcoTipsInputSchema,
    outputSchema: PersonalizedEcoTipsOutputSchema,
  },
  async (input) => {
    const { output } = await personalizedEcoTipsPrompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview A Genkit flow that generates AI-powered insights into student performance.
 *
 * - aiPerformanceInsights - A function that generates performance insights for a student.
 * - AiPerformanceInsightsInput - The input type for the aiPerformanceInsights function.
 * - AiPerformanceInsightsOutput - The return type for the aiPerformanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPerformanceInsightsInputSchema = z.object({
  studentName: z.string().describe('The name of the student for whom insights are requested.'),
  performanceSummary: z
    .string()
    .describe(
      'A summary of the student\'s performance, including quiz scores, task completion rates, and learning module progress. This should be a descriptive text.'
    ),
});
export type AiPerformanceInsightsInput = z.infer<typeof AiPerformanceInsightsInputSchema>;

const AiPerformanceInsightsOutputSchema = z.object({
  strengths: z.string().describe('Key strengths identified in the student\'s performance.'),
  areasForImprovement: z
    .string()
    .describe('Specific areas where the student needs improvement, with actionable suggestions.'),
  overallSummary: z.string().describe('An overall summary of the student\'s performance and potential.'),
});
export type AiPerformanceInsightsOutput = z.infer<typeof AiPerformanceInsightsOutputSchema>;

export async function aiPerformanceInsights(
  input: AiPerformanceInsightsInput
): Promise<AiPerformanceInsightsOutput> {
  return aiPerformanceInsightsFlow(input);
}

const aiPerformanceInsightsPrompt = ai.definePrompt({
  name: 'aiPerformanceInsightsPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: AiPerformanceInsightsInputSchema},
  output: {schema: AiPerformanceInsightsOutputSchema},
  prompt: `You are an AI-powered educational assistant designed to help teachers understand student performance. Analyze the provided student performance summary and identify their key strengths and areas needing improvement. Provide actionable suggestions for improvement. The output should be concise and directly address the strengths, areas for improvement, and overall summary based on the given data.

Student Name: {{{studentName}}}

Performance Data:
{{{performanceSummary}}}`,
});

const aiPerformanceInsightsFlow = ai.defineFlow(
  {
    name: 'aiPerformanceInsightsFlow',
    inputSchema: AiPerformanceInsightsInputSchema,
    outputSchema: AiPerformanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await aiPerformanceInsightsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate student performance insights.');
    }
    return output;
  }
);

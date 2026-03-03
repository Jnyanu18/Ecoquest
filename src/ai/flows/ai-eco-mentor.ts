
'use server';
/**
 * @fileOverview AI Eco Mentor flow using Gemini 2.0 Flash.
 * Analyzes carbon footprint and activity to provide personalized sustainability advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EcoMentorInputSchema = z.object({
  studentName: z.string(),
  monthlyCO2: z.number().describe('Total CO2 produced this month in kg'),
  recentActivities: z.array(z.string()),
  dietType: z.string(),
  travelMode: z.string()
});

const EcoMentorOutputSchema = z.object({
  personalizedTips: z.array(z.string()).describe('3 actionable tips for the student'),
  motivationMessage: z.string().describe('A motivating summary'),
  improvementArea: z.string().describe('The primary area where the student can reduce footprint'),
  benchmarkComparison: z.string().describe('How they compare to national averages (approx 150kg/month)')
});

export async function getEcoMentorAdvice(input: z.infer<typeof EcoMentorInputSchema>) {
  return aiEcoMentorFlow(input);
}

const mentorPrompt = ai.definePrompt({
  name: 'ecoMentorPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: EcoMentorInputSchema },
  output: { schema: EcoMentorOutputSchema },
  prompt: `You are the AI Eco Mentor for EcoQuest. Your goal is to guide students towards a lower carbon footprint.

Analyze the student data:
- Name: {{{studentName}}}
- Monthly CO2: {{{monthlyCO2}}} kg
- Recent Tasks: {{#each recentActivities}}- {{{this}}} {{/each}}
- Diet: {{{dietType}}}
- Primary Travel: {{{travelMode}}}

Context: The Indian national average for a student footprint is roughly 150kg/month. 
Provide a high-quality, professional, and encouraging analysis. Focus on measurable reduction.`
});

const aiEcoMentorFlow = ai.defineFlow(
  {
    name: 'aiEcoMentorFlow',
    inputSchema: EcoMentorInputSchema,
    outputSchema: EcoMentorOutputSchema,
  },
  async (input) => {
    const { output } = await mentorPrompt(input);
    return output!;
  }
);

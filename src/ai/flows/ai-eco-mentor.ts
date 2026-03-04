
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
  recentActivities: z.array(z.string()).describe('Descriptions of verified eco-tasks completed recently'),
  dietType: z.string(),
  travelMode: z.string()
});

const EcoMentorOutputSchema = z.object({
  personalizedTips: z.array(z.string()).describe('3-5 actionable, high-impact tips tailored to their current data'),
  motivationMessage: z.string().describe('A motivating, visionary summary for the student'),
  improvementArea: z.string().describe('The single largest contributor to their footprint and how to tackle it'),
  benchmarkComparison: z.string().describe('Contextual comparison with the 150kg/month national average')
});

export async function getEcoMentorAdvice(input: z.infer<typeof EcoMentorInputSchema>) {
  return aiEcoMentorFlow(input);
}

const mentorPrompt = ai.definePrompt({
  name: 'ecoMentorPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: EcoMentorInputSchema },
  output: { schema: EcoMentorOutputSchema },
  prompt: `You are the Expert AI Eco Mentor for the EcoQuest Platform. 
Your goal is to guide students towards a lower carbon footprint using competency-based advice.

Analyze the student data provided:
- Name: {{{studentName}}}
- Monthly CO2: {{{monthlyCO2}}} kg
- Recent Verified Tasks: {{#each recentActivities}}- {{{this}}} {{/each}}
- Diet: {{{dietType}}}
- Primary Travel: {{{travelMode}}}

Context:
The Indian national student average is 150kg CO2/month. 
If they are above, be firm but encouraging. 
If they are below, celebrate them as an 'Eco-Champion' but suggest 'Mastery' levels.

Structure your response to be professional, scientific yet accessible, and deeply personalized to the travel and diet data provided.`
});

const aiEcoMentorFlow = ai.defineFlow(
  {
    name: 'aiEcoMentorFlow',
    inputSchema: EcoMentorInputSchema,
    outputSchema: EcoMentorOutputSchema,
  },
  async (input) => {
    const { output } = await mentorPrompt(input);
    if (!output) throw new Error("AI failed to generate advice");
    return output;
  }
);

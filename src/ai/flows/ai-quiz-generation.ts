'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating interactive quizzes
 * from learning module content or a given topic. It defines the input and output schemas
 * for quiz generation and provides an exported function to trigger the quiz generation process.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - QuizGenerationInput - The input type for the generateQuiz function.
 * - QuizGenerationOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizGenerationInputSchema = z.object({
  learningContent: z.string().describe("The learning module content or topic from which to generate the quiz."),
  numQuestions: z.number().int().min(1).default(5).describe("The desired number of quiz questions."),
  questionTypes: z.array(z.enum(['multiple-choice', 'true-false', 'fill-in-the-blank'])).optional().describe("Optional array of preferred question types."),
});
export type QuizGenerationInput = z.infer<typeof QuizGenerationInputSchema>;

const QuizQuestionSchema = z.object({
  questionText: z.string().describe("The text of the quiz question."),
  type: z.enum(['multiple-choice', 'true-false', 'fill-in-the-blank']).describe("The type of the question."),
  options: z.array(z.string()).optional().describe("An array of possible answer options for multiple-choice questions. Null or undefined for other types."),
  correctAnswer: z.string().describe("The correct answer for the question. For multiple-choice, this should match one of the options. For true-false, it should be 'True' or 'False'. For fill-in-the-blank, it should be the missing word(s)."),
  explanation: z.string().optional().describe("An optional explanation for the correct answer."),
});

const QuizGenerationOutputSchema = z.object({
  title: z.string().describe("The title of the generated quiz."),
  instructions: z.string().optional().describe("Optional instructions for taking the quiz."),
  questions: z.array(QuizQuestionSchema).min(1).describe("An array of quiz questions."),
});
export type QuizGenerationOutput = z.infer<typeof QuizGenerationOutputSchema>;

export async function generateQuiz(input: QuizGenerationInput): Promise<QuizGenerationOutput> {
  return quizGenerationFlow(input);
}

const quizGenerationPrompt = ai.definePrompt({
  name: 'quizGenerationPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: QuizGenerationInputSchema},
  output: {schema: QuizGenerationOutputSchema},
  prompt: `You are an expert educator and quiz creator. Your task is to generate an interactive quiz based on the provided learning content or topic.

The quiz should be engaging and test the student's understanding of the key concepts.

Generate a quiz with exactly {{numQuestions}} questions.
{{#if questionTypes}}
Prioritize the following question types: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
Otherwise, use a mix of multiple-choice, true-false, and fill-in-the-blank questions.
{{/if}}

Ensure the correct answers are accurate and that explanations (if provided) are clear.

Learning Content/Topic:
{{{learningContent}}}

Output MUST be a JSON object conforming to the following schema:
title: The title of the quiz.
instructions: Optional instructions for the quiz.
questions: An array of question objects. Each question object must have:
  questionText: The text of the question.
  type: The type of the question ('multiple-choice', 'true-false', or 'fill-in-the-blank').
  options: (Only for 'multiple-choice' type) An array of 3-4 string options, one of which must be the correct answer.
  correctAnswer: The exact correct answer as a string. For true-false, this should be 'True' or 'False'. For fill-in-the-blank, it should be the missing word(s).
  explanation: (Optional) A brief explanation for the correct answer.`,
});

const quizGenerationFlow = ai.defineFlow(
  {
    name: 'quizGenerationFlow',
    inputSchema: QuizGenerationInputSchema,
    outputSchema: QuizGenerationOutputSchema,
  },
  async (input) => {
    const {output} = await quizGenerationPrompt(input);
    return output!;
  }
);

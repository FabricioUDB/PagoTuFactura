// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A flow to generate legally compliant invoices from structured data.
 *
 * - generateCompliantInvoice - A function that handles the invoice generation process.
 * - GenerateCompliantInvoiceInput - The input type for the generateCompliantInvoice function.
 * - GenerateCompliantInvoiceOutput - The return type for the generateCompliantInvoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompliantInvoiceInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  invoiceNumber: z.string().describe('The invoice number.'),
  items: z.array(
    z.object({
      description: z.string().describe('Description of the item.'),
      amount: z.number().describe('The amount for the item.'),
    })
  ).describe('A list of items in the invoice.'),
  totalAmount: z.number().describe('Total amount of the invoice.'),
  date: z.string().describe('The invoice date'),
  companyName: z.string().describe('The name of the company issuing the invoice'),
  companyAddress: z.string().describe('The address of the company'),
  companyContact: z.string().describe('Contact information of the company (phone, email)'),
  legalRequirements: z.string().describe('Any specific legal requirements for the invoice'),
});
export type GenerateCompliantInvoiceInput = z.infer<typeof GenerateCompliantInvoiceInputSchema>;

const GenerateCompliantInvoiceOutputSchema = z.object({
  compliantInvoice: z.string().describe('The legally compliant invoice text.'),
});
export type GenerateCompliantInvoiceOutput = z.infer<typeof GenerateCompliantInvoiceOutputSchema>;

export async function generateCompliantInvoice(input: GenerateCompliantInvoiceInput): Promise<GenerateCompliantInvoiceOutput> {
  return generateCompliantInvoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompliantInvoicePrompt',
  input: {schema: GenerateCompliantInvoiceInputSchema},
  output: {schema: GenerateCompliantInvoiceOutputSchema},
  prompt: `You are an expert legal assistant specializing in generating invoices that are legally compliant.

  You will generate an invoice using the provided information that is legally compliant.

  Customer Name: {{{customerName}}}
  Invoice Number: {{{invoiceNumber}}}
  Items: {{#each items}}{{{description}}}: {{{amount}}}\n{{/each}}
  Total Amount: {{{totalAmount}}}
  Date: {{{date}}}
  Company Name: {{{companyName}}}
  Company Address: {{{companyAddress}}}
  Company Contact: {{{companyContact}}}
  Legal Requirements: {{{legalRequirements}}}
  
  Ensure the invoice includes all necessary information and meets all legal requirements as specified in Legal Requirements.
  Return the invoice as a single string, ready to be displayed.
  `,
});

const generateCompliantInvoiceFlow = ai.defineFlow(
  {
    name: 'generateCompliantInvoiceFlow',
    inputSchema: GenerateCompliantInvoiceInputSchema,
    outputSchema: GenerateCompliantInvoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

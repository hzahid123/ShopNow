import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion'; // PrimeNG Accordion
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent {
  faqSections = [
    {
      title: 'Products',
      items: [
        { question: 'What materials are your products made of?', answer: 'Our products are made from high-quality, sustainable materials designed to last.' },
        { question: 'How do I care for my products?', answer: 'Please refer to the care label on the product or our product care guide online.' },
        { question: 'Do you offer customization or personalization options?', answer: 'Yes, many of our products can be personalized during checkout.' }
      ]
    },
    {
      title: 'Orders',
      items: [
        { question: 'How do I place an order?', answer: 'Simply browse our store, add items to your cart, and proceed to checkout.' },
        { question: 'Can I cancel or modify my order after it’s been placed?', answer: 'Orders can be modified within 1 hour after placement. Contact support for help.' },
        { question: 'How do I track my order?', answer: 'You can track your order via the link provided in your confirmation email.' }
      ]
    },
    {
      title: 'Shipping',
      items: [
        { question: 'What shipping options are available?', answer: 'We offer standard, express, and same-day delivery in select locations.' },
        { question: 'Do you ship internationally?', answer: 'Yes, we ship to most countries worldwide. Shipping rates apply.' },
        { question: 'What should I do if my package is delayed?', answer: 'Please contact our support team. We’ll assist in resolving any delays promptly.' }
      ]
    }
  ];
}

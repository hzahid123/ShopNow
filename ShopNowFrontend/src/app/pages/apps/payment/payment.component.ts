
import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

interface SavedCard {
  id: string;
  cardNumber: string;
  nameOnCard: string;
  month: string;
  year: string;
  cardType: string;
  isPrimary: boolean;
  lastFourDigits: string;
  maskedNumber: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    CommonModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  showAddCardForm = false;
  isEditMode = false;
  editingCardId: string | null = null;
  bonusBalance = 'PKR 0';
  
  savedCards: SavedCard[] = [];

  cardForm = {
    cardNumber: '',
    nameOnCard: '',
    month: '',
    year: '',
    cvv: '',
    cardType: 'secondary'
  };

  months = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, '0');
    return { value: m, label: m };
  });

  years = Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  paymentMethods = [
    { name: 'Visa', logo: 'credit_card' },
    { name: 'Mastercard', logo: 'credit_card' },
    { name: 'American Express', logo: 'credit_card' }
  ];

  securityFeatures = [
    'PCI DSS compliant',
    'All data is encrypted',
    'Card info never stored or sold'
  ];

  toggleAddCardForm() {
    this.showAddCardForm = true;
    this.isEditMode = false;
    this.editingCardId = null;
    // Set first card as primary by default
    this.cardForm.cardType = this.savedCards.length === 0 ? 'primary' : 'secondary';
  }

  closeModal() {
    this.showAddCardForm = false;
    this.isEditMode = false;
    this.editingCardId = null;
    // Reset form when closing
    this.cardForm = {
      cardNumber: '',
      nameOnCard: '',
      month: '',
      year: '',
      cvv: '',
      cardType: 'secondary'
    };
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    event.target.value = formattedValue;
    this.cardForm.cardNumber = formattedValue;
  }

  detectCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  }

  getCardTypeIcon(cardType: string): string {
    switch (cardType) {
      case 'visa': return 'credit_card';
      case 'mastercard': return 'credit_card';
      case 'amex': return 'credit_card';
      default: return 'credit_card';
    }
  }

  saveCard() {
    if (this.isFormValid()) {
      const cardType = this.detectCardType(this.cardForm.cardNumber);
      const lastFourDigits = this.cardForm.cardNumber.slice(-4);
      const maskedNumber = '**** **** **** ' + lastFourDigits;
      
      if (this.isEditMode && this.editingCardId) {
        // Update existing card
        const cardIndex = this.savedCards.findIndex(c => c.id === this.editingCardId);
        if (cardIndex !== -1) {
          this.savedCards[cardIndex] = {
            ...this.savedCards[cardIndex],
            cardNumber: this.cardForm.cardNumber,
            nameOnCard: this.cardForm.nameOnCard,
            month: this.cardForm.month,
            year: this.cardForm.year,
            cardType,
            lastFourDigits,
            maskedNumber,
            isPrimary: this.cardForm.cardType === 'primary'
          };
        }
      } else {
        // Add new card
        const newCard: SavedCard = {
          id: Date.now().toString(),
          cardNumber: this.cardForm.cardNumber,
          nameOnCard: this.cardForm.nameOnCard,
          month: this.cardForm.month,
          year: this.cardForm.year,
          cardType,
          isPrimary: this.cardForm.cardType === 'primary' || this.savedCards.length === 0,
          lastFourDigits,
          maskedNumber
        };
        
        this.savedCards.push(newCard);
      }
      
      // If setting as primary, make sure no other card is primary
      if (this.cardForm.cardType === 'primary') {
        this.savedCards.forEach(card => {
          if (card.id !== this.editingCardId) {
            card.isPrimary = false;
          }
        });
      }
      
      console.log('Cards updated:', this.savedCards);
      this.closeModal();
    }
  }

  setPrimary(card: SavedCard) {
    this.savedCards.forEach(c => c.isPrimary = false);
    card.isPrimary = true;
    console.log('Primary card set:', card);
  }

  editCard(card: SavedCard) {
    this.isEditMode = true;
    this.editingCardId = card.id;
    this.cardForm = {
      cardNumber: card.cardNumber,
      nameOnCard: card.nameOnCard,
      month: card.month,
      year: card.year,
      cvv: '',
      cardType: card.isPrimary ? 'primary' : 'secondary'
    };
    this.showAddCardForm = true;
  }

  deleteCard(card: SavedCard) {
    if (confirm('Are you sure you want to delete this card?')) {
      const index = this.savedCards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        this.savedCards.splice(index, 1);
        
        // If deleted card was primary and there are other cards, make the first one primary
        if (card.isPrimary && this.savedCards.length > 0) {
          this.savedCards[0].isPrimary = true;
        }
      }
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.cardForm.cardNumber &&
      this.cardForm.nameOnCard &&
      this.cardForm.month &&
      this.cardForm.year &&
      this.cardForm.cvv
    );
  }

  learnMore() {
    alert('Bonus info popup');
  }
}

bootstrapApplication(PaymentComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule)
  ]
});

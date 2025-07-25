import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[autoTab]'
})
export class AutoTabDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  private getInputs(): HTMLInputElement[] {
    const form = this.el.nativeElement.form;
    if (!form) return [];
    return Array.from(form.elements).filter(
      (el: any) => el.tagName === 'INPUT' && el.hasAttribute('autoTab')
    ) as HTMLInputElement[];
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const inputs = this.getInputs();
    const index = inputs.indexOf(input);

    // Allow only digits
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length === input.maxLength && index < inputs.length - 1) {
      inputs[index + 1].focus();
      inputs[index + 1].select();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    const inputs = this.getInputs();
    const index = inputs.indexOf(input);

    // Backspace on empty input → go back
    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      event.preventDefault();
      inputs[index - 1].focus();
      inputs[index - 1].select();
    }

    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isDigit = /^[0-9]$/.test(event.key);

    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputs[index - 1].focus();
      inputs[index - 1].select();
    }

    if (event.key === 'ArrowRight' && index < inputs.length - 1) {
      event.preventDefault();
      inputs[index + 1].focus();
      inputs[index + 1].select();
    }
  }

 @HostListener('paste', ['$event'])
onPaste(event: ClipboardEvent): void {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text') ?? '';

  const digits = pasteData.replace(/\D/g, '').split('').slice(0, 6); // only first 6 digits
  const inputs = this.getInputs();

  digits.forEach((digit, idx) => {
    if (idx < inputs.length) {
      inputs[idx].value = digit;
      const nativeInput = inputs[idx];
      const event = new Event('input', { bubbles: true }); // trigger ngModel
      nativeInput.dispatchEvent(event);
    }
  });

  // focus the next empty input
  const nextInput = inputs[digits.length];
  if (nextInput) {
    nextInput.focus();
    nextInput.select();
  }
}

  @HostListener('focus')
  onFocus(): void {
    this.el.nativeElement.select();
  }
}

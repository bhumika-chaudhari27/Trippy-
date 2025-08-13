import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking {
  // Class properties
  currentStep: number = 1;
  totalSteps: number = 5;
  selectedPackageData: any = null;
  formData: any = {};

  // Package data with Indian pricing
  packages = {
    basic: { 
      name: 'Essential Journey', 
      price: 75000, 
      originalPrice: 89000,
      features: ['Round-trip flights', '3-star hotel accommodation', 'Airport transfers', 'Basic travel insurance', 'Welcome kit'],
      badge: 'Popular Choice',
      discount: '16% OFF'
    },
    premium: { 
      name: 'Deluxe Experience', 
      price: 125000, 
      originalPrice: 149000,
      features: ['Premium economy flights', '4-star luxury hotel', 'All transfers included', 'Guided city tours', 'Comprehensive insurance', 'Daily breakfast', 'Local SIM card', '24/7 support'],
      badge: 'Best Value',
      discount: '16% OFF'
    },
    luxury: { 
      name: 'Royal Escape', 
      price: 199000, 
      originalPrice: 239000,
      features: ['Business class flights', '5-star luxury resort', 'Private chauffeur service', 'Personal tour guide', 'Premium travel insurance', 'All meals included', 'Spa treatments', 'VIP lounge access', 'Exclusive experiences'],
      badge: 'Ultimate Luxury',
      discount: '17% OFF'
    }
  };

  ngOnInit(): void {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.initializeForm();
      this.setupEventListeners();
      this.updateNavigationButtons();
    }, 100);
  }

  // Change number of travelers
  changeTravelers(change: number): void {
    console.log('changeTravelers called with:', change);
    
    const countElement = document.getElementById('travelerCount');
    const hiddenInput = document.getElementById('travelers') as HTMLInputElement;
    
    if (!countElement || !hiddenInput) {
      console.error('Traveler elements not found');
      return;
    }
    
    let currentCount = parseInt(countElement.textContent || '2');
    currentCount += change;
    
    // Keep count within bounds
    if (currentCount < 1) currentCount = 1;
    if (currentCount > 10) currentCount = 10;
    
    countElement.textContent = currentCount.toString();
    hiddenInput.value = currentCount.toString();
    
    // Update button states
    const decreaseBtn = document.getElementById('decreaseBtn') as HTMLButtonElement;
    const increaseBtn = document.getElementById('increaseBtn') as HTMLButtonElement;
    
    if (decreaseBtn) decreaseBtn.disabled = currentCount <= 1;
    if (increaseBtn) increaseBtn.disabled = currentCount >= 10;
    
    this.saveFormData();
    this.showNotification(`Updated to ${currentCount} traveler(s)`, 'success');
  }

  // Navigate to next step
  nextStep(): void {
    console.log('nextStep called, current step:', this.currentStep);
    
    if (this.validateCurrentStep()) {
      this.saveFormData();
      
      if (this.currentStep < this.totalSteps) {
        // Hide current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const currentStepIndicator = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        
        if (currentStepEl) currentStepEl.classList.remove('active');
        if (currentStepIndicator) {
          currentStepIndicator.classList.remove('active');
          currentStepIndicator.classList.add('completed');
        }
        
        // Show next step
        this.currentStep++;
        const nextStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const nextStepIndicator = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        
        if (nextStepEl) nextStepEl.classList.add('active');
        if (nextStepIndicator) nextStepIndicator.classList.add('active');
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Special handling for step 4 (review)
        if (this.currentStep === 4) {
          this.generateBookingSummary();
        }
        
        // Special handling for step 5 (confirmation)
        if (this.currentStep === 5) {
          this.processBooking();
        }
        
        this.showNotification(`Moved to step ${this.currentStep}`, 'success');
        
        // Scroll to top of form
        const bookingContainer = document.querySelector('.booking-container');
        if (bookingContainer) {
          bookingContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  // Navigate to previous step
  previousStep(): void {
    if (this.currentStep > 1) {
      // Hide current step
      const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      const currentStepIndicator = document.querySelector(`.step[data-step="${this.currentStep}"]`);
      
      if (currentStepEl) currentStepEl.classList.remove('active');
      if (currentStepIndicator) currentStepIndicator.classList.remove('active');
      
      // Show previous step
      this.currentStep--;
      const prevStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      const prevStepIndicator = document.querySelector(`.step[data-step="${this.currentStep}"]`);
      
      if (prevStepEl) prevStepEl.classList.add('active');
      if (prevStepIndicator) {
        prevStepIndicator.classList.add('active');
        prevStepIndicator.classList.remove('completed');
      }
      
      // Update navigation buttons
      this.updateNavigationButtons();
      
      this.showNotification(`Moved back to step ${this.currentStep}`, 'success');
    }
  }

  // Setup all event listeners
  setupEventListeners(): void {
    console.log('Setting up event listeners...');
    
    // Traveler counter buttons with null checks
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        console.log('Decrease button clicked');
        this.changeTravelers(-1);
      });
    } else {
      console.error('Decrease button not found');
    }
    
    if (increaseBtn) {
      increaseBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        console.log('Increase button clicked');
        this.changeTravelers(1);
      });
    } else {
      console.error('Increase button not found');
    }

    // Navigation buttons with null checks
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        console.log('Next button clicked');
        this.nextStep();
      });
    } else {
      console.error('Next button not found');
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        console.log('Previous button clicked');
        this.previousStep();
      });
    } else {
      console.error('Previous button not found');
    }

    // Package selection with null checks
    const basicPackage = document.getElementById('basicPackage');
    const premiumPackage = document.getElementById('premiumPackage');
    const luxuryPackage = document.getElementById('luxuryPackage');
    
    if (basicPackage) {
      basicPackage.addEventListener('click', () => {
        console.log('Basic package clicked');
        this.selectPackage('basic');
      });
    }
    
    if (premiumPackage) {
      premiumPackage.addEventListener('click', () => {
        console.log('Premium package clicked');
        this.selectPackage('premium');
      });
    }
    
    if (luxuryPackage) {
      luxuryPackage.addEventListener('click', () => {
        console.log('Luxury package clicked');
        this.selectPackage('luxury');
      });
    }

    // Destination dropdown
    const destination = document.getElementById('destination') as HTMLSelectElement;
    if (destination) {
      destination.addEventListener('change', () => {
        const customGroup = document.getElementById('customDestinationGroup');
        const customDestination = document.getElementById('customDestination') as HTMLInputElement;
        
        if (destination.value === 'custom') {
          if (customGroup) customGroup.style.display = 'block';
          if (customDestination) customDestination.required = true;
        } else {
          if (customGroup) customGroup.style.display = 'none';
          if (customDestination) customDestination.required = false;
        }
        this.saveFormData();
      });
    }

    // Auto-save for all inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.saveFormData());
      input.addEventListener('change', () => this.saveFormData());
    });
    
    console.log('Event listeners setup complete');
  }

  // Select package
  selectPackage(packageType: string): void {
    // Remove selection from all cards
    document.querySelectorAll('.package-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const packageCard = document.getElementById(packageType + 'Package');
    if (packageCard) packageCard.classList.add('selected');
    
    // Update selected package data
    this.selectedPackageData = (this.packages as any)[packageType];
    const selectedPackageInput = document.getElementById('selectedPackage') as HTMLInputElement;
    if (selectedPackageInput) selectedPackageInput.value = packageType;
    
    this.saveFormData();
    this.showNotification('Package selected: ' + this.selectedPackageData.name, 'success');
  }

  // Initialize form
  initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const departureDate = document.getElementById('departureDate') as HTMLInputElement;
    const returnDate = document.getElementById('returnDate') as HTMLInputElement;
    
    if (departureDate) departureDate.setAttribute('min', today);
    if (returnDate) returnDate.setAttribute('min', today);

    // Load saved data if available
    this.loadFormData();
  }

  // Update navigation button states
  updateNavigationButtons(): void {
    const prevBtn = document.getElementById('prevBtn') as HTMLElement;
    const nextBtn = document.getElementById('nextBtn') as HTMLElement;
    
    if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
    
    if (nextBtn) {
      if (this.currentStep === this.totalSteps) {
        nextBtn.style.display = 'none';
      } else if (this.currentStep === this.totalSteps - 1) {
        nextBtn.innerHTML = '<i class="fas fa-credit-card"></i> Complete Booking';
      } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        nextBtn.style.display = 'inline-flex';
      }
    }
  }

  // Validate current step
  validateCurrentStep(): boolean {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]') as NodeListOf<HTMLInputElement>;
    
    for (let field of requiredFields) {
      if (!field.value.trim()) {
        field.focus();
        this.showNotification('Please fill in all required fields', 'error');
        return false;
      }
    }
    
    // Step-specific validations
    if (this.currentStep === 1) {
      return this.validateStep1();
    } else if (this.currentStep === 2) {
      return this.validateStep2();
    } else if (this.currentStep === 3) {
      return this.validateStep3();
    } else if (this.currentStep === 4) {
      return this.validateStep4();
    }
    
    return true;
  }

  // Validate step 1
  validateStep1(): boolean {
    const destination = (document.getElementById('destination') as HTMLSelectElement)?.value;
    const customDestination = (document.getElementById('customDestination') as HTMLInputElement)?.value;
    const departureDate = new Date((document.getElementById('departureDate') as HTMLInputElement)?.value);
    const returnDate = new Date((document.getElementById('returnDate') as HTMLInputElement)?.value);
    
    if (destination === 'custom' && !customDestination?.trim()) {
      this.showNotification('Please enter a custom destination', 'error');
      return false;
    }
    
    if (returnDate <= departureDate) {
      this.showNotification('Return date must be after departure date', 'error');
      return false;
    }
    
    return true;
  }

  // Validate step 2
  validateStep2(): boolean {
    if (!this.selectedPackageData) {
      this.showNotification('Please select a package', 'error');
      return false;
    }
    return true;
  }

  // Validate step 3
  validateStep3(): boolean {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value;
    
    if (!this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return false;
    }
    
    if (!this.isValidPhone(phone)) {
      this.showNotification('Please enter a valid phone number', 'error');
      return false;
    }
    
    return true;
  }

  // Validate step 4
  validateStep4(): boolean {
    const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement)?.value.replace(/\s/g, '');
    const expiryDate = (document.getElementById('expiryDate') as HTMLInputElement)?.value;
    const cvv = (document.getElementById('cvv') as HTMLInputElement)?.value;
    const termsAccepted = (document.getElementById('termsAccepted') as HTMLInputElement)?.checked;
    
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      this.showNotification('Please enter a valid card number', 'error');
      return false;
    }
    
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      this.showNotification('Please enter expiry date in MM/YY format', 'error');
      return false;
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      this.showNotification('Please enter a valid CVV', 'error');
      return false;
    }
    
    if (!termsAccepted) {
      this.showNotification('Please accept the terms and conditions', 'error');
      return false;
    }
    
    return true;
  }

  // Generate booking summary
  generateBookingSummary(): void {
    const destinationEl = document.getElementById('destination') as HTMLSelectElement;
    const customDestinationEl = document.getElementById('customDestination') as HTMLInputElement;
    const departureDateEl = document.getElementById('departureDate') as HTMLInputElement;
    const returnDateEl = document.getElementById('returnDate') as HTMLInputElement;
    const travelersEl = document.getElementById('travelers') as HTMLInputElement;
    
    const destination = destinationEl?.value === 'custom' 
      ? customDestinationEl?.value 
      : destinationEl?.options[destinationEl.selectedIndex]?.text;
    
    const departureDate = departureDateEl ? new Date(departureDateEl.value).toLocaleDateString() : '';
    const returnDate = returnDateEl ? new Date(returnDateEl.value).toLocaleDateString() : '';
    const travelers = travelersEl?.value || '2';
    
    const basePrice = this.selectedPackageData?.price || 0;
    const totalPrice = basePrice * parseInt(travelers);
    const taxes = Math.round(totalPrice * 0.18); // 18% GST
    const finalTotal = totalPrice + taxes;
    
    const summaryHTML = `
      <div class="summary-item">
        <span><strong>Destination:</strong></span>
        <span>${destination}</span>
      </div>
      <div class="summary-item">
        <span><strong>Travel Dates:</strong></span>
        <span>${departureDate} - ${returnDate}</span>
      </div>
      <div class="summary-item">
        <span><strong>Package:</strong></span>
        <span>${this.selectedPackageData?.name}</span>
      </div>
      <div class="summary-item">
        <span><strong>Travelers:</strong></span>
        <span>${travelers} person(s)</span>
      </div>
      <div class="summary-item">
        <span><strong>Package Price:</strong></span>
        <span>₹${basePrice.toLocaleString('en-IN')} × ${travelers} = ₹${totalPrice.toLocaleString('en-IN')}</span>
      </div>
      <div class="summary-item">
        <span><strong>GST (18%):</strong></span>
        <span>₹${taxes.toLocaleString('en-IN')}</span>
      </div>
      <div class="summary-item total">
        <span><strong>Total Amount:</strong></span>
        <span><strong>₹${finalTotal.toLocaleString('en-IN')}</strong></span>
      </div>
    `;
    
    const summaryContent = document.getElementById('bookingSummaryContent');
    if (summaryContent) summaryContent.innerHTML = summaryHTML;
  }

  // Process booking
  processBooking(): void {
    this.showLoading();
    
    // Generate booking reference
    const bookingRef = 'TRP-' + new Date().getFullYear() + '-' + Math.random().toString().substr(2, 6);
    const bookingRefEl = document.getElementById('bookingRef');
    if (bookingRefEl) bookingRefEl.textContent = bookingRef;
    
    // Save complete booking data
    const completedBooking = {
      ...this.formData,
      bookingReference: bookingRef,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      selectedPackage: this.selectedPackageData
    };
    
    // Store completed booking in localStorage
    this.saveCompletedBooking(completedBooking);
    
    // Clear form data from localStorage
    localStorage.removeItem('trippy_booking_temp');
    this.formData = {};
    
    setTimeout(() => {
      this.hideLoading();
      this.showNotification('Booking confirmed successfully!', 'success');
    }, 2000);
  }

  // Save form data to localStorage
  saveFormData(): void {
    const form = document.getElementById('bookingForm') as HTMLFormElement;
    if (!form) return;
    
    const formDataObj = new FormData(form);
    
    this.formData = {};
    for (let [key, value] of formDataObj.entries()) {
      this.formData[key] = value;
    }
    
    // Add additional data
    const travelersEl = document.getElementById('travelers') as HTMLInputElement;
    if (travelersEl) this.formData.travelers = travelersEl.value;
    this.formData.selectedPackageData = this.selectedPackageData;
    this.formData.currentStep = this.currentStep;
    this.formData.timestamp = new Date().toISOString();
    
    // Save to localStorage
    try {
      localStorage.setItem('trippy_booking_temp', JSON.stringify(this.formData));
    } catch (error) {
      console.error('Failed to save form data to localStorage:', error);
    }
  }

  // Load form data from localStorage
  loadFormData(): void {
    try {
      const savedData = localStorage.getItem('trippy_booking_temp');
      if (savedData) {
        this.formData = JSON.parse(savedData);
        
        // Restore form values
        for (let [key, value] of Object.entries(this.formData)) {
          const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          if (element && typeof value === 'string') {
            element.value = value;
          }
        }
        
        // Restore travelers count
        if (this.formData.travelers) {
          const travelerCountEl = document.getElementById('travelerCount');
          const travelersEl = document.getElementById('travelers') as HTMLInputElement;
          if (travelerCountEl) travelerCountEl.textContent = this.formData.travelers;
          if (travelersEl) travelersEl.value = this.formData.travelers;
        }
        
        // Restore selected package
        if (this.formData.selectedPackageData) {
          this.selectedPackageData = this.formData.selectedPackageData;
          const packageType = Object.keys(this.packages).find(key => 
            (this.packages as any)[key].name === this.selectedPackageData.name
          );
          if (packageType) {
            const packageCard = document.getElementById(packageType + 'Package');
            if (packageCard) packageCard.classList.add('selected');
          }
        }
        
        // Restore current step if it was saved
        if (this.formData.currentStep && this.formData.currentStep > 1) {
          this.currentStep = this.formData.currentStep;
          this.updateStepDisplay();
        }
        
        console.log('Form data loaded from localStorage');
      }
    } catch (error) {
      console.error('Failed to load form data from localStorage:', error);
    }
  }

  // Save completed booking to localStorage
  saveCompletedBooking(booking: any): void {
    try {
      const existingBookings = this.getCompletedBookings();
      existingBookings.push(booking);
      localStorage.setItem('trippy_completed_bookings', JSON.stringify(existingBookings));
      console.log('Booking saved to localStorage:', booking.bookingReference);
    } catch (error) {
      console.error('Failed to save completed booking:', error);
    }
  }

  // Get all completed bookings from localStorage
  getCompletedBookings(): any[] {
    try {
      const bookings = localStorage.getItem('trippy_completed_bookings');
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Failed to load completed bookings:', error);
      return [];
    }
  }

  // Clear temporary form data
  clearTempFormData(): void {
    try {
      localStorage.removeItem('trippy_booking_temp');
      this.formData = {};
      console.log('Temporary form data cleared');
    } catch (error) {
      console.error('Failed to clear temp form data:', error);
    }
  }

  // Update step display after loading data
  updateStepDisplay(): void {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    if (currentStepEl) currentStepEl.classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      } else if (index + 1 === this.currentStep) {
        step.classList.add('active');
      }
    });
    
    this.updateNavigationButtons();
  }

  // Show notification
  showNotification(message: string, type: string = 'success'): void {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
      notificationText.textContent = message;
      notification.className = `notification ${type}`;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  // Show loading spinner
  showLoading(): void {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
  }

  // Hide loading spinner
  hideLoading(): void {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }

  // Utility functions
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Get booking by reference number
  getBookingByReference(bookingRef: string): any | null {
    try {
      const bookings = this.getCompletedBookings();
      return bookings.find(booking => booking.bookingReference === bookingRef) || null;
    } catch (error) {
      console.error('Failed to find booking:', error);
      return null;
    }
  }

  // Delete completed booking
  deleteBooking(bookingRef: string): boolean {
    try {
      const bookings = this.getCompletedBookings();
      const filteredBookings = bookings.filter(booking => booking.bookingReference !== bookingRef);
      localStorage.setItem('trippy_completed_bookings', JSON.stringify(filteredBookings));
      console.log('Booking deleted:', bookingRef);
      return true;
    } catch (error) {
      console.error('Failed to delete booking:', error);
      return false;
    }
  }

  // Export bookings as JSON
  exportBookings(): string {
    try {
      const bookings = this.getCompletedBookings();
      return JSON.stringify(bookings, null, 2);
    } catch (error) {
      console.error('Failed to export bookings:', error);
      return '[]';
    }
  }

  // Import bookings from JSON
  importBookings(jsonData: string): boolean {
    try {
      const bookings = JSON.parse(jsonData);
      if (Array.isArray(bookings)) {
        localStorage.setItem('trippy_completed_bookings', JSON.stringify(bookings));
        console.log('Bookings imported successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import bookings:', error);
      return false;
    }
  }

  // Clear all localStorage data
  clearAllData(): void {
    try {
      localStorage.removeItem('trippy_booking_temp');
      localStorage.removeItem('trippy_completed_bookings');
      this.formData = {};
      console.log('All localStorage data cleared');
      this.showNotification('All data cleared successfully', 'success');
    } catch (error) {
      console.error('Failed to clear localStorage data:', error);
      this.showNotification('Failed to clear data', 'error');
    }
  }

  // Get storage usage info
  getStorageInfo(): { tempSize: number, completedSize: number, totalBookings: number } {
    try {
      const tempData = localStorage.getItem('trippy_booking_temp');
      const completedData = localStorage.getItem('trippy_completed_bookings');
      const bookings = this.getCompletedBookings();
      
      return {
        tempSize: tempData ? new Blob([tempData]).size : 0,
        completedSize: completedData ? new Blob([completedData]).size : 0,
        totalBookings: bookings.length
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { tempSize: 0, completedSize: 0, totalBookings: 0 };
    }
  }
}
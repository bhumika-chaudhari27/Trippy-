import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Booking} from './booking';

describe('Booking', () => {
  let component: Booking;
  let fixture: ComponentFixture<Booking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Booking ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Booking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentStep).toBe(1);
    expect(component.totalSteps).toBe(5);
    expect(component.selectedPackageData).toBeNull();
  });

  it('should have package data', () => {
    expect(component.packages).toBeDefined();
    expect(component.packages.basic).toBeDefined();
    expect(component.packages.premium).toBeDefined();
    expect(component.packages.luxury).toBeDefined();
  });

  it('should validate email correctly', () => {
    expect(component.isValidEmail('test@example.com')).toBeTruthy();
    expect(component.isValidEmail('invalid-email')).toBeFalsy();
    expect(component.isValidEmail('test@')).toBeFalsy();
  });

  it('should validate phone correctly', () => {
    expect(component.isValidPhone('+1234567890')).toBeTruthy();
    expect(component.isValidPhone('1234567890')).toBeTruthy();
    expect(component.isValidPhone('invalid-phone')).toBeFalsy();
  });

  it('should change travelers count', () => {
    // Mock DOM elements
    const mockCountElement = document.createElement('span');
    mockCountElement.id = 'travelerCount';
    mockCountElement.textContent = '2';
    document.body.appendChild(mockCountElement);

    const mockHiddenInput = document.createElement('input');
    mockHiddenInput.id = 'travelers';
    mockHiddenInput.value = '2';
    document.body.appendChild(mockHiddenInput);

    const mockDecreaseBtn = document.createElement('button');
    mockDecreaseBtn.id = 'decreaseBtn';
    document.body.appendChild(mockDecreaseBtn);

    const mockIncreaseBtn = document.createElement('button');
    mockIncreaseBtn.id = 'increaseBtn';
    document.body.appendChild(mockIncreaseBtn);

    // Test increase
    component.changeTravelers(1);
    expect(mockCountElement.textContent).toBe('3');
    expect(mockHiddenInput.value).toBe('3');

    // Test decrease
    component.changeTravelers(-1);
    expect(mockCountElement.textContent).toBe('2');
    expect(mockHiddenInput.value).toBe('2');

    // Cleanup
    document.body.removeChild(mockCountElement);
    document.body.removeChild(mockHiddenInput);
    document.body.removeChild(mockDecreaseBtn);
    document.body.removeChild(mockIncreaseBtn);
  });

  it('should select package correctly', () => {
    // Mock DOM elements
    const mockPackageCard = document.createElement('div');
    mockPackageCard.id = 'basicPackage';
    mockPackageCard.className = 'package-card';
    document.body.appendChild(mockPackageCard);

    const mockSelectedInput = document.createElement('input');
    mockSelectedInput.id = 'selectedPackage';
    document.body.appendChild(mockSelectedInput);

    component.selectPackage('basic');
    
    expect(component.selectedPackageData).toEqual(component.packages.basic);
    expect(mockSelectedInput.value).toBe('basic');
    expect(mockPackageCard.classList.contains('selected')).toBeTruthy();

    // Cleanup
    document.body.removeChild(mockPackageCard);
    document.body.removeChild(mockSelectedInput);
  });

  it('should get completed bookings', () => {
    // Clear localStorage first
    localStorage.removeItem('trippy_completed_bookings');
    
    const bookings = component.getCompletedBookings();
    expect(Array.isArray(bookings)).toBeTruthy();
    expect(bookings.length).toBe(0);
  });

  it('should save and retrieve completed booking', () => {
    const mockBooking = {
      bookingReference: 'TRP-2024-TEST123',
      destination: 'Test Destination',
      status: 'confirmed'
    };

    component.saveCompletedBooking(mockBooking);
    const bookings = component.getCompletedBookings();
    
    expect(bookings.length).toBe(1);
    expect(bookings[0].bookingReference).toBe('TRP-2024-TEST123');

    const foundBooking = component.getBookingByReference('TRP-2024-TEST123');
    expect(foundBooking).toBeTruthy();
    expect(foundBooking.destination).toBe('Test Destination');
  });

  it('should delete booking', () => {
    const mockBooking = {
      bookingReference: 'TRP-2024-DELETE123',
      destination: 'Delete Test',
      status: 'confirmed'
    };

    component.saveCompletedBooking(mockBooking);
    expect(component.getCompletedBookings().length).toBe(1);

    const deleted = component.deleteBooking('TRP-2024-DELETE123');
    expect(deleted).toBeTruthy();
    expect(component.getCompletedBookings().length).toBe(0);
  });

  it('should clear all data', () => {
    // Add some test data
    const mockBooking = { bookingReference: 'TRP-2024-CLEAR123' };
    component.saveCompletedBooking(mockBooking);
    localStorage.setItem('trippy_booking_temp', '{"test": "data"}');

    component.clearAllData();

    expect(localStorage.getItem('trippy_booking_temp')).toBeNull();
    expect(localStorage.getItem('trippy_completed_bookings')).toBeNull();
    expect(component.formData).toEqual({});
  });

  it('should get storage info', () => {
    const info = component.getStorageInfo();
    
    expect(info).toBeDefined();
    expect(typeof info.tempSize).toBe('number');
    expect(typeof info.completedSize).toBe('number');
    expect(typeof info.totalBookings).toBe('number');
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem('trippy_booking_temp');
    localStorage.removeItem('trippy_completed_bookings');
  });
});
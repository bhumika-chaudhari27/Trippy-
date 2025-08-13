import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
userName: any;
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login'; 
    // or use router if preferred
  }
  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    this.userName = user ? JSON.parse(user).name : 'Guest'; // 👈 Correct way
  }
}
// Type definitions
interface Destination {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  badge: string;
  rating: number;
  description: string;
  highlights: Highlight[];
  gallery: string[];
  itinerary: ItineraryItem[];
  includes: string[];
}

interface Highlight {
  icon: string;
  title: string;
  desc: string;
}

interface ItineraryItem {
  day: string;
  title: string;
  desc: string;
}

interface SearchFormData {
  destination: string;
  checkin: string;
  checkout: string;
  travelers: string;
}

interface NotificationType {
  SUCCESS: 'success';
  ERROR: 'error';
  INFO: 'info';
  WARNING: 'warning';
}

// Main Application Class
class Trippy {
  private destinationData: Map<string, Destination>;
  private currentModal: HTMLElement | null = null;
  private loadingElement: HTMLElement | null = null;
  private notificationElement: HTMLElement | null = null;

  constructor() {
    this.destinationData = new Map();
    this.initializeDestinations();
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.setupDateValidation();
    this.createModalElements();
    this.createNotificationElements();
    this.createLoadingElements();
  }

  private initializeDestinations(): void {
    const destinations: Destination[] = [
      {
        id: 'paris',
        title: 'Paris, France',
        location: 'City of Light',
        price: 'From $1,299',
        image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop',
        badge: 'Popular',
        rating: 4.9,
        description: 'Experience the magic of Paris with our carefully curated travel package. From the iconic Eiffel Tower to the charming streets of Montmartre, discover the city that has captured hearts for centuries. Enjoy world-class cuisine, magnificent art collections at the Louvre, and romantic Seine river cruises.',
        highlights: [
          { icon: 'fas fa-landmark', title: 'Eiffel Tower', desc: 'Visit the iconic symbol of Paris' },
          { icon: 'fas fa-palette', title: 'Louvre Museum', desc: 'See the Mona Lisa and world art' },
          { icon: 'fas fa-bread-slice', title: 'French Cuisine', desc: 'Taste authentic French delicacies' },
          { icon: 'fas fa-water', title: 'Seine Cruise', desc: 'Romantic river cruise experience' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1520637836862-4d197d17c51a?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Arrival & City Tour', desc: 'Arrive in Paris, check into hotel, evening city orientation tour' },
          { day: 'Day 2', title: 'Eiffel Tower & Seine', desc: 'Visit Eiffel Tower, lunch at Trocadéro, Seine river cruise' },
          { day: 'Day 3', title: 'Louvre & Montmartre', desc: 'Morning at Louvre Museum, afternoon exploring Montmartre' },
          { day: 'Day 4', title: 'Versailles Day Trip', desc: 'Full day excursion to Palace of Versailles and gardens' },
          { day: 'Day 5', title: 'Free Day & Departure', desc: 'Shopping on Champs-Élysées, departure transfers' }
        ],
        includes: [
          'Round-trip flights', '4-star hotel accommodation', 'Daily breakfast',
          'Professional tour guide', 'Entrance fees', 'Airport transfers',
          'Seine river cruise', 'Versailles day trip'
        ]
      },
      {
        id: 'tokyo',
        title: 'Tokyo, Japan',
        location: 'Land of the Rising Sun',
        price: 'From $1,599',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop',
        badge: 'Trending',
        rating: 4.8,
        description: 'Immerse yourself in the perfect blend of traditional culture and cutting-edge technology in Tokyo. From ancient temples to neon-lit districts, experience the vibrant energy of Japan\'s capital city. Enjoy authentic sushi, witness the famous cherry blossoms, and explore both historic and ultra-modern neighborhoods.',
        highlights: [
          { icon: 'fas fa-torii-gate', title: 'Senso-ji Temple', desc: 'Ancient Buddhist temple experience' },
          { icon: 'fas fa-fish', title: 'Tsukiji Market', desc: 'Fresh sushi and seafood adventure' },
          { icon: 'fas fa-mountain', title: 'Mount Fuji', desc: 'Day trip to iconic mountain' },
          { icon: 'fas fa-robot', title: 'Tech Districts', desc: 'Explore Shibuya and Harajuku' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Arrival & Shibuya', desc: 'Land in Tokyo, hotel check-in, explore Shibuya crossing' },
          { day: 'Day 2', title: 'Traditional Tokyo', desc: 'Visit Senso-ji Temple, Imperial Palace, traditional tea ceremony' },
          { day: 'Day 3', title: 'Modern Tokyo', desc: 'Harajuku, Omotesando shopping, Robot Restaurant show' },
          { day: 'Day 4', title: 'Mount Fuji Trip', desc: 'Full day excursion to Mount Fuji and Lake Kawaguchi' },
          { day: 'Day 5', title: 'Tsukiji & Departure', desc: 'Early morning fish market, sushi breakfast, departure' }
        ],
        includes: [
          'Round-trip flights', 'Traditional ryokan stay', 'Japanese breakfast',
          'English-speaking guide', 'JR Pass for trains', 'Airport transfers',
          'Mount Fuji day trip', 'Cultural experiences'
        ]
      },
      {
        id: 'bali',
        title: 'Bali, Indonesia',
        location: 'Island Paradise',
        price: 'From $899',
        image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&h=600&fit=crop',
        badge: 'Hot Deal',
        rating: 4.7,
        description: 'Escape to the tropical paradise of Bali, where stunning beaches meet ancient temples and lush rice terraces. Experience the spiritual heart of Indonesia with yoga retreats, traditional ceremonies, and world-class spa treatments. Discover hidden waterfalls, vibrant coral reefs, and warm Balinese hospitality.',
        highlights: [
          { icon: 'fas fa-om', title: 'Temple Tours', desc: 'Visit sacred Hindu temples' },
          { icon: 'fas fa-water', title: 'Beach Paradise', desc: 'Pristine beaches and surfing' },
          { icon: 'fas fa-seedling', title: 'Rice Terraces', desc: 'UNESCO World Heritage sites' },
          { icon: 'fas fa-spa', title: 'Spa Treatments', desc: 'Traditional Balinese wellness' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Arrival & Ubud', desc: 'Airport pickup, transfer to Ubud, jungle walk' },
          { day: 'Day 2', title: 'Temple & Culture', desc: 'Tanah Lot temple, traditional dance performance' },
          { day: 'Day 3', title: 'Rice Terraces', desc: 'Jatiluwih rice terraces, local village visit' },
          { day: 'Day 4', title: 'Beach Day', desc: 'Seminyak beach, surfing lessons, sunset dinner' },
          { day: 'Day 5', title: 'Spa & Departure', desc: 'Traditional spa treatment, shopping, departure' }
        ],
        includes: [
          'Round-trip flights', 'Boutique resort stay', 'Daily breakfast',
          'Private driver guide', 'Temple entrance fees', 'Airport transfers',
          'Spa treatment', 'Cultural performances'
        ]
      },
      {
        id: 'newyork',
        title: 'New York, USA',
        location: 'The Big Apple',
        price: 'From $1,199',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop',
        badge: 'Classic',
        rating: 4.6,
        description: 'Experience the energy of the city that never sleeps. From Broadway shows to world-class museums, iconic landmarks to diverse neighborhoods, New York offers endless possibilities. Walk through Central Park, catch a show in Times Square, and enjoy cuisine from around the world in this vibrant metropolis.',
        highlights: [
          { icon: 'fas fa-building', title: 'Empire State', desc: 'Iconic skyscraper views' },
          { icon: 'fas fa-theater-masks', title: 'Broadway Shows', desc: 'World-class entertainment' },
          { icon: 'fas fa-tree', title: 'Central Park', desc: 'Urban oasis exploration' },
          { icon: 'fas fa-utensils', title: 'Food Scene', desc: 'Diverse culinary experiences' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Manhattan Arrival', desc: 'Hotel check-in, Times Square exploration, Broadway show' },
          { day: 'Day 2', title: 'Classic NYC', desc: 'Empire State Building, Central Park, Metropolitan Museum' },
          { day: 'Day 3', title: 'Statue of Liberty', desc: 'Ferry to Liberty Island, Ellis Island, Brooklyn Bridge walk' },
          { day: 'Day 4', title: 'Neighborhoods', desc: 'SoHo shopping, Little Italy, Chinatown food tour' },
          { day: 'Day 5', title: 'Final Day', desc: 'High Line park, Chelsea Market, departure preparations' }
        ],
        includes: [
          'Round-trip flights', 'Manhattan hotel', 'Continental breakfast',
          'Professional guide', 'Broadway show tickets', 'Airport transfers',
          'Statue of Liberty ferry', 'Museum entrances'
        ]
      },
      {
        id: 'santorini',
        title: 'Santorini, Greece',
        location: 'Aegean Paradise',
        price: 'From $1,799',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=600&fit=crop',
        badge: 'Romantic',
        rating: 4.8,
        description: 'Discover the breathtaking beauty of Santorini with its iconic white-washed buildings, blue-domed churches, and spectacular sunsets. This volcanic island offers world-class wines, ancient ruins, and some of the most romantic views in the Mediterranean. Experience luxury accommodation and authentic Greek cuisine.',
        highlights: [
          { icon: 'fas fa-sun', title: 'Epic Sunsets', desc: 'World\'s most beautiful sunsets' },
          { icon: 'fas fa-wine-glass', title: 'Wine Tasting', desc: 'Volcanic soil vineyards' },
          { icon: 'fas fa-ruins', title: 'Ancient Sites', desc: 'Akrotiri archaeological site' },
          { icon: 'fas fa-swimming-pool', title: 'Infinity Pools', desc: 'Luxury cliff-side hotels' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570012492-976893c88ab6?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Arrival & Oia', desc: 'Airport transfer, hotel check-in, sunset in Oia' },
          { day: 'Day 2', title: 'Fira & Culture', desc: 'Explore Fira town, cable car ride, archaeological museum' },
          { day: 'Day 3', title: 'Wine & Beaches', desc: 'Vineyard tours, wine tasting, Red Beach visit' },
          { day: 'Day 4', title: 'Boat Tour', desc: 'Volcano cruise, hot springs, traditional Greek dinner' },
          { day: 'Day 5', title: 'Relaxation', desc: 'Spa morning, shopping in Oia, farewell sunset' }
        ],
        includes: [
          'Round-trip flights', 'Luxury cave hotel', 'Greek breakfast',
          'Private transfers', 'Wine tasting tours', 'Airport transfers',
          'Volcano boat trip', 'Spa treatments'
        ]
      },
      {
        id: 'dubai',
        title: 'Dubai, UAE',
        location: 'City of Gold',
        price: 'From $2,099',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop',
        badge: 'Luxury',
        rating: 4.7,
        description: 'Experience the ultimate luxury destination where modern architecture meets traditional Arabian culture. From the world\'s tallest building to man-made islands, Dubai offers unparalleled shopping, dining, and entertainment. Enjoy desert safaris, gold souks, and world-class hospitality in this futuristic city.',
        highlights: [
          { icon: 'fas fa-building', title: 'Burj Khalifa', desc: 'World\'s tallest building' },
          { icon: 'fas fa-shopping-bag', title: 'Luxury Shopping', desc: 'Dubai Mall and gold souks' },
          { icon: 'fas fa-fire', title: 'Desert Safari', desc: 'Dune bashing and camel rides' },
          { icon: 'fas fa-utensils', title: 'Fine Dining', desc: 'Michelin-starred restaurants' }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1571048421602-0b27de2a2e8f?w=400&h=300&fit=crop'
        ],
        itinerary: [
          { day: 'Day 1', title: 'Modern Dubai', desc: 'Burj Khalifa visit, Dubai Mall, fountain show' },
          { day: 'Day 2', title: 'Traditional Dubai', desc: 'Gold souk, spice market, dhow cruise dinner' },
          { day: 'Day 3', title: 'Palm Jumeirah', desc: 'Atlantis resort, water park, luxury beach club' },
          { day: 'Day 4', title: 'Desert Adventure', desc: 'Desert safari, camel riding, Bedouin camp dinner' },
          { day: 'Day 5', title: 'Luxury Day', desc: 'Spa treatment, fine dining, last-minute shopping' }
        ],
        includes: [
          'Round-trip flights', '5-star hotel stay', 'Daily breakfast',
          'Private guide', 'Burj Khalifa tickets', 'Airport transfers',
          'Desert safari', 'Dhow cruise dinner'
        ]
      }
    ];

    destinations.forEach(dest => {
      this.destinationData.set(dest.id, dest);
    });
  }

  private setupEventListeners(): void {
    // Header scroll effect
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });

    // Search form submission
    const searchForm = document.querySelector('.search-form') as HTMLFormElement;
    if (searchForm) {
      searchForm.addEventListener('submit', this.handleSearchSubmit.bind(this));
    }

    // Destination card clicks
    document.querySelectorAll('.destination-card').forEach((card, index) => {
      const destinationIds = ['paris', 'tokyo', 'bali', 'newyork', 'santorini', 'dubai'];
      card.addEventListener('click', () => {
        this.openDestinationModal(destinationIds[index]);
      });
    });
  }

  private setupDateValidation(): void {
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin') as HTMLInputElement;
    const checkoutInput = document.getElementById('checkout') as HTMLInputElement;

    if (checkinInput && checkoutInput) {
      checkinInput.setAttribute('min', today);
      checkoutInput.setAttribute('min', today);

      checkinInput.addEventListener('change', () => {
        const checkinDate = checkinInput.value;
        checkoutInput.setAttribute('min', checkinDate);
      });
    }
  }

  private handleScroll(): void {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  private handleSmoothScroll(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const targetElement = document.querySelector(target.getAttribute('href')!);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private handleSearchSubmit(e: Event): void {
    e.preventDefault();
    this.showLoading();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const searchData: SearchFormData = {
      destination: formData.get('destination') as string,
      checkin: formData.get('checkin') as string,
      checkout: formData.get('checkout') as string,
      travelers: formData.get('travelers') as string
    };

    // Simulate API call
    setTimeout(() => {
      this.hideLoading();
      this.showNotification(`Searching for trips to ${searchData.destination}...`, 'success');
      
      // Scroll to destinations
      const destinationsSection = document.getElementById('destinations');
      if (destinationsSection) {
        destinationsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  }

  public openDestinationModal(destinationId: string): void {
    const destination = this.destinationData.get(destinationId);
    if (!destination) return;

    this.createModalContent(destination);
    this.showModal();
  }

  private createModalContent(destination: Destination): void {
    const modalHTML = `
      <div class="destination-modal" id="destinationModal">
        <div class="modal-content">
          <button class="modal-close" id="modalClose">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-hero" style="background-image: url('${destination.image}');">
            <div class="modal-hero-content">
              <h2 class="modal-title">${destination.title}</h2>
              <p class="modal-location">
                <i class="fas fa-map-marker-alt"></i>
                ${destination.location}
              </p>
              <div class="price-display">${destination.price}</div>
            </div>
          </div>
          <div class="modal-body">
            <p class="modal-description">${destination.description}</p>

            <div class="modal-section">
              <h3>Trip Highlights</h3>
              <div class="highlights-grid">
                ${destination.highlights.map(highlight => `
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <i class="${highlight.icon}"></i>
                    </div>
                    <div class="highlight-content">
                      <h4>${highlight.title}</h4>
                      <p>${highlight.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="modal-section">
              <h3>Photo Gallery</h3>
              <div class="gallery-grid">
                ${destination.gallery.map(image => `
                  <div class="gallery-item" style="background-image: url('${image}');"></div>
                `).join('')}
              </div>
            </div>

            <div class="modal-section">
              <h3>Sample Itinerary</h3>
              <div class="itinerary-list">
                ${destination.itinerary.map(item => `
                  <div class="itinerary-item">
                    <div class="day-number">${item.day}</div>
                    <div class="day-content">
                      <h4>${item.title}</h4>
                      <p>${item.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="modal-section">
              <h3>What's Included</h3>
              <div class="includes-list">
                ${destination.includes.map(item => `
                  <div class="include-item">
                    <i class="fas fa-check"></i>
                    <span>${item}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="modal-actions">
              <button class="secondary-button" id="moreInfoBtn">
                <i class="fas fa-info-circle"></i> More Info
              </button>
              <button class="cta-button" (click)="bookNow()">
              <i class="fas fa-calendar-check"></i> Book Now
              </button>

            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('destinationModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Setup modal event listeners
    this.setupModalEventListeners();
  }

  private setupModalEventListeners(): void {
    const modal = document.getElementById('destinationModal');
    const closeBtn = document.getElementById('modalClose');
    const moreInfoBtn = document.getElementById('moreInfoBtn');
    const bookTripBtn = document.getElementById('bookTripBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    if (moreInfoBtn) {
      moreInfoBtn.addEventListener('click', () => {
        this.showNotification('More information sent to your email!', 'success');
      });
    }

    if (bookTripBtn) {
      bookTripBtn.addEventListener('click', () => this.bookTrip());
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeModal();
      }
    });
  }

  private showModal(): void {
    const modal = document.getElementById('destinationModal');
    if (modal) {
      this.currentModal = modal;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    }
  }

  private closeModal(): void {
    if (this.currentModal) {
      this.currentModal.classList.remove('show');
      document.body.style.overflow = 'auto';
      
      setTimeout(() => {
        if (this.currentModal) {
          this.currentModal.remove();
          this.currentModal = null;
        }
      }, 300);
    }
  }

  private bookTrip(): void {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
      this.showNotification('Booking confirmed! Check your email for details.', 'success');
      this.closeModal();
    }, 2000);
  }

  private createLoadingElements(): void {
    const loadingHTML = `
      <div id="loading" class="loading" style="display: none;">
        <div class="spinner"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    this.loadingElement = document.getElementById('loading');
  }

  private createNotificationElements(): void {
    const notificationHTML = `
      <div id="notification" class="notification">
        <span id="notificationText">Notification text here</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    this.notificationElement = document.getElementById('notification');
  }

  private createModalElements(): void {
    // Modal styles will be added via CSS
    const modalStyles = `
      <style>
        .destination-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .destination-modal.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 90vw;
          max-height: 90vh;
          width: 900px;
          overflow: hidden;
          transform: translateY(50px);
          transition: transform 0.3s ease;
          position: relative;
        }

        .destination-modal.show .modal-content {
          transform: translateY(0);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: white;
          transform: scale(1.1);
        }

        .modal-hero {
          height: 300px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: end;
          padding: 2rem;
          color: white;
        }

        .modal-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
        }

        .modal-hero-content {
          position: relative;
          z-index: 2;
        }

        .modal-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .modal-location {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-display {
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          padding: 0.5rem 1rem;
          border-radius: 25px;
          display: inline-block;
        }

        .modal-body {
          padding: 2rem;
          max-height: 500px;
          overflow-y: auto;
        }

        .modal-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 2rem;
        }

        .modal-section {
          margin-bottom: 2rem;
        }

        .modal-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #2563eb;
        }

        .highlight-icon {
          color: #2563eb;
          font-size: 1.5rem;
          min-width: 30px;
        }

        .highlight-content h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1f2937;
        }

        .highlight-content p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          height: 150px;
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .gallery-item:hover {
          transform: scale(1.05);
        }

        .itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .itinerary-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .day-number {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          min-width: 80px;
          text-align: center;
          height: fit-content;
        }

        .day-content h4 {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .day-content p {
          color: #6b7280;
          line-height: 1.5;
        }

        .includes-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.5rem;
        }

        .include-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
        }

        .include-item i {
          color: #059669;
          font-size: 1rem;
        }

        .include-item span {
          color: #374151;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .secondary-button:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }

        .loading {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #059669;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 10001;
          transform: translateX(400px);
          transition: transform 0.3s ease;
          max-width: 300px;
        }

        .notification.show {
          transform: translateX(0);
        }

        .notification.success {
          background: #059669;
        }

        .notification.error {
          background: #dc2626;
        }

        .notification.info {
          background: #2563eb;
        }

        .notification.warning {
          background: #d97706;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: 95vh;
          }

          .modal-hero {
            height: 200px;
            padding: 1rem;
          }

          .modal-title {
            font-size: 1.8rem;
          }

          .modal-body {
            padding: 1rem;
          }

          .highlights-grid,
          .gallery-grid,
          .includes-list {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column;
          }

          .itinerary-item {
            flex-direction: column;
          }

          .day-number {
            align-self: flex-start;
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', modalStyles);
  }

  public showLoading(): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'flex';
    }
  }

  public hideLoading(): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  public showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
    if (!this.notificationElement) return;

    const notificationText = document.getElementById('notificationText');
    if (notificationText) {
      notificationText.textContent = message;
    }

    this.notificationElement.className = `notification ${type}`;
    this.notificationElement.classList.add('show');

    setTimeout(() => {
      if (this.notificationElement) {
        this.notificationElement.classList.remove('show');
      }
    }, 4000);
  }

  // Utility method to format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Utility method to format dates
  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Method to validate search form
  private validateSearchForm(formData: SearchFormData): boolean {
    const { destination, checkin, checkout, travelers } = formData;

    if (!destination.trim()) {
      this.showNotification('Please enter a destination', 'error');
      return false;
    }

    if (!checkin) {
      this.showNotification('Please select a check-in date', 'error');
      return false;
    }

    if (!checkout) {
      this.showNotification('Please select a check-out date', 'error');
      return false;
    }

    if (new Date(checkout) <= new Date(checkin)) {
      this.showNotification('Check-out date must be after check-in date', 'error');
      return false;
    }

    if (!travelers) {
      this.showNotification('Please select number of travelers', 'error');
      return false;
    }

    return true;
  }

  // Method to simulate API calls
  private async simulateApiCall<T>(data: any, delay: number = 2000): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data as T);
      }, delay);
    });
  }

  // Method to get destination by ID
  public getDestination(id: string): Destination | undefined {
    return this.destinationData.get(id);
  }

  // Method to get all destinations
  public getAllDestinations(): Destination[] {
    return Array.from(this.destinationData.values());
  }

  // Method to search destinations
  public searchDestinations(query: string): Destination[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllDestinations().filter(dest =>
      dest.title.toLowerCase().includes(lowercaseQuery) ||
      dest.location.toLowerCase().includes(lowercaseQuery) ||
      dest.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Method to filter destinations by price range
  public filterByPriceRange(minPrice: number, maxPrice: number): Destination[] {
    return this.getAllDestinations().filter(dest => {
      const price = parseInt(dest.price.replace(/[^0-9]/g, ''));
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Method to sort destinations by rating
  public sortByRating(ascending: boolean = false): Destination[] {
    const destinations = this.getAllDestinations();
    return destinations.sort((a, b) => 
      ascending ? a.rating - b.rating : b.rating - a.rating
    );
  }

  // Method to get featured destinations
  public getFeaturedDestinations(): Destination[] {
    return this.getAllDestinations()
      .filter(dest => ['Popular', 'Trending', 'Hot Deal'].includes(dest.badge))
      .sort((a, b) => b.rating - a.rating);
  }

  // Method to handle window resize
  private handleResize(): void {
    if (this.currentModal) {
      // Adjust modal positioning on resize
      const modalContent = this.currentModal.querySelector('.modal-content') as HTMLElement;
      if (modalContent && window.innerWidth < 768) {
        modalContent.style.margin = '1rem';
        modalContent.style.maxHeight = '95vh';
      }
    }
  }

  // Method to initialize analytics tracking (placeholder)
  private trackEvent(eventName: string, properties: any): void {
    console.log(`Analytics Event: ${eventName}`, properties);
    // Implement actual analytics tracking here
  }

  // Method to handle social sharing
  public shareDestination(destinationId: string, platform: 'facebook' | 'twitter' | 'instagram'): void {
    const destination = this.getDestination(destinationId);
    if (!destination) return;

    const shareUrl = `${window.location.origin}?destination=${destinationId}`;
    const shareText = `Check out this amazing destination: ${destination.title} - ${destination.location}!`;

    let socialUrl = '';

    switch (platform) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        this.showNotification('Link copied to clipboard for Instagram sharing!', 'info');
        return;
    }

    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
      this.trackEvent('destination_shared', {
        destination_id: destinationId,
        platform: platform
      });
    }
  }

  // Method to handle favorites (localStorage)
  public toggleFavorite(destinationId: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(destinationId);

    if (index > -1) {
      favorites.splice(index, 1);
      this.showNotification('Removed from favorites', 'info');
    } else {
      favorites.push(destinationId);
      this.showNotification('Added to favorites', 'success');
    }

    localStorage.setItem('trippy_favorites', JSON.stringify(favorites));
    this.trackEvent('favorite_toggled', {
      destination_id: destinationId,
      action: index > -1 ? 'removed' : 'added'
    });
  }

  private getFavorites(): string[] {
    try {
      const favorites = localStorage.getItem('trippy_favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  }

  public isFavorite(destinationId: string): boolean {
    return this.getFavorites().includes(destinationId);
  }

  // Method to handle booking with more detailed flow
  public async initiateBooking(destinationId: string): Promise<void> {
    const destination = this.getDestination(destinationId);
    if (!destination) return;

    this.showLoading();
    this.trackEvent('booking_initiated', { destination_id: destinationId });

    try {
      // Simulate booking API call
      await this.simulateApiCall({
        bookingId: `TRIP_${Date.now()}`,
        destination: destination.title,
        status: 'confirmed'
      }, 3000);

      this.hideLoading();
      this.showNotification(`Booking confirmed for ${destination.title}! Check your email for details.`, 'success');
      this.closeModal();

      this.trackEvent('booking_completed', {
        destination_id: destinationId,
        destination_title: destination.title
      });

    } catch (error) {
      this.hideLoading();
      this.showNotification('Booking failed. Please try again.', 'error');
      console.error('Booking error:', error);
    }
  }
}

// Enhanced Utility Functions
class TrippyUtils {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static formatPrice(price: string): number {
    return parseInt(price.replace(/[^0-9]/g, ''));
  }

  static calculateDays(checkin: string, checkout: string): number {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static generateStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new Trippy();
  
  // Make app globally accessible for debugging
  (window as any).trippyApp = app;
  (window as any).TrippyUtils = TrippyUtils;

  console.log('Trippy Travel App initialized successfully!');
});

// Export for module usage
export { Trippy, TrippyUtils };
export type { Destination, Highlight, ItineraryItem, SearchFormData };
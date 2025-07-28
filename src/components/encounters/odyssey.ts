// Update Odysseus position based on scroll
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.odyssey-container') as HTMLElement;
  const odysseus = document.querySelector('.odysseus-character') as HTMLElement;
  const encounters = document.querySelectorAll('.encounter');

  // Map of encounter IDs to their animation elements
  const animationElements = new Map<string, HTMLElement>([
    ['lotus-eaters', document.querySelector('#lotus-animation .swimming-men') as HTMLElement],
    ['cyclops', document.querySelector('#cyclops-animation .cyclops-scene') as HTMLElement],
    ['aeolus', document.querySelector('#aeolus-animation .wind-scene') as HTMLElement],
    ['circe', document.querySelector('#circe-animation .circe-scene') as HTMLElement],
    ['underworld', document.querySelector('#underworld-animation .underworld-scene') as HTMLElement]
  ]);

  // Special handling for Underworld overlay
  const underworldOverlay = document.querySelector('#underworld-overlay') as HTMLElement;
  const underworldBubble = document.querySelector('#underworld-bubble') as HTMLElement;

  if (!container || !odysseus) return;

  // Set journey track width dynamically
  const journeyTrack = document.querySelector('.journey-track') as HTMLElement;
  if (journeyTrack) {
    journeyTrack.style.minWidth = Math.min(8000, container.scrollWidth) + 'px';
  }

  // Convert mouse wheel to horizontal scroll
  container.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    container.scrollLeft += e.deltaY;
  });

  container.addEventListener('scroll', () => {
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const journeyWidth = container.scrollWidth; // Total journey width
    
    // Calculate Odysseus position
    const scrollProgress = Math.min(scrollLeft / (journeyWidth - containerWidth), 1);
    const minLeft = 50; // Start position
    const maxLeft = containerWidth - 100; // End position (100px from right edge)
    const odysseusLeft = minLeft + (scrollProgress * (maxLeft - minLeft));
    odysseus.style.left = `${odysseusLeft}px`;

    // Check if Odysseus has reached or passed Laestrygonians
    const laestrygoniansEncounter = document.querySelector('#laestrygonians') as HTMLElement;
    const fleetShips = document.querySelectorAll('.fleet-ship');
    
    if (laestrygoniansEncounter) {
      const laestrygoniansRect = laestrygoniansEncounter.getBoundingClientRect();
      const odysseusRect = odysseus.getBoundingClientRect();
      
      // Check if Odysseus has reached or passed Laestrygonians
      const hasReachedLaestrygonians = odysseusRect.right >= laestrygoniansRect.left;
      
      fleetShips.forEach((ship) => {
        if (hasReachedLaestrygonians) {
          (ship as HTMLElement).style.opacity = '0';
          (ship as HTMLElement).style.transform = 'scale(0.8)';
        } else {
          (ship as HTMLElement).style.opacity = '1';
          (ship as HTMLElement).style.transform = 'scale(1)';
        }
      });
    }

    // Find the encounter closest to Odysseus
    let closestEncounter: Element | null = null;
    let closestDistance = Infinity;
    encounters.forEach(encounter => {
      const rect = encounter.getBoundingClientRect();
      // Get the center of the encounter relative to the viewport
      const encounterCenter = rect.left + rect.width / 2;
      // Odysseus's center relative to the viewport
      const odysseusRect = odysseus.getBoundingClientRect();
      const odysseusCenter = odysseusRect.left + odysseusRect.width / 2;
      const distance = Math.abs(encounterCenter - odysseusCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEncounter = encounter;
      }
    });
    
    // Set only the closest encounter as active
    encounters.forEach(encounter => {
      if (encounter === closestEncounter) {
        encounter.classList.add('active');
      } else {
        encounter.classList.remove('active');
      }
    });
    
    // Handle animations for all encounters
    const closestEncounterId = closestEncounter ? (closestEncounter as HTMLElement).id : null;
    
    // Reset all animations
    animationElements.forEach((element) => {
      if (element) {
        element.classList.remove('active');
      }
    });
    
    // Activate animation for the closest encounter
    if (closestEncounterId && animationElements.has(closestEncounterId)) {
      const animationElement = animationElements.get(closestEncounterId);
      if (animationElement) {
        animationElement.classList.add('active');
      }
    }

    // Special handling for Underworld overlay
    if (underworldOverlay) {
      if (closestEncounterId === 'underworld') {
        underworldOverlay.classList.add('active');
        if (underworldBubble) {
          underworldBubble.classList.add('active');
        }
      } else {
        underworldOverlay.classList.remove('active');
        if (underworldBubble) {
          underworldBubble.classList.remove('active');
        }
      }
    }
  });
}); 
// Update Odysseus position based on scroll
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.odyssey-container') as HTMLElement;
  const odysseus = document.querySelector('.odysseus-character') as HTMLElement;
  const encounters = document.querySelectorAll('.encounter');

  // Map of encounter IDs to their animation elements
  const animationElements = new Map<string, HTMLElement>([
    ['lotus-eaters', document.querySelector('#lotus-animation .swimming-men') as HTMLElement],
    ['cyclops', document.querySelector('#cyclops-animation .cyclops-scene') as HTMLElement],
    ['aeolus', document.querySelector('#aeolus-animation .wind-scene') as HTMLElement]
  ]);

  if (!container || !odysseus) return;

  // Set journey track width dynamically
  const journeyTrack = document.querySelector('.journey-track') as HTMLElement;
  if (journeyTrack) {
    journeyTrack.style.minWidth = container.scrollWidth + 'px';
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
  });
}); 
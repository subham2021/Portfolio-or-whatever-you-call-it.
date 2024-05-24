document.addEventListener('DOMContentLoaded', () => {
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const projectsLink = document.getElementById('projects-link');
    const projectsSection = document.getElementById('projects');
    const viewerCountElem = document.getElementById('viewer-count');
    const rocketGame = document.getElementById('rocket-link');
    const speechBubble = document.getElementById('speech-bubble');
    const closeBubble = document.getElementById('close-bubble');

    updateSunAndMoonPosition();

    // Viewer count logic (simplified example)
    let totalViews = localStorage.getItem('totalViews') || 0;
    totalViews++;
    localStorage.setItem('totalViews', totalViews);
    let liveViewers = Math.floor(Math.random() * 100); // Simulate live viewers

    viewerCountElem.textContent = `Live viewers: ${liveViewers} | Total views: ${totalViews}`;

    // Dropdown menu logic
    projectsLink.addEventListener('click', (event) => {
        event.preventDefault();
        projectsSection.classList.toggle('active');
    });

    // Close  section when ESC key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && resumeSection.classList.contains('active')) {
            resumeSection.classList.remove('active');
        }
    });

    // Function to show speech bubble
    function showSpeechBubble() {
        const rocketRect = rocketGame.getBoundingClientRect();
        const speechBubbleWidth = speechBubble.offsetWidth;
        const speechBubbleHeight = speechBubble.offsetHeight;

        // Calculate position of speech bubble
        const rightGap = window.innerWidth - rocketRect.right;
        const topOffset = rocketRect.top;

        // Position the speech bubble above the rocket icon
        speechBubble.style.right = (rightGap - rocketRect.width / 2 - speechBubbleWidth / 2) + 'px';
        speechBubble.style.top = (topOffset - speechBubbleHeight - 10) + 'px'; // 10px above the rocket icon
        speechBubble.style.display = 'block';
    }

    // Close bubble when the close button is clicked
    closeBubble.addEventListener('click', () => {
        speechBubble.style.display = 'none';
    });

    // Rocket icon hover effect
    rocketGame.addEventListener('mouseenter', () => {
        rocketGame.style.transform = 'scale(1.2)';
    });

    rocketGame.addEventListener('mouseleave', () => {
        rocketGame.style.transform = 'scale(1)';
    });

    // Add a message for location access
    if (navigator.geolocation) {
        if (sessionStorage.getItem('locationAsked') !== 'true') {
            setTimeout(() => {
                alert("This is only for a dynamic aspect of the webpage. This will locate the sun and the moon on the basis of your real location. You may choose not to.");
                sessionStorage.setItem('locationAsked', 'true');
            }, 1000); // Display alert after 1 second delay
        }
        updateSunAndMoonPosition();
    }

    // Display message after a delay
    setTimeout(() => {
        showSpeechBubble();
    }, 5000); // 5000 milliseconds delay
});

function updateSunAndMoonPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const seconds = currentTime.getSeconds();

            // Calculate sun position for horizon
            const sunAngle = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 180 - 90; // 180 degrees for horizon
            const sunX = (sunAngle / 180 * 100); // Convert angle to percentage width

            // Update sun position
            sun.style.transform = `translate(${sunX}vw, 0)`;

            // Update shadow on the name
            const nameElement = document.getElementById('name');
            const shadowAngle = (sunX - 50) * 0.2; // Adjust shadow angle multiplier as needed
            nameElement.style.textShadow = `${shadowAngle}px 10px 5px rgba(0, 0, 0, 0.5)`;

            // Determine if it is day or night
            const isDayTime = hours >= 6 && hours < 18; // Adjust this range as needed

            if (isDayTime) {
                document.body.classList.remove('night');
            } else {
                document.body.classList.add('night');

                // Calculate moon position
                const moonAngle = sunAngle + 180;
                const moonX = (moonAngle / 180 * 100); // Convert angle to percentage width

                // Update moon position
                moon.style.transform = `translate(${moonX}vw, 0)`;
            }
        });
    }
}


// Interactive Title System
// Allows users to type in the hero title area on the homepage

function initInteractiveTitle() {
    const titleElement = document.getElementById('interactive-title');
    if (!titleElement) return;

    const defaultText = 'Yuri Korolev | Developer';
    let currentText = '';
    let isTyping = false;
    let typingTimer;
    let keyboardFocused = false;
    let initialTypingComplete = false;
    let isResetting = false; // Flag to prevent input during reset animation

    // Check if device is mobile/touch
    const isMobile = window.matchMedia('(max-width: 768px)').matches ||
                     (window.matchMedia('(hover: none)').matches && window.matchMedia('(pointer: coarse)').matches);

    // On mobile, just show the text immediately without animation
    if (isMobile) {
        titleElement.textContent = defaultText;
        currentText = defaultText;
        initialTypingComplete = true;
        return; // Exit early, no keyboard interaction on mobile
    }

    // Set initial state - empty for typing animation
    titleElement.textContent = '';

    // Type out the default text on load
    function typeInitialText() {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < defaultText.length) {
                currentText += defaultText[charIndex];
                titleElement.textContent = currentText + '|';
                charIndex++;
            } else {
                clearInterval(typeInterval);
                titleElement.textContent = currentText;
                initialTypingComplete = true;
            }
        }, 100);
    }

    // Start typing animation after a short delay
    setTimeout(typeInitialText, 500);

    // Animated reset to default text after inactivity
    function resetToDefault() {
        if (currentText === defaultText) {
            keyboardFocused = false;
            return;
        }

        isResetting = true;
        keyboardFocused = false;

        // First, delete current text character by character
        function deleteText() {
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                titleElement.textContent = currentText + '|';
                setTimeout(deleteText, 50); // Faster deletion
            } else {
                // Once deleted, start typing the default text
                setTimeout(typeDefaultText, 300);
            }
        }

        // Then, type the default text character by character
        function typeDefaultText() {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < defaultText.length) {
                    currentText += defaultText[charIndex];
                    titleElement.textContent = currentText + '|';
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    titleElement.textContent = currentText;
                    isResetting = false;
                }
            }, 80);
        }

        deleteText();
    }

    // Update text display with proper wrapping
    function updateDisplay() {
        titleElement.textContent = currentText;
    }

    // Get typing hint element
    const typingHint = document.getElementById('typing-hint');

    // Hide typing hint
    function hideTypingHint() {
        if (typingHint) {
            typingHint.style.opacity = '0';
            typingHint.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                typingHint.style.display = 'none';
            }, 500);
        }
    }

    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        // Prevent spacebar from scrolling when keyboard is focused
        if (e.key === ' ' && keyboardFocused) {
            e.preventDefault();
        }

        // Ignore input during reset animation
        if (isResetting) return;

        // Ignore navigation and system keys (but allow spacebar for typing)
        if (e.ctrlKey || e.altKey || e.metaKey ||
            ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
            return;
        }

        // Hide hint when user starts typing
        if (initialTypingComplete) {
            hideTypingHint();
        }

        clearTimeout(typingTimer);
        isTyping = true;
        keyboardFocused = true;

        if (e.key === 'Backspace') {
            // Remove last character
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                updateDisplay();
            }
        } else if (e.key === 'Enter') {
            // Add line break
            currentText += '\n';
            updateDisplay();
        } else if (e.key === ' ') {
            // Add space
            currentText += ' ';
            updateDisplay();
        } else if (e.key.length === 1) {
            // Add typed character
            if (currentText.length < 200) { // Increased limit for wrapping text
                currentText += e.key;
                updateDisplay();
            }
        }

        // Reset to default after 5 seconds of inactivity
        typingTimer = setTimeout(() => {
            isTyping = false;
            setTimeout(resetToDefault, 1000);
        }, 5000);
    });

    // Handle click to activate keyboard focus
    document.addEventListener('click', function(e) {
        keyboardFocused = true;
        setTimeout(() => {
            if (!isTyping) {
                keyboardFocused = false;
            }
        }, 3000);
    });

    // Add typing indicator effect
    let blinkInterval;
    let showCursor = false;

    function startBlinking() {
        clearInterval(blinkInterval);
        blinkInterval = setInterval(() => {
            if (isTyping || keyboardFocused) {
                showCursor = !showCursor;
                if (showCursor) {
                    titleElement.textContent = currentText + '|';
                } else {
                    titleElement.textContent = currentText;
                }
            } else {
                titleElement.textContent = currentText;
                showCursor = false;
            }
        }, 500);
    }

    startBlinking();

    // Prevent spacebar scrolling when interacting with the title area
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ' && (isTyping || keyboardFocused)) {
            e.preventDefault();
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initInteractiveTitle);

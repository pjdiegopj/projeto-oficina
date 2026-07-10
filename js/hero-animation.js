document.addEventListener('DOMContentLoaded', () => {
    const heroText = document.querySelector('.texto');
    if (!heroText) return;

    const rawText = heroText.textContent.replace(/\s+/g, ' ').trim();
    heroText.setAttribute('aria-label', rawText);
    heroText.setAttribute('role', 'text');

    const actions = [];
    
    function prepareTypewriter(currentNode) {
        const childNodes = Array.from(currentNode.childNodes);
        for (const child of childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                const fragment = document.createDocumentFragment();
                for (const char of text) {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'typewriter-char';
                    charSpan.textContent = char;
                    charSpan.style.display = 'none';
                    charSpan.setAttribute('aria-hidden', 'true');
                    fragment.appendChild(charSpan);
                    actions.push({ type: 'char', element: charSpan });
                }
                currentNode.replaceChild(fragment, child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'BR') {
                    child.style.display = 'none';
                    child.setAttribute('aria-hidden', 'true');
                    actions.push({ type: 'br', element: child });
                } else {
                    prepareTypewriter(child);
                }
            }
        }
    }

    prepareTypewriter(heroText);

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.setAttribute('aria-hidden', 'true');
    heroText.appendChild(cursor);

    let actionIndex = 0;
    const baseSpeed = 80; // base typing speed in ms
    const startDelay = 800; // delay before typing starts

    function typeNext() {
        if (actionIndex < actions.length) {
            const action = actions[actionIndex];
            
            if (action.type === 'char') {
                action.element.style.display = 'inline';
                action.element.after(cursor);
            } else if (action.type === 'br') {
                action.element.style.display = 'inline';
                action.element.after(cursor);
            }
            
            actionIndex++;

            let nextDelay = baseSpeed + (Math.random() * 40 - 20); // Add slight randomness
            
            if (action.type === 'char') {
                const char = action.element.textContent;
                if (char === ',' || char === '·') {
                    nextDelay = 400; // Pause at comma/separator
                } else if (char === ' ') {
                    nextDelay = 50; // Faster on spaces
                }
            } else if (action.type === 'br') {
                nextDelay = 500; // Longer pause before the main word on the next line
            }

            setTimeout(typeNext, nextDelay);
        } else {
            cursor.classList.add('blinking');
        }
    }

    setTimeout(typeNext, startDelay);
});

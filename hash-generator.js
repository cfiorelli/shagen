async function findMatchingHash() {
    await loadCryptoLib();

    const baseSentence = document.getElementById("baseSentence").value;
    const targetPrefix = document.getElementById("targetPrefix").value;
    let counter = 0;

    // Change the button text to indicate processing
    const button = document.querySelector('button');
    const originalButtonText = button.innerText;
    button.innerText = 'Searching...';
    button.disabled = true;  // Disable the button to prevent multiple clicks

    try {
        while (true) {
            const sentence = baseSentence.replace("{}", counter);
            const hashResult = await sha256(sentence);

            if (hashResult.startsWith(targetPrefix)) {
                document.getElementById("result").innerText = `Found a matching sentence: ${sentence}\nHash: ${hashResult}`;
                break;
            }

            // Optionally, for every 1000 iterations, update the user about the current count.
            if (counter % 1000 === 0) {
                document.getElementById("result").innerText = `Currently checking count: ${counter}`;
            }

            counter++;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").innerText = 'An error occurred during the search.';
    } finally {
        // Revert button state
        button.innerText = originalButtonText;
        button.disabled = false;
    }
}

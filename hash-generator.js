async function loadCryptoLib() {
    if (window.crypto && window.crypto.subtle) {
        return;
    }
    await import("https://cdnjs.cloudflare.com/ajax/libs/webcrypto-shim/0.1.4/webcrypto-shim.js");
}

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function findMatchingHash() {
    await loadCryptoLib();
    
    const baseSentence = document.getElementById("baseSentence").value;
    const targetPrefix = document.getElementById("targetPrefix").value;
    let counter = 0;
    
    while (true) {
        const sentence = baseSentence.replace("{}", counter);
        const hashResult = await sha256(sentence);
        
        if (hashResult.startsWith(targetPrefix)) {
            document.getElementById("result").innerText = `Found a matching sentence: ${sentence}\nHash: ${hashResult}`;
            break;
        }
        counter++;
    }
}

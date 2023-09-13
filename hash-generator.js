// This function remains unchanged, used for both live hashing and the worker
async function sha256(message) {
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// For live hashing
async function liveHash() {
  const sentence = document.getElementById("baseSentence").value;
  const hash = await sha256(sentence);
  document.getElementById("liveHashResult").innerText = hash;
}

function findMatchingHash() {
    const baseSentence = document.getElementById("baseSentence").value;
    const targetPrefix = document.getElementById("targetPrefix").value;

    const worker = new Worker('hashWorker.js');
    worker.postMessage({ 
      baseSentence: baseSentence, 
      targetPrefix: targetPrefix, 
      start: 0, 
      end: 500000 
    });

    worker.onmessage = function(e) {
      const { type, count, hash } = e.data;
      if (type === 'progress') {
        document.getElementById("result").innerText = `Count: ${count}, Hash: ${hash}`;
      }
    }
}

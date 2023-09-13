self.addEventListener('message', async function(e) {
    const { baseSentence, targetPrefix, start, end } = e.data;
  
    for (let i = start; i < end; i++) {
      const sentence = baseSentence.replace("{}", i);
      const hashResult = await sha256(sentence);
  
      if (hashResult.startsWith(targetPrefix)) {
        self.postMessage({ type: 'progress', count: i, hash: hashResult });
        break;  // If found, break out of the loop
      }
  
      // Optionally, for every 1000 iterations, update the user about the current count.
      if (i % 1000 === 0) {
        self.postMessage({ type: 'progress', count: i, hash: hashResult });
      }
    }
  }, false);
  
  // This is the same hashing function used in hash-generator.js, copied here for the worker.
  async function sha256(message) {
      const msgBuffer = new TextEncoder('utf-8').encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
  }
  
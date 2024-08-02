self.onmessage = function(event) {
    if (event.data === 'start') {
        self.intervalId = setInterval(() => {
            self.postMessage('tick');
        }, 1000); // Adjust the interval time as needed
    } else if (event.data === 'stop') {
        clearInterval(self.intervalId);
    }
};
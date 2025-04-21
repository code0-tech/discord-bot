const fs = require('fs');
const CDP = require('chrome-remote-interface');
const { memoryUsage } = process;

function shouldDumpSnapshot() {
    const used = memoryUsage().heapUsed;
    const total = memoryUsage().heapTotal;
    const percent = (used / total) * 100;
    return true;  // You can adjust this threshold
}

async function takeHeapSnapshot(filePath) {
    try {
        console.log('Connecting to Chrome Debugger...');
        const client = await CDP({ port: 9229 });
        const { HeapProfiler } = client;

        // Enable Heap Profiler and collect garbage before taking snapshot
        await HeapProfiler.enable();
        console.log('Heap Profiler enabled');
        await HeapProfiler.collectGarbage();  // Trigger garbage collection before snapshot
        console.log('Garbage collection triggered');

        // Wait a moment to ensure the snapshot can be created
        await new Promise(resolve => setTimeout(resolve, 1000));  // 1 second delay

        // Request a heap snapshot from V8
        const response = await HeapProfiler.takeHeapSnapshot();
        console.log('Heap Snapshot Response:');  // Log the response
        console.dir(response, { depth: null })

        // Check if profile and stream exist before attempting to write
        if (!response || !response.profile || !response.profile.stream) {
            console.error('❌ Failed to retrieve valid heap snapshot. Profile or stream is missing.');
            client.close();  // Close the connection to avoid hanging
            return;
        }

        const { profile } = response;
        const file = fs.createWriteStream(filePath);

        // Write the snapshot data to the file
        profile.stream.on('data', (chunk) => {
            console.log('Writing chunk of data to file...');
            file.write(chunk);
        });

        // Close the file and connection once the stream ends
        profile.stream.on('end', () => {
            console.log(`✅ Snapshot saved to: ${filePath}`);
            file.end(); // End the file stream
            client.close(); // Close the connection to Chrome
        });

        profile.stream.on('error', (err) => {
            console.error(`❌ Error writing snapshot data: ${err}`);
            client.close(); // Ensure connection is closed on error
        });

    } catch (err) {
        console.error(`❌ Error while taking heap snapshot: ${err}`);
    }
}

// Check every 15 seconds whether to dump a snapshot
setInterval(async () => {
    if (shouldDumpSnapshot()) {
        console.log('⚠️ High memory detected! Dumping snapshot...');
        await takeHeapSnapshot(`./heap-${Date.now()}.heapsnapshot`);
    }
}, 15000);

// node --inspect=9229 index.js
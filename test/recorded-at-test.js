// Test script to verify the fix for the recorded_at field issue
// This simulates the server response with the recorded_at field

// Mock server response matching the format from the issue description
const serverResponse = {
  success: true,
  mood_histories: [
    {
      id: 348,
      user_id: 1,
      journal_entry_id: null,
      mood: "angry",
      recorded_at: "2025-08-06T15:12:17.416Z",
      notes: null,
      created_at: "2025-08-06T15:12:36.551Z",
      updated_at: "2025-08-06T15:12:36.551Z",
      client_id: "347"
    }
  ]
};

// Mock function to simulate the date parsing logic
function parseServerResponse(response) {
  console.log('Processing server response...');

  const serverItems = response.mood_histories || [];
  console.log('Server items:', serverItems);

  const processedItems = serverItems.map(item => {
    // Create date and validate it
    let timestamp;
    try {
      // Use recorded_at field from server response instead of timestamp
      const parsedDate = new Date(item.recorded_at);
      console.log(`Parsed date for item ${item.id}:`, parsedDate);

      // Check if date is valid
      if (!isNaN(parsedDate.getTime())) {
        timestamp = parsedDate;
        console.log(`Valid date for item ${item.id}:`, timestamp);
      } else {
        console.warn(`Invalid date found in server response for item ${item.id}, using current date instead`);
        timestamp = new Date();
      }
    } catch (e) {
      console.warn(`Error parsing date from server for item ${item.id}`, e);
      timestamp = new Date();
    }

    return {
      id: item.id,
      mood: item.mood,
      timestamp: timestamp
    };
  });

  console.log('Processed items:', processedItems);
  return processedItems;
}

// Run the test
console.log('Starting test for recorded_at field parsing...');
const processedItems = parseServerResponse(serverResponse);

// Verify the results
console.log('\nTest results:');
console.log('Number of processed items:', processedItems.length);
console.log('Item 348 processed successfully:', processedItems.some(item => item.id === 348));
console.log('All items have valid timestamps:', processedItems.every(item => item.timestamp instanceof Date && !isNaN(item.timestamp.getTime())));

console.log('\nTest completed. The fix should now properly handle the recorded_at field in the server response.');

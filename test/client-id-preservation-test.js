// Test script to verify client ID preservation during synchronization
// This simulates the server response with both server IDs and client IDs

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
    },
    {
      id: 349,
      user_id: 1,
      journal_entry_id: null,
      mood: "happy",
      recorded_at: "2025-08-06T16:00:00.000Z",
      notes: null,
      created_at: "2025-08-06T16:01:00.000Z",
      updated_at: "2025-08-06T16:01:00.000Z",
      client_id: "local-123"
    },
    {
      id: 350,
      user_id: 1,
      journal_entry_id: null,
      mood: "sad",
      recorded_at: "2025-08-06T16:30:00.000Z",
      notes: null,
      created_at: "2025-08-06T16:31:00.000Z",
      updated_at: "2025-08-06T16:31:00.000Z"
      // No client_id for this item to test fallback behavior
    }
  ]
};

// Mock function to simulate the ID mapping logic
function processServerResponse(response) {
  console.log('Processing server response...');

  const serverItems = response.mood_histories || [];
  console.log('Server items:', serverItems);

  const processedItems = serverItems.map(item => {
    // Create date and validate it
    let timestamp;
    try {
      // Use recorded_at field from server response
      const parsedDate = new Date(item.recorded_at);

      // Check if date is valid
      if (!isNaN(parsedDate.getTime())) {
        timestamp = parsedDate;
      } else {
        console.warn(`Invalid date found in server response for item ${item.id}, using current date instead`);
        timestamp = new Date();
      }
    } catch (e) {
      console.warn(`Error parsing date from server for item ${item.id}`, e);
      timestamp = new Date();
    }

    // Use client_id if available, otherwise fall back to server id
    return {
      id: item.client_id || item.id, // Preserve client ID instead of using server ID
      mood: item.mood,
      timestamp: timestamp
    };
  });

  console.log('Processed items:', processedItems);
  return processedItems;
}

// Run the test
console.log('Starting test for client ID preservation...');
const processedItems = processServerResponse(serverResponse);

// Verify the results
console.log('\nTest results:');
console.log('Number of processed items:', processedItems.length);

// Check if client IDs are preserved
const item1 = processedItems.find(item => item.id === "347");
console.log('Item with client_id "347" found:', !!item1);
if (item1) {
  console.log('Item details:', item1);
}

const item2 = processedItems.find(item => item.id === "local-123");
console.log('Item with client_id "local-123" found:', !!item2);
if (item2) {
  console.log('Item details:', item2);
}

// Check fallback behavior for item without client_id
// Note: The server id might be a number, not a string
const item3 = processedItems.find(item => item.id === 350 || item.id === "350");
console.log('Item with server id 350 (no client_id) found:', !!item3);
if (item3) {
  console.log('Item details:', item3);
}

console.log('\nTest completed. The fix should now properly preserve client IDs during synchronization.');

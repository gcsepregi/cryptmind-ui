// Simple test script to verify mood history synchronization
// This is a conceptual test that demonstrates how the synchronization would work

// Mock server data - what the server will return from the sync endpoint
const serverResponse = [
  {
    id: 'local-1', // Server now has the local item after sync
    mood: 'love',
    recorded_at: '2025-08-06T09:00:00.000Z',
    client_id: 'local-1'
  },
  {
    id: 'server-1',
    mood: 'happy',
    recorded_at: '2025-08-05T10:00:00.000Z'
  },
  {
    id: 'server-2',
    mood: 'sad',
    recorded_at: '2025-08-04T15:30:00.000Z'
  }
];

// Mock local data
const localMoodHistories = [
  {
    id: 'local-1',
    mood: 'love',
    timestamp: '2025-08-06T09:00:00.000Z'
  },
  {
    id: 'server-2', // This one exists on both server and local
    mood: 'sad',
    timestamp: '2025-08-04T15:30:00.000Z'
  }
];

// Mock HTTP client
const mockHttp = {
  post: (url, data) => {
    console.log(`POST request to ${url} with data:`, JSON.stringify(data, null, 2));

    // Check if this is a sync request
    if (url.includes('/mood_histories/sync')) {
      console.log('Processing sync request...');

      // Return the server's synchronized data
      return {
        pipe: () => {
          // In the real implementation, we'd have catchError and map operators
          // Here we just simulate the final result
          return {
            subscribe: (callback) => {
              if (typeof callback === 'function') {
                // Convert timestamps to Date objects to match the real implementation
                const processedResponse = serverResponse.map(item => ({
                  id: item.id,
                  mood: item.mood,
                  timestamp: new Date(item.timestamp)
                }));

                callback(processedResponse);
              } else if (callback && typeof callback.next === 'function') {
                // Handle observer object pattern
                const processedResponse = serverResponse.map(item => ({
                  id: item.id,
                  mood: item.mood,
                  timestamp: new Date(item.timestamp)
                }));

                callback.next(processedResponse);
              } else {
                console.error('Invalid callback provided to subscribe');
              }
            }
          };
        }
      };
    }

    // For other POST requests
    return {
      pipe: () => {
        return {
          subscribe: (callback) => {
            if (typeof callback === 'function') {
              callback({ success: true });
            } else if (callback && typeof callback.next === 'function') {
              callback.next({ success: true });
            }
          }
        };
      }
    };
  }
};

// Mock MoodService
class MockMoodService {
  constructor() {
    // For mood history
    this.moodHistorySubject = {
      value: localMoodHistories,
      next: (data) => {
        this.moodHistorySubject.value = data;
        console.log('Updated mood history subject with:', data.length, 'items');
      }
    };

    // For current mood
    this.moodSubject = {
      value: null,
      next: (data) => {
        this.moodSubject.value = data;
        console.log('Updated current mood subject with:', data ? data.mood : 'null');
      }
    };

    this.http = mockHttp;
    this.baseUrl = 'http://localhost:3000';

    // Constants
    this.MOOD_EXPIRY_HOURS = 12;
  }

  // Simplified version of the updateLocalStorageWithServerItems method
  updateLocalStorageWithServerItems(serverItems) {
    console.log('Updating local storage with server items...');

    if (!serverItems || serverItems.length === 0) {
      console.warn('No server items received during sync');
      return;
    }

    // Sort items by timestamp (newest first)
    const sortedItems = [...serverItems].sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    console.log('Sorted server items:', sortedItems);

    // Update the subject with server items
    this.moodHistorySubject.next(sortedItems);

    // Update current mood with the most recent mood from server
    if (sortedItems.length > 0) {
      const mostRecentMood = sortedItems[0];
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() - this.MOOD_EXPIRY_HOURS);

      // Only update current mood if the most recent mood is within the expiry period
      if (mostRecentMood.timestamp >= expiryTime) {
        const moodData = {
          mood: mostRecentMood.mood,
          timestamp: mostRecentMood.timestamp
        };

        // Update the mood subject
        this.moodSubject.next(moodData);

        console.log('Updated current mood from server sync:', moodData.mood);
      } else {
        console.log('Most recent mood is expired, not updating current mood');
      }
    }

    console.log(`Synchronized ${serverItems.length} mood history items with server`);
  }

  // Simplified version of the syncMoodHistories method
  syncMoodHistories() {
    console.log('Syncing mood histories...');

    // Get local items to send to the server
    const localItems = this.moodHistorySubject.value;

    // Format local items for the server
    const formattedItems = localItems.map(item => {
      return {
        id: item.id,
        mood: item.mood,
        timestamp: item.timestamp instanceof Date ?
          item.timestamp.toISOString() :
          new Date(item.timestamp).toISOString(),
        recorded_at: item.timestamp instanceof Date ?
          item.timestamp.toISOString() :
          new Date(item.timestamp).toISOString()
      };
    });

    // Use the dedicated sync endpoint
    const response = this.http.post(`${this.baseUrl}/mood_histories/sync`, {
      mood_histories: formattedItems
    });

    // Process the response
    return {
      subscribe: (observerOrNext) => {
        // Handle both callback function and observer object
        if (typeof observerOrNext === 'function') {
          response.pipe().subscribe(observerOrNext);
        } else if (observerOrNext && typeof observerOrNext.next === 'function') {
          response.pipe().subscribe({
            next: (data) => {
              // Process the data and update local storage
              this.updateLocalStorageWithServerItems(data);
              observerOrNext.next(data);
            },
            error: observerOrNext.error || ((err) => console.error(err)),
            complete: observerOrNext.complete || (() => {
            })
          });
        } else {
          console.log('Empty subscribe call, processing sync anyway');
          response.pipe().subscribe(data => {
            this.updateLocalStorageWithServerItems(data);
          });
        }
      }
    };
  }

  // Test the synchronization
  testSync() {
    console.log('Starting sync test...');
    console.log('Initial local mood histories:', this.moodHistorySubject.value);
    console.log('Initial current mood:', this.moodSubject.value);

    this.syncMoodHistories().subscribe(() => {
      console.log('Final local mood histories after sync:', this.moodHistorySubject.value);
      console.log('Final current mood after sync:', this.moodSubject.value);

      // Verify the results
      const finalIds = new Set(this.moodHistorySubject.value.map(item => item.id));
      console.log('Final IDs in local storage:', [...finalIds]);

      // Check if all server items are in local storage
      const allServerItemsInLocal = serverResponse.every(item => finalIds.has(item.id));
      console.log('All server items in local storage:', allServerItemsInLocal);

      // Verify current mood is set to the most recent mood from server
      if (this.moodSubject.value) {
        const mostRecentMood = this.moodHistorySubject.value[0];
        const currentMoodMatches =
          this.moodSubject.value.mood === mostRecentMood.mood &&
          this.moodSubject.value.timestamp.getTime() === mostRecentMood.timestamp.getTime();

        console.log('Current mood matches most recent mood from server:', currentMoodMatches);

        if (!currentMoodMatches) {
          console.error('Current mood does not match most recent mood from server!');
          console.error('Current mood:', this.moodSubject.value);
          console.error('Most recent mood:', mostRecentMood);
        }
      } else {
        console.warn('Current mood is not set after sync!');
      }
    });
  }

  // Simulate adding a new mood
  addMood(mood, date) {
    console.log(`Adding mood: ${mood} at ${date}`);

    // Create a new history item
    const historyItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      mood,
      timestamp: date
    };

    // Get current history
    const currentHistory = this.moodHistorySubject.value;

    // Add new item to the beginning of the array
    const updatedHistory = [historyItem, ...currentHistory];

    // Update the subject
    this.moodHistorySubject.next(updatedHistory);

    console.log('Local history updated, syncing with server...');

    // Sync with server
    this.syncMoodHistories().subscribe();
  }
}

// Run the test
const moodService = new MockMoodService();
moodService.testSync();

// Test adding a new mood
setTimeout(() => {
  console.log('\n--- Testing adding a new mood ---');
  moodService.addMood('good', new Date());
}, 1000);

console.log('\nTest completed. In a real implementation:');
console.log('1. The MoodService syncs with the server on startup');
console.log('2. All mood operations (add, update, delete) trigger a sync with the server');
console.log('3. The sync endpoint handles bidirectional synchronization in a single request');
console.log('4. The server response becomes the source of truth for the local storage');

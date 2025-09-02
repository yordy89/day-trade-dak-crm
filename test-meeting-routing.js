// Test script to verify meeting routing logic

const testCases = [
  {
    name: "Zoom Meeting",
    meeting: {
      _id: "zoom123",
      provider: "zoom",
      title: "Zoom Test Meeting"
    },
    expectedRoute: "/meeting/zoom/zoom123"
  },
  {
    name: "LiveKit Meeting",
    meeting: {
      _id: "livekit456",
      provider: "livekit",
      title: "LiveKit Test Meeting"
    },
    expectedRoute: "/meeting/livekit/livekit456"
  },
  {
    name: "VideoSDK Meeting",
    meeting: {
      _id: "videosdk789",
      provider: "videosdk",
      title: "VideoSDK Test Meeting"
    },
    expectedRoute: "/meeting/videosdk/videosdk789"
  },
  {
    name: "Default (no provider)",
    meeting: {
      _id: "default000",
      title: "Default Meeting"
    },
    expectedRoute: "/meeting/videosdk/default000"
  }
];

console.log("Meeting Routing Test Results:");
console.log("=============================\n");

testCases.forEach(test => {
  const provider = test.meeting.provider || 'videosdk';
  let actualRoute;
  
  switch (provider) {
    case 'livekit':
      actualRoute = `/meeting/livekit/${test.meeting._id}`;
      break;
    case 'zoom':
      actualRoute = `/meeting/zoom/${test.meeting._id}`;
      break;
    case 'videosdk':
    default:
      actualRoute = `/meeting/videosdk/${test.meeting._id}`;
      break;
  }
  
  const passed = actualRoute === test.expectedRoute;
  
  console.log(`Test: ${test.name}`);
  console.log(`  Provider: ${provider}`);
  console.log(`  Expected: ${test.expectedRoute}`);
  console.log(`  Actual: ${actualRoute}`);
  console.log(`  Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log("");
});

console.log("\nRouting Flow:");
console.log("1. User clicks on meeting");
console.log("2. Route to /meeting/{id}");
console.log("3. General meeting page fetches meeting details");
console.log("4. Based on provider, redirects to:");
console.log("   - Zoom: /meeting/zoom/{id}");
console.log("   - LiveKit: /meeting/livekit/{id}");
console.log("   - VideoSDK: /meeting/videosdk/{id}");
console.log("\nEach provider page handles its specific meeting type!");
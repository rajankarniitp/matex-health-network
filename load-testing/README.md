
# Load Testing with k6

## Setup
1. Install k6: https://k6.io/docs/get-started/installation/
2. Update the BASE_URL in k6-script.js to your actual domain
3. Run the test: `k6 run k6-script.js`

## Alternative: Apache JMeter
1. Download JMeter: https://jmeter.apache.org/
2. Create a test plan with:
   - Thread Group (configure users, ramp-up, loop count)
   - HTTP Request samplers for different pages
   - Listeners to view results
3. Save and run your test plan

## Recommended Test Scenarios
- Homepage load test
- User registration/login flow
- API endpoints (if available)
- Static resource loading
- Database queries (if applicable)

## Metrics to Monitor
- Response time (average, 95th percentile)
- Error rate
- Throughput (requests per second)
- Resource utilization

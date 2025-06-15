
import http from 'k6/http';
import { check, sleep } from 'k6';

// Load testing configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users over 30 seconds
    { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = 'https://matex-health-network.lovable.app'; // Replace with your actual URL

export default function () {
  // Test homepage
  let response = http.get(BASE_URL);
  check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in reasonable time': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test other pages
  const pages = ['/about', '/features', '/pricing', '/contact'];
  const randomPage = pages[Math.floor(Math.random() * pages.length)];
  
  response = http.get(`${BASE_URL}${randomPage}`);
  check(response, {
    'page status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

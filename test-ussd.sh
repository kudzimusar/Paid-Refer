#!/bin/bash
curl -X POST http://localhost:5000/public/ussd/callback \
     -H "Content-Type: application/json" \
     -d '{
       "sessionId": "test-session-123",
       "serviceCode": "*788#",
       "phoneNumber": "+263770000000",
       "text": ""
     }'

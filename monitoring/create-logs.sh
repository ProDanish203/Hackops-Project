#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

echo $BASE_URL

ENDPOINTS=(
    "/"
    "/category"
    "/product"
    "/users/current-user"
)

make_random_request() {
    local endpoint=${ENDPOINTS[$RANDOM % ${#ENDPOINTS[@]}]}
    curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint"
}

for ((i=1; i<=1000; i++)); do
    make_random_request
    echo "Request $i completed"
    sleep 0.1
done

echo "Completed 1000 requests"
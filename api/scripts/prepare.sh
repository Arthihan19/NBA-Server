#!/bin/bash

# Check if PostgreSQL is already running on port 5432
if ! netstat -tuln | grep -q ':5432'; then
    # Start docker-compose services
    docker-compose up -d

    # Delay to ensure services are fully up (can be adjusted)
    sleep 5
fi

# Execute the original command passed as arguments
"$@"

#!/bin/bash
# scripts/test-redis.sh
set -e
redis-cli -h redis -p 6379 ping

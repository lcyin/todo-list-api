#!/bin/bash

# PostgreSQL Database Management Script for Todo List API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_message "Error: Docker is not running. Please start Docker first." "$RED"
        exit 1
    fi
}

# Function to start the database
start_db() {
    print_message "Starting PostgreSQL database..." "$YELLOW"
    check_docker
    
    if docker-compose up -d postgres; then
        print_message "✅ PostgreSQL database started successfully!" "$GREEN"
        print_message "Database connection details:" "$YELLOW"
        echo "  Host: localhost"
        echo "  Port: 5432"
        echo "  Database: todolist"
        echo "  User: todouser"
        echo "  Password: todopass"
        echo ""
        print_message "Waiting for database to be ready..." "$YELLOW"
        
        # Wait for database to be healthy
        timeout=60
        while [ $timeout -gt 0 ]; do
            if docker-compose exec postgres pg_isready -U todouser -d todolist > /dev/null 2>&1; then
                print_message "✅ Database is ready!" "$GREEN"
                break
            fi
            sleep 2
            timeout=$((timeout - 2))
        done
        
        if [ $timeout -le 0 ]; then
            print_message "⚠️  Warning: Database might not be fully ready yet." "$YELLOW"
        fi
    else
        print_message "❌ Failed to start PostgreSQL database." "$RED"
        exit 1
    fi
}

# Function to stop the database
stop_db() {
    print_message "Stopping PostgreSQL database..." "$YELLOW"
    check_docker
    
    if docker-compose down; then
        print_message "✅ PostgreSQL database stopped successfully!" "$GREEN"
    else
        print_message "❌ Failed to stop PostgreSQL database." "$RED"
        exit 1
    fi
}

# Function to reset the database (stop, remove volume, start)
reset_db() {
    print_message "Resetting PostgreSQL database..." "$YELLOW"
    check_docker
    
    print_message "Stopping and removing containers and volumes..." "$YELLOW"
    docker-compose down -v
    
    print_message "Starting fresh database..." "$YELLOW"
    start_db
    
    print_message "✅ Database reset completed!" "$GREEN"
}

# Function to show database status
status_db() {
    print_message "Checking PostgreSQL database status..." "$YELLOW"
    check_docker
    
    if docker-compose ps postgres | grep -q "Up"; then
        print_message "✅ PostgreSQL database is running" "$GREEN"
        
        # Check if database is ready
        if docker-compose exec postgres pg_isready -U todouser -d todolist > /dev/null 2>&1; then
            print_message "✅ Database is ready for connections" "$GREEN"
        else
            print_message "⚠️  Database is starting up..." "$YELLOW"
        fi
    else
        print_message "❌ PostgreSQL database is not running" "$RED"
    fi
}

# Function to connect to database
connect_db() {
    print_message "Connecting to PostgreSQL database..." "$YELLOW"
    check_docker
    
    docker-compose exec postgres psql -U todouser -d todolist
}

# Function to show logs
logs_db() {
    print_message "Showing PostgreSQL database logs..." "$YELLOW"
    check_docker
    
    docker-compose logs -f postgres
}

# Function to show help
show_help() {
    echo "PostgreSQL Database Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start    Start the PostgreSQL database"
    echo "  stop     Stop the PostgreSQL database"
    echo "  restart  Restart the PostgreSQL database"
    echo "  reset    Reset the database (removes all data)"
    echo "  status   Show database status"
    echo "  connect  Connect to the database via psql"
    echo "  logs     Show database logs"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start     # Start the database"
    echo "  $0 status    # Check if database is running"
    echo "  $0 connect   # Connect to database with psql"
}

# Main script logic
case "${1:-help}" in
    start)
        start_db
        ;;
    stop)
        stop_db
        ;;
    restart)
        stop_db
        start_db
        ;;
    reset)
        reset_db
        ;;
    status)
        status_db
        ;;
    connect)
        connect_db
        ;;
    logs)
        logs_db
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_message "Error: Unknown command '$1'" "$RED"
        echo ""
        show_help
        exit 1
        ;;
esac

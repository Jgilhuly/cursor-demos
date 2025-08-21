#!/bin/bash

echo "🚀 Learning Management System (LMS) Demo"
echo "========================================"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java version: $(java -version 2>&1 | head -n 1)"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6+."
    exit 1
fi

echo "✅ Maven version: $(mvn -version | head -n 1)"
echo ""

# Select an available port (default 8080, fallback 8081)
PORT="${PORT:-8080}"
if lsof -ti tcp:${PORT} >/dev/null 2>&1; then
    echo "⚠️  Port ${PORT} is in use. Trying 8081..."
    PORT=8081
    if lsof -ti tcp:${PORT} >/dev/null 2>&1; then
        echo "❌ Ports 8080 and 8081 are in use. Set PORT to a free port and retry."
        exit 1
    fi
fi

# Build the project
echo "🔨 Building the project..."
mvn clean install -q

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🚀 Starting the LMS application..."
echo ""

# Run the application in background
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=${PORT}" -q &
APP_PID=$!

# Wait for application to start
echo "⏳ Waiting for application to start on port ${PORT}..."
STARTED=0
for i in {1..60}; do
    if curl -sf "http://localhost:${PORT}/api/courses" >/dev/null; then
        STARTED=1
        break
    fi
    sleep 1
done

# Check if application is running
if [ "$STARTED" -eq 1 ]; then
    echo "✅ Application is running!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   - API Base: http://localhost:${PORT}/api"
    echo "   - Courses: http://localhost:${PORT}/api/courses"
    echo "   - H2 Console: http://localhost:${PORT}/h2-console"
    echo ""
    echo "📊 Sample Data:"
    echo "   - Admin: admin@lms.com / admin123"
    echo "   - Instructor: instructor@lms.com / instructor123"
    echo "   - Student: student1@lms.com / student123"
    echo ""
    echo "🧪 Testing the API..."
    
    # Test API endpoints
    echo "📚 Available courses:"
    curl -s "http://localhost:${PORT}/api/courses" | jq '.[0:2] | .[] | {id, title, code}' 2>/dev/null || echo "   (Install jq for better JSON formatting)"
    
    echo ""
    echo "🔍 Search for Java courses:"
    curl -s "http://localhost:${PORT}/api/courses/search?q=Java" | jq '.[0:2] | .[] | {id, title, code}' 2>/dev/null || echo "   (Install jq for better JSON formatting)"
    
    echo ""
    echo "⏹️  Press Ctrl+C to stop the application"
    
    # Wait for user to stop
    wait $APP_PID
else
    echo "❌ Application failed to start!"
    kill $APP_PID 2>/dev/null
    exit 1
fi

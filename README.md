# Kafka UI
It's UI for Kafka Orchestration.

## Getting Started

It support UI and REST endpoint for Create/Delete/Update Service.

### Building
docker build -t kafkaui:1.0 -f Dockerfile .

### Running
docker run -p 8090:8090 kafkaui:1.0

## UI

http://localhost:8090

## Curl Commands

curl http://localhost:8090/api/services/

curl -X POST http://localhost:8090/api/services -H "Content-Type: application/json" -d '{"name":"TestNaman", "shape": "High Throughput"}'

curl http://localhost:8090/api/services/TestNaman

curl -X PUT http://localhost:8090/api/services/TestNaman -H "Content-Type: application/json" -d '{"shape":"High Avaibility"}'

curl -X PUT http://localhost:8090/api/services/TestNaman -H "Content-Type: application/json" -d '{"status":"Running", "endpoint":"http://test.com"}'

curl -X DELETE http://localhost:8090/api/services/TestNaman

## Authors
* **Naman Mehta (naman.mehta@oracle.com)**

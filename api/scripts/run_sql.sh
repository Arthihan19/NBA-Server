DB_NAME="todo"
DB_USER="postgres"
DB_PASS="postgres"
DB_HOST="localhost"
DB_PORT="5432"

PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -a -f ../sql/todos.sql
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -a -f ../sql/test-data.sql

echo "Test data inserted."
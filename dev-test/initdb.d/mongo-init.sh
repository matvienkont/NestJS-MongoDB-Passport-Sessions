set -e

mongosh <<EOF
use dev-test

db.createUser(
  {
    user: "${MONGO_INITDB_USER}",
    pwd: "${MONGO_INITDB_PWD}",
    roles: [ { role: "readWrite", db: "${MONGO_INITDB_DATABASE}" } ]
  }
)
// EOF
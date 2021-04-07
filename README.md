# cratedb-driver for cube.js

> fork form official pg driver and do some change 

## Some Notes

current not merge info official packages,should add some more config 
for cube.js

* .env

```code
CUBEJS_DB_HOST=localhost
CUBEJS_DB_NAME=materialize
CUBEJS_DB_USER=materialize
CUBEJS_DB_PASS=
CUBEJS_WEB_SOCKETS=true
CUBEJS_DB_PORT=6875
CUBEJS_DEV_MODE=true
CUBEJS_DB_TYPE=materialize
```

* cube.js

```code
const {MaterializeDriver,MaterializeQuery} = require("@dalongrong/materialize-driver")
module.exports = {
    dialectFactory: (dataSource) => {
        // need config  datasource  for multitenant env
        return MaterializeQuery
    },
    dbType: ({ dataSource } = {}) => {
        return "materialize"
    },
    driverFactory: ({ dataSource } = {}) => {
        return new MaterializeDriver({})
    }
};
```

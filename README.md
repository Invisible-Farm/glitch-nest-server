## glitch-nest-server Service.

This is a nest server implemented based on the nodejs.
The main service of this server is to receive a minting request from a user, determine whether the user is a valid user through sigverifier.sol, and give the user a mint.

PropertiesFile
------------
To run the service, please create an `.env` file under the root directory. Fill in the empty fields with the following information:

	# nest server configuration
    SERVER_PORT=

    POLYGON_NETWORK=
    POLYGON_CHAIN_ID=
    POLYGON_NODE_URL=

    GFT_ADDRESS=
    IFT_ADDRESS=
    PSBT_ADDRESS=
    VERIFIER_ADDRESS=

    OWNER_ADDRESS=
    OWNER_PRIV=


Dependencies
------------
This service has dependencies on other services.

- IVFM Front: https://github.com/Invisible-Farm/glitch-frontend
- IVFM Contract: https://github.com/Invisible-Farm/glitch-contract
- IVFM Verifier: https://github.com/Invisible-Farm/glitch-verifier-server
- PostgreSQL: https://www.postgresql.org/

Building
--------
	npm clean
	npm install
    npm run start


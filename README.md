<h1 align="center">
  NodeJS MySQL Connector Example
</h1>

This project is an example of a MySQL Connector for Wix Data external connectors.

You can use this project **as a basis** for deploying your own connector to the Google AppEngine. This project contains an example basic implementation of a Wix Data connector that has filtering, authorization and error handling support.

## Installation

In order to use this example, you need to define your own _configuration_ for the connector. These settings will be deployed alongside your Node artifact on the engine of your choice.

### Cloning

To start off, clone this repository on your local machine:

```
git clone <repository url>
```

### Configuration

The configuration must be stored in a file `config.json` at the root of the package. This file is not present after cloning, so let's kick things off by creating one of your own.

The configuration is a JSON object that contains three **required** keys at the root:

- `secretKey` must contain the secret key that you will use when configuring the connector in the Wix Editor. Each request to your connector will contain this secret key under the _requestContext_ key within the payload.
- `allowedOperations` lists all the operations that this connector will be allowed to perform. For example, if you want to create a connector that allows read-only access, you can limit these operations to `["get", "find", "count"]`.
- `sqlConfig` defines the configuration that will be used to connect to your SQL instance. If you are using Google Cloud SQL as your MySQL hosting solution, the format will be similar to the one shown in the example configuration file. All available configuration options are documented in the [mysqljs/mysql](https://github.com/mysqljs/mysql#connection-options) driver repository.

An example configuration can be found in `config.example.json` file.

### Instance Size

The default AppEngine instance size that this connector runs on is configured to be **F4_1G**. It works well for large tables of several gigabytes or larger and executing complex and large queries.

If you have a smaller database, you may benefit from choosing a smaller instance type (thus costing less). All the available instance types are documented in the [Google AppEngine Pricing](https://cloud.google.com/appengine/pricing) page. You can change the instance type in `app.yaml` file at the root of the project.

## Deployment

- Install the [Google Cloud SDK](https://cloud.google.com/sdk/) for your operating system;
- Acquire local credentials;

  	```gcloud auth application-default login```

- Run deployment command in your connector project folder.

  	```npm run deploy```

- After deployment, access your service at `https://mysql-connector-dot-<project name>.appspot.com/`

## Extensions

### Schemas

The schemas are loaded dynamically from the configured database.

Currently, the driver supports these MySQL basic datatypes: `varchar`, `text`, `decimal`, `bigint`, `int`, `tinyint`, `time`, `datetime`, `json`. For all other datatypes, it defaults to the Wix Data `object` datatype.

This support can be extended by implementing additional handlers for required datatypes in the `service/support/table-converter` module.

### Authentication

Currently, the driver has authentication in the form of a _secret key_ (see documentation above).

It gets deployed together with the connector to Google AppEngine. Every request made to the connector is then verified against the secret key.

The authentication functionality can be further extended by modifying the `utils/auth-middleware.js` file.

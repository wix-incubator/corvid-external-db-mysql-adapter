<h2 align="center">
  Corvid by Wix Example: External Database Collection Adapter
</h1>

This project is a Node.js based example of an external database collection adapter for MySQL databases, implemented on a Corvid by Wix site.

You can use this project as a basis for deploying your own adapter to the Google AppEngine. This project contains an example implementation of the external database collection SPI that has filtering, authorization and error handling support.

## Installation

To use this example, you need to define your own _configuration_ for your adapter. These settings will be deployed alongside your Node artifact on the engine of your choice.

### Cloning

To work with this example clone this repository on your local machine:

```
git clone git@github.com:wix/corvid-external-db-mysql-adapter.git
```

### Configuration

The configuration must be stored in a `config.json` file at the root of the package. This file is not duplicated in the cloning process, so let's create one of your own.

The configuration is a JSON object that contains three required keys at the root:

- `secretKey`: The secret key that you will use when configuring the adapter in the Wix Editor. Each request to your adapter will contain this secret key in the _requestContext_ key inside the payload.
- `allowedOperations`: The list of all the operations that this adapter will be allowed to perform. For example, if you want to create an adapter that allows read-only access, you can limit these operations to `["get", "find", "count"]`.
- `sqlConfig`: The configuration that will be used to connect to your SQL instance. If you are using Google Cloud SQL as your MySQL hosting solution, the format will be similar to the one shown in the example configuration file. All available configuration options are documented in the [mysqljs/mysql](https://github.com/mysqljs/mysql#connection-options) driver repository.

An example configuration can be found in `config.example.json` file.

### Instance Size

The default AppEngine instance size that this adapter runs on is configured to be F4_1G. It works well for large tables of several gigabytes or larger and executing complex and large queries.

If you have a smaller database, you may want to choose a smaller instance type which can cost less. All the available instance types are documented in the [Google AppEngine Pricing](https://cloud.google.com/appengine/pricing) page. You can change the instance type in `app.yaml` file at the root of the project.

## Deployment

- Install the [Google Cloud SDK](https://cloud.google.com/sdk/) for your operating system;
- Acquire local credentials;

      gcloud auth application-default login

- Run the deployment command in your adapter project folder.

      npm run deploy

- After you deploy, access your service at `https://mysql-adapter-dot-<project name>.appspot.com/`

## Extensions

### Schemas

The schemas are loaded dynamically from the configured database.

Currently, the driver supports these MySQL basic datatypes:
* `varchar`,
* `text`,
* `decimal`,
* `bigint`,
* `int`,
* `tinyint`,
* `time`,
* `datetime`,
* `json`.

For all other datatypes, it defaults to the Wix Data `object` datatype.

This support can be extended by implementing additional handlers for required datatypes in the `service/support/table-converter` module.

### Authentication

Currently, the driver has authentication in the form of a _secret key_ (see documentation above).

The secret key gets deployed together with the adapter to Google AppEngine. Every request made to the adapter is then verified against the secret key.

The authentication functionality can be further extended by modifying the `utils/auth-middleware` module.

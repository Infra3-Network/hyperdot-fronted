## What is Hyperdot

Hyperdot is a blockchain analytics platform that allows access to and consumption of on-chain data. It can be thought of as the GitHub of the blockchain world, with its core focus on data analysis and visualization. With the help of this tool, Hyperdot users can view and exchange data from various sources, including Polkadot, Kusama, Moonbeam, Acala, HydraDX, Astar, Hashed, and hundreds of other parallel chains.

## What is Hyperdot-fronted

Hyperdot-fronted, the UI component of the Hyperdot project, can be accessed through [www.hyperdot.xyz](https://www.hyperdot.xyz) in its alpha version. It serves as a powerful interface for analyzing on-chain data, creating visualizations through charts, and facilitating user collaboration and sharing of creative insights.

### Features

#### 1. Multi-Chain Data Support

Hyperdot Frontend seamlessly integrates with multiple blockchains, including but not limited to Polkadot, Kusama, Moonbeam, Acala, HydraDX, Astar, Hashed, and many other parallel chains. This integration ensures that users have a comprehensive view of the decentralized landscape.

![Multi-chain support](./docs/imgs/multi-chains.png)

#### 2. On-chain Data Analysis and Query

![hyperdot dashboard](./docs/imgs/query-summary-2.png)

Hyperdot Frontend allows users to perform comprehensive on-chain data analysis and queries, providing valuable insights into blockchain activities.

![hyperdot dashboard](./docs/imgs/query-summary.png)

#### 3. Chart Visualization Creation

![hyperdot dashboard](./docs/imgs/dashboard-edit.png)

Users can leverage hyperdot-fronted to create visually appealing charts and graphs based on the analyzed data, enabling a deeper understanding of blockchain trends.

![hyperdot dashboard](./docs/imgs/dashboard.png)

#### 4. User-Created Content Sharing

Facilitating collaboration and knowledge sharing, hyperdot-fronted enables users to create and share their data analysis and visualizations within the Hyperdot community.

![hyperdot community](./docs/imgs/query.png)

## Getting Started

Hyperdot Frontend seamlessly integrates with Hyperdot Node, utilizing the services and interfaces it provides. To learn how to run Hyperdot Node, visit [Hyperdot Node Documentation](https://github.com/Infra3-Network/hyperdot-node).

## Docker Installation Guide (recommend)

Running the application using Docker allows for minimal setup and quick deployment. It is recommended for evaluation purposes, such as local development.

1. Clone the project to your local machine:

   ```shell
   git clone https://github.com/Infra3-Network/hyperdot-fronted.git
   ```

2. Build the Docker image:

   ```shell
   make build/docker
   ```

3. Start, stop, or remove the containers with the following commands:

   ```shell
   # Start
   make up

   # Stop
   make stop

   # Remove
   make rm
   ```

   > By default, hyperdot-fronted will use hyperdot-node http://127.0.0.1:3030 , if you want to change it, you can use the following command
   >
   > ```shell
   > make up PROXY_PASS=<You address>
   > ```

4. Now, the hyperdot-fronted service should be running. Try accessing http://localhost:8000 to explore!

## Source Code Installation Guide

1. Install dependencies

   ```shell
   npm install
   ```

   or

   ```shell
   yarn install
   ```

   or

   ```shell
   pnpm install
   ```

   > If you encounter some errors, you can try `npm install --force`.

2. Start with dev mode

   ```shell
   npm run start:dev
   ```

   > Note: If you encounter following error, you can add the `NODE_OPTIONS=--openssl-legacy-provider` environment variable and retry.
   >
   > **Error:**
   >
   > ```shell
   > node:internal/crypto/hash:68
   >   this[kHandle] = new _Hash(algorithm, xofLen);
   > ```
   >
   > **Fix:**
   >
   > ```shell
   > export NODE_OPTIONS=--openssl-legacy-provider
   > npm run start:dev
   > ```

   > Note: By default, dev mode will access the hyperdot-node http://127.0.0.1:3030 service. If you want to change this address, please modify `config/proxy.ts`.

3. Now, the hyperdot-fronted service should be running. Try visiting the link you see, e.g. http://localhost:8000 to explore!

## Testing

### Run tests with docker (recommend)

> Note: Before running the tests, you should compile the docker image

This will guide you through the steps to test various aspects of the publisher node.

```shell
make test
```

Should output

```shell
> ant-design-pro@5.2.0 serve
> umi-serve


Running 14 tests using 8 workers

     1 [chromium] › tests/e2e.creations.spec.ts:16:5 › test creation query page
     2 [firefox] › tests/e2e.user.spec.ts:5:5 › test login page

   ┌────────────────────────────────────────────────┐
   │                                                │
   │   Serving your umi project!                    │
   │                                                │
   │   - Local:            http://localhost:8001    │
   │   - On Your Network:  http://172.17.0.3:8001   │
   │                                                │
   │   Copied local address to clipboard!           │
   │                                                │
  ✓  1 [chromium] › tests/e2e.creations.spec.ts:16:5 › test creation query page (13.0s)
  ✓  2 [firefox] › tests/e2e.user.spec.ts:5:5 › test login page (13.9s)
  ✓  3 [chromium] › tests/e2e.user.spec.ts:5:5 › test login page (4.0s)
  ✓  4 [chromium] › tests/e2e.explore.spec.ts:15:5 › test explore dashboard page (12.1s)
  ✓  5 [firefox] › tests/e2e.profile.spec.ts:15:5 › test profile page (18.8s)
  ✓  6 [firefox] › tests/e2e.creations.spec.ts:16:5 › test creation query page (22.7s)
  ✓  7 [firefox] › tests/e2e.explore.spec.ts:15:5 › test explore dashboard page (23.2s)
  ✓  8 [chromium] › tests/e2e.profile.spec.ts:15:5 › test profile page (7.3s)
  ✓  9 [chromium] › tests/e2e.user.spec.ts:20:5 › test register page (4.1s)
  ✓  10 [chromium] › tests/e2e.explore.spec.ts:27:5 › test explore query page (12.0s)
  ✓  11 [chromium] › tests/e2e.creations.spec.ts:34:5 › test creation dashboard page (9.6s)
  ✓  12 [firefox] › tests/e2e.user.spec.ts:20:5 › test register page (6.5s)
  ✓  13 [firefox] › tests/e2e.creations.spec.ts:34:5 › test creation dashboard page (7.3s)
  ✓  14 [firefox] › tests/e2e.explore.spec.ts:27:5 › test explore query page (8.7s)

  Slow test file: [firefox] › tests/e2e.explore.spec.ts (31.9s)
  Slow test file: [firefox] › tests/e2e.creations.spec.ts (30.1s)
  Slow test file: [chromium] › tests/e2e.explore.spec.ts (24.2s)
  Slow test file: [chromium] › tests/e2e.creations.spec.ts (22.6s)
  Slow test file: [firefox] › tests/e2e.user.spec.ts (20.3s)
  Consider splitting slow test files to speed up parallel execution
  14 passed (36.5s)
```

### Run tests with local

1. We use jest and playwright for testing. First, you need to install playwright
   ```shell
   npx playwright install
   npx playwright install-deps
   ```
2. Run tests
   ```shell
   npx playwright test
   ```

### Run lint

If you want to run lint to check your code, you will need to:

```shell
npm run lint
```

## License

Please refer to the [LICENSE](../LICENSE).

# AI Coding Guidelines for Bryt Explorer

## Architecture Overview
- **Frontend**: React 18 app bootstrapped with Create React App, using Tailwind CSS for styling.
- **State Management**: Rematch with Immer plugin for predictable state updates; models in `src/store/models/` handle data and effects.
- **Data Fetching**: Apollo Client for GraphQL queries to backend API (configured via `REACT_APP_BASE_URL`); polling intervals (e.g., 10s) for real-time updates.
- **Web3 Integration**: Wagmi for wallet connections; custom "Bryt Network" chain (ID 257) defined in `src/wagmi.js`.
- **Routing**: React Router with nested routes; `MainLayout` provides navigation with dropdowns for Blockchain, Tokens, Services.

## Key Patterns
- **Component Structure**: Pages in `src/pages/` (e.g., `Home/`, `Blocks/`), reusable components in `src/components/` (e.g., `Pagination/`, `Contract/`).
- **Data Flow**: Components dispatch Rematch actions (e.g., `dispatch.transactions.handleGetAllTxs()`) to fetch via GraphQL; selectors access state (e.g., `useSelector(state => state.blocks.dashboard)`).
- **GraphQL Queries**: Defined in `src/queries.js`; use Apollo's `useQuery` or Rematch effects for fetching blocks, transactions, accounts.
- **Utilities**: Helpers in `src/utils/` for string shortening, block validation, value normalization, ABI decoding via 4byte.directory.
- **Icons & UI**: Phosphor icons for consistency; `react-toastify` for notifications; `react-copy-to-clipboard` for address copying.
- **Charts**: Highcharts/Recharts for transaction history; custom `TxHistoryChart` in `src/components/Grpah/`.

## Development Workflow
- **Run Locally**: `npm start` (serves on localhost:3000); `npm run build` for production.
- **Environment**: Set `REACT_APP_BASE_URL`, `REACT_APP_RPC_URL`, etc., in `.env`; invalid defaults in `src/app.config.js` for error states.
- **Testing**: `npm test` with Jest; focus on component rendering and state updates.
- **Debugging**: Use browser dev tools for Apollo cache; check GraphQL responses in Network tab; WebSocket provider commented out in `App.js`.

## Conventions
- **Imports**: Absolute paths from `src/`; group external libs, then internal components/utils.
- **Naming**: PascalCase for components, camelCase for hooks/functions; `handle*` for event handlers.
- **State Updates**: Use Rematch reducers for synchronous changes; effects for async GraphQL calls.
- **Error Handling**: Toast notifications for user feedback; console logs for dev; invalid objects (e.g., `invalidTransaction`) for fallbacks.
- **Performance**: Polling intervals for live data; lazy load heavy components if needed.

Reference: `src/App.js` for provider setup, `src/Router/index.js` for routes, `src/store/models/transactions.js` for state pattern.</content>
<parameter name="filePath">d:/tekhqs-workspace/ryt-io-explorer/bryt-explorer/.github/copilot-instructions.md
import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores(['.next/**', '.next-dev/**', 'out/**']),
  {
    rules: {
      /*
       * This codebase intentionally synchronizes several animation and
       * navigation states from browser APIs inside effects. React 19's new
       * advisory rule treats all synchronous effect updates as errors even
       * when they are guarding reduced motion or restoring route state.
       */
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])

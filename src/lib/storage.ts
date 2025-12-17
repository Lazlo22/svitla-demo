import type { StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DevtoolsOptions, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Compose function to wrap store with middleware
export const composeMiddleware = <T,>(
  stateCreator: StateCreator<T, [['zustand/immer', never]], []>,
  persistOptions: PersistOptions<T>,
  devtoolsOptions: DevtoolsOptions
) => devtools(persist(immer(stateCreator), persistOptions), { ...devtoolsOptions, enabled: import.meta.env.DEV  });

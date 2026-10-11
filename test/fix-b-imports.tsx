// Registry regression fixture: there is deliberately no runtime package import.
import type { Placement } from '@floating-ui/react-dom';
import type { BadgeProps } from '../src/components/badge';
export type RegistryTypesFixture = { placement: Placement; badge: BadgeProps };

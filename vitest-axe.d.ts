import "vitest"
import type { AxeMatchers } from "vitest-axe"

/* eslint-disable @typescript-eslint/no-empty-object-type -- declaration merging, not an empty type */
declare module "vitest" {
    interface Assertion extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
}

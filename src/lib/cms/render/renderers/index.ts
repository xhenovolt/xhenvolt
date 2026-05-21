/**
 * Registers all renderers. Importing this module wires up the registry —
 * any module that needs to dispatch on `kind` must import from here so
 * registration happens before lookup.
 */
import { registerRenderer } from "../registry";
import Hero from "./Hero";
import StatGrid from "./StatGrid";
import SystemGrid from "./SystemGrid";

registerRenderer("hero", Hero);
registerRenderer("stat-grid", StatGrid);
registerRenderer("system-grid", SystemGrid);

export { registerRenderer, getRenderer, listRendererKinds } from "../registry";

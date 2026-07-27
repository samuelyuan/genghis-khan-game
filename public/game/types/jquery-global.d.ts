/// <reference types="jquery" />

// jQuery loads via a <script> tag, not an import, so re-expose its types as globals.
declare global {
  const $: JQueryStatic;
  const jQuery: JQueryStatic;
}

export {};

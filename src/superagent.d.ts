// fix issues where @types/superagent looks for some DOM types
// see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/12044
declare interface XMLHttpRequest {}
declare interface Blob {}
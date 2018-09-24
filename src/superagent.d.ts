// fix issues where @types/superagent looks for some DOM types
declare interface XMLHttpRequest {}
declare interface Blob {}
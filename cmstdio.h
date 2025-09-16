#ifndef CMSTDIO_H
#define CMSTDIO_H

#define printf(...) ((void)0)  // No-op in WASM unless redirected
#define puts(...)   ((void)0)

#endif
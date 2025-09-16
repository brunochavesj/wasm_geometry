#ifndef CMSTDLIB_H
#define CMSTDLIB_H

#include <stddef.h>

#define NULL ((void*)0)

// Define `size_t` explicitly if missing
#ifndef SIZE_T_DEFINED
typedef unsigned long size_t;
#define SIZE_T_DEFINED
#endif

// Custom memory pool allocator
#define CM_MEMPOOL_SIZE (1024 * 1024 * 64)  // 64MB pool
static __attribute__((aligned(16))) unsigned char cm_mempool[CM_MEMPOOL_SIZE];
static size_t cm_mempool_offset = 0;

static inline void *cm_malloc(size_t size) {
    if (cm_mempool_offset + size > CM_MEMPOOL_SIZE) {
        return NULL;
    }
    void *ptr = &cm_mempool[cm_mempool_offset];
    cm_mempool_offset += size;
    return ptr;
}

static inline void cm_free(void *ptr) {
    // No traditional free, memory is managed via pool allocation
}

#endif // CMSTDLIB_H


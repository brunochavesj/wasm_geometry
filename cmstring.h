#ifndef CMSTRING_H
#define CMSTRING_H

#include <stddef.h>

static inline unsigned int cm_strlen(const char* str) {
    unsigned int len = 0;
    while (str[len] != '\0') len++;
    return len;
}

static inline int cm_strcmp(const char* a, const char* b) {
    while (*a && *b && *a == *b) {
        a++; b++;
    }
    return *a - *b;
}

static inline void *cm_memcpy(void *dest, const void *src, size_t n) {
    char *d = (char *)dest;
    const char *s = (const char *)src;
    while (n--) {
        *d++ = *s++;
    }
    return dest;
}

#endif // CMSTRING_H


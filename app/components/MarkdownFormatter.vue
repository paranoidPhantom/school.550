<script lang="ts" setup></script>

<template>
    <div class="__md-formatter">
        <slot />
    </div>
</template>

<style lang="scss">
.__md-formatter > div {
    > * {
        @apply mb-4;
    }
    h1 {
        @apply text-2xl sm:text-3xl font-bold opacity-100;
    }
    h2 {
        @apply text-xl sm:text-2xl font-semibold opacity-100;
    }
    h3 {
        @apply text-lg sm:text-xl font-semibold opacity-90;
    }
    h4 {
        @apply text-base sm:text-lg font-normal opacity-90;
    }
    h5 {
        @apply text-sm sm:text-base font-normal opacity-80;
    }
    h6 {
        @apply text-sm font-normal opacity-80;
    }
    p {
        @apply opacity-80;
    }
    ul {
        li {
            @apply list-disc ml-6;
        }
    }
    ol {
        li {
            @apply list-decimal ml-6;
        }
    }
    blockquote {
        @apply border-l-4 border-gray-400 pl-4 opacity-70;
    }
    table {
        thead {
            @apply text-left;
            th {
                @apply p-2 border border-gray-400 border-opacity-50 rounded-xl;
            }
        }
        tbody {
            td {
                @apply p-2 border border-gray-400 border-opacity-40;
            }
        }
    }
    a {
        @apply text-sky-500;
        &:hover {
            @apply text-sky-600;
        }
    }
    hr {
        @apply dark:opacity-10;
    }
}
</style>

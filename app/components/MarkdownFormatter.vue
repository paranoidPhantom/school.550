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
        @apply text-3xl font-bold;
    }
    h2 {
        @apply text-2xl font-semibold;
    }
    h3 {
        @apply text-xl font-semibold;
    }
    h4 {
        @apply text-lg font-normal;
    }
    h5 {
        @apply text-base font-normal;
    }
    h6 {
        @apply text-sm font-normal;
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
        @apply border-l-4 border-gray-400 pl-4 text-gray-500;
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
        @apply text-blue-500 underline;
    }
    hr {
        @apply opacity-10;
    }
}
</style>

<template>
  <UApp>
    <LayoutHeader />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }],
});

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Timestamp Tracker',
  description:
    'A simple well-structured time tracking application using Nuxt for managing projects and tasks with accurate time measurement.',
  ogImage: '/og.png',
  twitterImage: '/og.png',
  twitterCard: 'summary_large_image',
});
</script>

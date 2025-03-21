<template>
  <div class="flex items-center gap-2">
    <UButton
      v-for="(link, name) in socials"
      :key="name"
      :icon="getSocialIcon(name)"
      color="neutral"
      variant="ghost"
      size="xs"
      :to="link"
      target="_blank"
      class="rounded-full hover:bg-neutral-100 transition-colors"
      :aria-label="name"
    />

    <UButton
      :icon="getSocialIcon('email')"
      color="neutral"
      variant="ghost"
      size="xs"
      :to="`mailto:${profile.email}`"
      class="rounded-full hover:bg-neutral-100 transition-colors"
      aria-label="email"
    />
  </div>
</template>

<script setup lang="ts">
const { socials, profile } = useAppConfig();

const getSocialIcon = (platform: string): string => {
  const iconMap: Record<string, string> = {
    github: 'i-simple-icons-github',
    twitter: 'i-simple-icons-twitter',
    linkedin: 'i-simple-icons-linkedin',
    instagram: 'i-simple-icons-instagram',
    email: 'i-heroicons-envelope',
  };

  return iconMap[platform.toLowerCase()] || 'i-heroicons-link';
};
</script>

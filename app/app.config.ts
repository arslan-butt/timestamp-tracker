export default defineAppConfig({
  profile: {
    name: 'Arslan Butt',
    job: 'Fullstack developer',
    location: 'Paris, France',
    description:
      'Fullstack developer based in Paris. Working mainly with Php, Laravel, Nuxt.js, Vue.js and React.js',
    email: 'engr.arslanbutt@gmail.com',
    phone: '(+33) 7 53 09 48 62',
    website: '#',
    picture: '/arslan.png',
  },
  seo: {
    title: 'Arslan Butt | Fullstack developer',
    description: 'Arslan Butt | Fullstack developer based in Paris.',
    url: '#',
    image: 'og.png',
    lang: 'en',
  },
  socials: {
    github: 'https://github.com/arslan-butt',
    twitter: 'https://twitter.com/i_ArslanButt',
    linkedin: 'https://www.linkedin.com/in/engrarslanbutt',
    instagram: 'https://www.instagram.com/i_ArslanButt',
  },
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        // color: 'neutral'
      },
    },
  },
});

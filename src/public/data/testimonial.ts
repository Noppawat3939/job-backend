const data: { fullName: string; profile: string; message: string }[] = [
  {
    fullName: 'Sebastian Speier',
    profile:
      'https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'Mobbin is a great resource and it always comes in handy to see what the best practices or standards are for mobile patterns in our current landscape',
  },
  {
    fullName: 'Haerin Song',
    profile:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'By using the Mobbin app, I save both my research time and space in my photo galleries filled with random screenshots. I love how easy it is to search for different patterns and copy and paste flows into Figma. It is a wonderful design tool you cannot live without!',
  },
  {
    fullName: 'Rachel How',
    profile:
      'https://images.unsplash.com/photo-1484863137850-59afcfe05386?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'All my homies love Mobbin. I mean that. I finally deleted that folder of 1,866 unorganized screenshots and haven’t looked back since. Shoutout to Jiho and the team for doing God’s work.',
  },
  {
    fullName: 'Bobby Giangeruso',
    profile:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'Mobbin is one of those tabs I never close. It’s the largest up-to-date library of app screens.',
  },
  {
    fullName: 'Josiah Gulden',
    profile:
      'https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message:
      'Mobbin is one of the best ways to stay on top of the latest patterns, modalities, and visual trends in mobile product design... it’s an essential resource for my team.',
  },
];

export const testimonials = data.map((row, i) => ({ ...row, id: i + 1 }));

import dayjs from 'dayjs';

export const SUBSCRIBE_DATA = [
  {
    id: 1,
    plan: 'A',
    code_key: 'a6da842c6db5843f6c202372bd87e7bd',
    title: 'Professional',
    sub_title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, laborum!',
    price: {
      per_month: 99,
      per_year: 950,
      discount: {
        percent_per_year: 20,
        discount_end_date: dayjs('2024/12/31').toISOString(),
      },
    },
    features: [
      'Update new templates before anyone else.',
      'Unlimit customise resume template',
      'Unlimit create resume template',
      'Other feature in coming soon',
    ],
  },
  {
    id: 2,
    plan: 'B',
    code_key: 'b1edb8aaa0770cd4af88d92558f34c2e',
    title: 'Intermediat',
    sub_title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, laborum!',
    price: {
      per_month: 49,
      per_year: 529,
      discount: {
        percent_per_year: 10,
        discount_end_date: null,
      },
    },
    features: [
      'Update new templates before anyone else.',
      'Customise resume template (limit)',
      'Unlimit create resume template',
    ],
  },
  {
    id: 3,
    plan: 'C',
    title: 'Basic',
    code_key: 'ce6d317f7bc32079c749411a954d008a',
    sub_title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, laborum!',
    price: {
      per_month: 0,
      per_year: 0,
      discount: {
        percent_per_year: 0,
        discount_end_date: null,
      },
    },
    features: ['Customise resume template (limit)', 'Create resume template (limit)'],
  },
];

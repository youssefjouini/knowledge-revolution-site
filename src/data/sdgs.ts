/**
 * The Sustainable Development Goals the project contributes to.
 * Used on the home page and on /theme — edit the sentences here.
 */
import sdg4 from '@/assets/images/sdgs/sdg-04-quality-education.png';
import sdg9 from '@/assets/images/sdgs/sdg-09-industry-innovation.png';
import sdg10 from '@/assets/images/sdgs/sdg-10-reduced-inequalities.png';
import sdg17 from '@/assets/images/sdgs/sdg-17-partnerships.png';

export const sdgs = [
  {
    img: sdg4,
    n: 4,
    name: 'Quality Education',
    main: true,
    link: 'We bring the best teachers and greatest minds to every learner, anytime and anywhere, in their own language.',
  },
  {
    img: sdg9,
    n: 9,
    name: 'Industry, Innovation and Infrastructure',
    main: false,
    link: 'We use deep learning, multimodal and generative AI to build a new kind of digital infrastructure for learning.',
  },
  {
    img: sdg10,
    n: 10,
    name: 'Reduced Inequalities',
    main: false,
    link: 'Wherever students live and whatever language they speak, they get access to the same great minds.',
  },
  {
    img: sdg17,
    n: 17,
    name: 'Partnerships for the Goals',
    main: false,
    link: 'We work with ESPRIT and potential partners such as Indiana University to take the project further.',
  },
];

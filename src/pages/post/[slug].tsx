import { useEffect } from 'react';
import { AiOutlineCalendar, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { asHTML, asText } from '@prismicio/helpers';
import { RTNode } from '@prismicio/types';

import { getPrismicClient } from '../../services/prismic';

import { msToResumedTime, timestampToMediumDate } from '../../utils/dateFormatting';

import PlaceholderImage from '../../components/PlaceholderImage';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface PostContent {
  heading: string;
  body: {
    type: string;
    text: string;
    spans: Record<string, any>[];
  }[];
}

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: PostContent[];
  };
}

interface PostProps {
  post: Post;
}

const TIME_PER_WORD_MS = 300; // at a reading speed of 200 words per minute, each word would take about 300 milliseconds to be read

function calcReadingTimeMS(content: PostContent[]): number {
  return content
    .map(({ heading, body }) =>
      heading + ' ' + body.map(item => asText([item as RTNode])).join(' ')
    )
    .reduce((acc, text) =>
      acc + text.split(/\s+/).length * TIME_PER_WORD_MS
    , 0);
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter(),
        { first_publication_date } = post,
        { banner, title, author, content } = post.data;

  useEffect(() => {
    document.body.style.setProperty('--header-padding', '2.4375rem 0');
    return () => {
      document.body.style.setProperty('--header-padding', '4.5rem 0');
    }
  }, []);


  return (
    !isFallback ? (
      <article className={commonStyles.genericContainer}>
        <header className={styles.postHeader}>
          <div className={styles.bannerWrapper}>
            {
              (banner?.url) ?
              <img src={banner.url} alt={title} /> :
              <PlaceholderImage />
            }
          </div>
          <div className={commonStyles.genericContainer}>
            <h1>{title}</h1>
            <span>
              <AiOutlineCalendar size={20} />
              {
                first_publication_date ?
                timestampToMediumDate(first_publication_date) :
                '--'
              }
            </span>
            <span>
              <AiOutlineUser size={20} />
              {author}
            </span>
            <span>
              <AiOutlineClockCircle size={20} />
              {
                msToResumedTime(calcReadingTimeMS(content))
              }
            </span>
          </div>
        </header>
        <main className={styles.postContent}>
          {content.map(({ heading, body }, index) => (
            <section key={index}>
              <h2>{heading}</h2>
              {body.map((item, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{__html: asHTML([item as RTNode])}}
                />
              ))}
            </section>
          ))}
        </main>
      </article>
    ) :
    <p className={commonStyles.genericContainer}>Carregando...</p>
  );
}

const docType = 'post';

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({}),
        { results:posts } = await prismic.getByType(docType);

  return {
    paths: posts.map(post => ({params: {slug: post.uid}})),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({}),
        post = await prismic.getByUID(docType, String(params.slug));

  return {
    props: {
      post,
    },
  };
};

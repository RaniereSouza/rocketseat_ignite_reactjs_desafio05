import { useState } from 'react';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';

import { GetStaticProps } from 'next';
import Link from 'next/link';

import { timestampToMediumDate } from '../utils/dateFormatting';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [ posts, setPosts ] = useState(postsPagination.results),
        [ nextPage, setNextPage ] = useState(postsPagination.next_page);

  function fetchMorePosts() {
    fetch(nextPage)
      .then(response => response.json() as Promise<PostPagination>)
      .then(({ next_page, results }) => {
        setNextPage(next_page)
        setPosts(oldValue => [...oldValue, ...results])
      })
  }

  return (
    <>
      {
        posts.length ?
        (<ul className={`${commonStyles.genericContainer} ${styles.postListContainer}`}>
          {posts.map(({ uid, data, first_publication_date }, index) => (
            <li key={index} className={styles.postListItem}>
              <h3><Link href={`/post/${uid}`}>{data.title}</Link></h3>
              <p>{data.subtitle}</p>
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
                {data.author}
              </span>
            </li>
          ))}
        </ul>) :
        <p className={commonStyles.genericContainer}>Sem posts disponíveis no momento...</p>
      }
      {
        nextPage &&
        <button
          className={`${commonStyles.genericContainer} ${styles.morePostsBtn}`}
          onClick={fetchMorePosts}
        >
          Carregar mais posts
        </button>
      }
    </>
  );
}

const docType = 'post';

export const getStaticProps: GetStaticProps = async _ => {
  const prismic = getPrismicClient({}),
        { results, next_page } = await prismic.getByType(docType, {
          fetch: [`${docType}.title`, `${docType}.subtitle`, `${docType}.author`],
          pageSize: 5,
        });

  return {
    props: {
      postsPagination: {
        results: results.map(({ uid, first_publication_date, data }) => ({
          uid,
          first_publication_date,
          data: {
            title: data.title,
            subtitle: data.subtitle || '<Empty subtitle>',
            author: data.author || '<Unknown>',
          },
        })),
        next_page,
      }
    }
  };
};

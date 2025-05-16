import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  robots?: 'index, follow' | 'noindex, nofollow';
  ogType?: string;
}

const BASE_URL = "https://moviehub-ua.netlify.app";

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  robots = 'index, follow',
  ogType = 'website',
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : BASE_URL;
  const canonicalUrl = typeof window !== 'undefined' ? `${BASE_URL}${window.location.pathname}` : BASE_URL;

  return (
    <Helmet>
      {/* Базові теги для всіх сторінок */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
      <meta name="author" content="MovieHub" />
      <meta name="keywords" content="MovieHub, кіноафіша, фільм, кінотеатр, розклад сеансів, квитки в кіно, дивитися трейлери, новинки кіно" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Теги, що залежать від сторінки */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="MovieHub" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default MetaTags;
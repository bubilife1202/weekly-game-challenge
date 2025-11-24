import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title = "Family Game Hub - 가족과 함께 즐기는 게임 플랫폼",
  description = "가족과 함께 두뇌 게임, 영어 학습, 추억의 게임을 즐겨보세요! 설치 없이 바로 플레이 가능한 20가지 미니게임.",
  image = "/og-default.png",
  url
}: SEOProps) => {
  const siteUrl = 'https://family-game-hub.netlify.app'; // 배포 URL (나중에 환경변수로 분리 가능)
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = title.includes('Family Game Hub') ? title : `${title} | Family Game Hub`;

  return (
    <Helmet>
      {/* 기본 Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      {/* Open Graph / Facebook / Kakao */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* 추가적인 SEO 태그 */}
      <meta name="keywords" content="가족게임, 미니게임, 스네이크게임, 두뇌게임, 영어단어게임, 어린이게임, 웹게임" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

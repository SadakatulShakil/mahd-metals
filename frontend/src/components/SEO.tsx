import { Helmet } from 'react-helmet-async'

interface Props {
  title?: string
  description?: string
  canonical?: string
}

export default function SEO({
  title = 'Saddam Scarp and Metal | Global Metal Trading',
  description = 'Global scrap and alloy metal trading company based in Riyadh and Dammam, Saudi Arabia. Ferrous, non-ferrous, copper, stainless steel and specialty alloys.',
  canonical = 'https://saddamscarpandmetal.com',
}: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Saddam Scarp and Metal" />
    </Helmet>
  )
}

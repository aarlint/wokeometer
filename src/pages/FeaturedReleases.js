import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

const FeaturedReleases = () => {
  // Placeholder featured content - this would be managed dynamically in a real implementation
  const featuredArticles = [
    {
      id: 1,
      title: "Netflix's Latest Original: A Case Study in Woke Messaging",
      excerpt: "An in-depth analysis of how modern streaming platforms are incorporating ideological messaging into mainstream entertainment, examining specific examples and their impact on storytelling.",
      date: "2024-01-15",
      author: "Woke-O-Meter Editorial Team",
      category: "Analysis",
      image: null, // Placeholder for future image support
      content: `Netflix's recent original series represents a concerning trend in modern entertainment where narrative quality takes a backseat to ideological messaging. Through our community assessment process, this production scored exceptionally high across multiple wokeness categories.

The series demonstrates several concerning patterns that have become increasingly common in contemporary media production. From heavy-handed social commentary to the prioritization of representation over character development, these elements fundamentally alter the viewing experience.

Our analysis reveals that when entertainment platforms prioritize messaging over storytelling, the result is often content that feels more like activism than entertainment. This approach not only alienates significant portions of the audience but also undermines the quality of the medium itself.

The community response has been overwhelmingly clear: viewers are seeking entertainment that respects their intelligence and doesn't lecture them. When creators focus on craft over ideology, the results speak for themselves in both critical reception and audience engagement.

Moving forward, we encourage our community to continue submitting thoughtful assessments that help fellow viewers make informed choices about their entertainment consumption.`
    },
    {
      id: 2,
      title: "Hollywood's Messaging Problem: When Entertainment Becomes Activism",
      excerpt: "Exploring the growing trend of major studios prioritizing political messaging over storytelling quality, and how this affects the entertainment industry as a whole.",
      date: "2024-01-08",
      author: "Woke-O-Meter Editorial Team", 
      category: "Editorial",
      image: null,
      content: `The entertainment industry has always reflected cultural values, but recent trends suggest a significant departure from traditional storytelling approaches. Major studios are increasingly producing content that prioritizes ideological messaging over narrative quality.

This shift represents more than just changing creative preferences—it reflects a fundamental misunderstanding of entertainment's role in society. When studios treat their audiences as targets for conversion rather than entertainment, the result is content that feels more like propaganda than art.

The financial implications are becoming increasingly clear. Productions that prioritize messaging over quality consistently underperform at the box office, suggesting that audiences are rejecting this approach with their wallets.

Our platform exists to help viewers navigate this landscape by providing transparent, community-driven assessments of content. We believe that informed audiences make better choices, and those choices ultimately drive positive change in the industry.

The path forward requires a return to the principles that made entertainment great: compelling characters, engaging stories, and respect for the audience's intelligence.`
    },
    {
      id: 3,
      title: "The Rise of Based Content: Supporting Creators Who Respect Their Audience",
      excerpt: "Highlighting independent creators and productions that prioritize storytelling over messaging, and how viewers can support quality entertainment.",
      date: "2024-01-01",
      author: "Woke-O-Meter Editorial Team",
      category: "Positive Spotlight",
      image: null,
      content: `While much of our coverage focuses on problematic content, it's equally important to highlight creators who are producing quality entertainment that respects their audiences. These productions demonstrate that compelling storytelling doesn't require ideological messaging.

Independent creators are leading the charge in this regard, often producing content with limited budgets but unlimited creativity. These productions focus on universal themes, compelling characters, and engaging narratives that resonate across diverse audiences.

Supporting these creators is crucial for the future of entertainment. When audiences actively seek out and support quality content, they send a clear message to the industry about what they value.

Our assessment system helps identify these positive examples by highlighting content with low wokeness scores that still manages to be engaging and meaningful. These productions prove that entertainment can be both thoughtful and respectful of diverse viewpoints.

We encourage our community to actively seek out and support creators who prioritize craft over ideology. Every view, purchase, and recommendation helps build a more balanced entertainment landscape.`
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Analysis':
        return 'bg-blue-100 text-blue-800';
      case 'Editorial':
        return 'bg-purple-100 text-purple-800';
      case 'Positive Spotlight':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Releases
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          In-depth analysis and commentary on the state of modern entertainment, highlighting both concerning trends and positive developments in the industry.
        </p>
      </div>

      <div className="space-y-12">
        {featuredArticles.map((article) => (
          <article key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {article.excerpt}
              </p>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                By {article.author}
              </div>
            </div>

            {/* Content Preview */}
            <div className="px-8 pb-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {article.content.split('\n\n').slice(0, 2).map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {article.content.split('\n\n').length > 2 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold">
                    Read Full Article
                    <FaExternalLinkAlt className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-primary bg-opacity-10 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Stay Informed
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Help us build a comprehensive database of entertainment assessments. Your contributions help fellow viewers make informed decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/new"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold"
          >
            Submit an Assessment
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary transition-colors font-semibold"
          >
            Browse Assessments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedReleases; 